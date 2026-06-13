// Clean dev launcher — prevents the recurring
// "missing required error components, refreshing..." error.
//
// Root cause of that error: multiple `next dev` servers running at once, all
// writing to the same .next cache and corrupting each other. This script
// guarantees a single clean server every time:
//   1. Kills any stray `next` node processes (except this one).
//   2. Deletes the (possibly corrupted) .next cache.
//   3. Starts exactly one dev server on a fixed port.
//
// Run with:  npm run dev

const { execSync, spawn } = require('child_process')
const fs = require('fs')
const net = require('net')
const path = require('path')

const PORT = 3002
const ROOT = path.join(__dirname, '..')
const NEXT_DIR = path.join(ROOT, '.next')
const SELF_PID = process.pid

function killStrayNextServers() {
  if (process.platform !== 'win32') {
    try {
      execSync("pkill -f 'next dev' || true", { stdio: 'ignore' })
    } catch {}
    return
  }
  // Windows: find every node process whose command line mentions "next"
  // and kill all except this launcher.
  // NOTE: the PowerShell uses ONLY single quotes internally so it can be
  // safely wrapped in the outer -Command "..." double quotes. Using -Filter
  // "Name='node.exe'" here would nest double quotes and silently break.
  try {
    const ps = [
      'Get-CimInstance Win32_Process',
      "| Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*next*' -and $_.ProcessId -ne " + SELF_PID + ' }',
      '| ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }',
    ].join(' ')
    execSync(`powershell -NoProfile -Command "${ps}"`, { stdio: 'ignore' })
  } catch {}
}

function clearCache() {
  try {
    fs.rmSync(NEXT_DIR, { recursive: true, force: true })
  } catch {}
}

// Killing a process doesn't release its TCP port instantly on Windows, so we
// poll until the port is actually bindable before starting the new server.
function isPortFree(port) {
  return new Promise((resolve) => {
    // Next binds on IPv6 ('::'), so we must test the same stack — testing
    // '0.0.0.0' alone would report "free" while the port is still held on '::'.
    const tester = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => tester.close(() => resolve(true)))
      .listen(port, '::')
  })
}

async function waitForPortFree(port, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    if (await isPortFree(port)) return true
    await new Promise((r) => setTimeout(r, 250))
  }
  return false
}

async function main() {
  console.log('› Stopping any stray dev servers...')
  killStrayNextServers()

  console.log('› Clearing .next cache...')
  clearCache()

  console.log(`› Waiting for port ${PORT} to free up...`)
  const free = await waitForPortFree(PORT)
  if (!free) {
    console.error(`✗ Port ${PORT} is still in use after waiting. Close whatever is using it and retry.`)
    process.exit(1)
  }

  console.log(`› Starting a single clean dev server on http://localhost:${PORT}\n`)
const child = spawn(
  process.execPath,
  ['--max-old-space-size=4096', path.join('node_modules', 'next', 'dist', 'bin', 'next'), 'dev', '-p', String(PORT)],
  { cwd: ROOT, stdio: 'inherit', shell: false }
)

  child.on('exit', (code) => process.exit(code ?? 0))
}

main()
