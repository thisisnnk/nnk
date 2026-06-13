'use client'
import { useEffect, useRef } from 'react'

export default function NeuralVortex() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const gl = canvasEl.getContext('webgl') || canvasEl.getContext('experimental-webgl') as WebGLRenderingContext | null
    if (!gl) return

    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
        }
        return res.x + res.y;
      }

      void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = 0.5 * pow(1. - p, 4.);
        float t = .001 * u_time;
        vec3 color = vec3(0.);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.);
        noise = max(.0, noise - .45);
        noise *= (1. - length(vUv - .5));
        color = vec3(0.0, 0.42, 0.8);
        color = mix(color, vec3(0.0, 0.667, 1.0), 0.32 + 0.16 * sin(2.0 * u_scroll_progress + 1.2));
        color += vec3(0.0, 0.25, 0.55) * sin(2.0 * u_scroll_progress + 1.5);
        color = color * noise;
        gl_FragColor = vec4(color, noise);
      }
    `

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime     = gl.getUniformLocation(program, 'u_time')
    const uRatio    = gl.getUniformLocation(program, 'u_ratio')
    const uPointer  = gl.getUniformLocation(program, 'u_pointer_position')
    const uScroll   = gl.getUniformLocation(program, 'u_scroll_progress')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvasEl.width  = window.innerWidth  * dpr
      canvasEl.height = window.innerHeight * dpr
      gl.viewport(0, 0, canvasEl.width, canvasEl.height)
      gl.uniform1f(uRatio, canvasEl.width / canvasEl.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const render = () => {
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.2
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.2
      gl.uniform1f(uTime, performance.now())
      gl.uniform2f(uPointer,
        pointer.current.x / window.innerWidth,
        1 - pointer.current.y / window.innerHeight
      )
      gl.uniform1f(uScroll, window.pageYOffset / (2 * window.innerHeight))
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }
    render()

    const onMove = (e: PointerEvent) => { pointer.current.tX = e.clientX; pointer.current.tY = e.clientY }
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) { pointer.current.tX = e.touches[0].clientX; pointer.current.tY = e.touches[0].clientY }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('touchmove', onTouch)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchmove', onTouch)
      cancelAnimationFrame(rafRef.current)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1, filter: 'blur(72px)', transform: 'scale(1.1)', maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 15%, black 35%, black 65%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 15%, black 35%, black 65%, transparent 100%)' }}
    />
  )
}
