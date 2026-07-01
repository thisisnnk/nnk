'use client'

/* ------------------------------------------------------------------ *
 *  ItineraryUserFlow — AH-Itinerary user-flow diagram                 *
 *                                                                     *
 *  A self-contained, dark-canvas flow diagram (Create · Edit · View / *
 *  Download · Keywords · Dashboard). The diagram is drawn imperatively *
 *  into a fixed 1380×1870 SVG and shown on its own dark panel so it    *
 *  reads identically in light + dark mode. Horizontally scrollable on  *
 *  narrow screens — never wraps, never rescales the geometry.          *
 * ------------------------------------------------------------------ */

import React, { useEffect, useRef } from 'react'

export default function ItineraryUserFlow() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const NS = 'http://www.w3.org/2000/svg'

    /* ── SVG helpers ─────────────────────────────────────── */
    function e(tag: string, a: Record<string, string | number> = {}) {
      const el = document.createElementNS(NS, tag)
      for (const [k, v] of Object.entries(a)) el.setAttribute(k, String(v))
      return el
    }
    function app<T extends Node>(el: T): T {
      svg!.appendChild(el)
      return el
    }

    /* ── Arrow markers ───────────────────────────────────── */
    const defs = app(e('defs'))
    const MARKERS: Record<string, string> = {
      gray: '#4b5563',
      green: '#10b981',
      blue: '#3b82f6',
      amber: '#d97706',
      purple: '#7c3aed',
      cyan: '#0891b2',
      red: '#ef4444',
    }
    for (const [id, color] of Object.entries(MARKERS)) {
      const m = e('marker', { id: `iuf-arr-${id}`, markerWidth: 8, markerHeight: 6, refX: 7, refY: 3, orient: 'auto' })
      const p = e('polygon', { points: '0 0,8 3,0 6', fill: color })
      m.appendChild(p)
      defs.appendChild(m)
    }

    /* Background */
    app(e('rect', { width: 1380, height: 1870, fill: '#0d0d0d' }))

    /* ── Node draw helpers ───────────────────────────────── */
    const D = {
      term: { w: 220, h: 40, rx: 20 },
      screen: { w: 240, h: 52, rx: 8 },
      action: { w: 240, h: 42, rx: 21 },
      dec: { hw: 70, hh: 38 },
    } as const

    function txt(
      parent: Element,
      cx: number,
      cy: number,
      lines: string[],
      color: string,
      size = 10.5,
      weight: string | number = '500',
    ) {
      const t = e('text', {
        'text-anchor': 'middle',
        fill: color,
        'font-size': size,
        'font-family': 'Inter,system-ui,sans-serif',
        'font-weight': weight,
      })
      if (lines.length === 1) {
        t.setAttribute('x', String(cx))
        t.setAttribute('y', String(cy))
        t.setAttribute('dominant-baseline', 'middle')
        t.textContent = lines[0]
      } else {
        const lh = size * 1.45
        const totalH = (lines.length - 1) * lh
        lines.forEach((line, i) => {
          const sp = e('tspan', { x: cx, dy: i === 0 ? -(totalH / 2) : lh })
          sp.setAttribute('dominant-baseline', 'middle')
          sp.textContent = line
          t.appendChild(sp)
        })
        t.setAttribute('x', String(cx))
        t.setAttribute('y', String(cy))
      }
      parent.appendChild(t)
    }

    function node(
      cx: number,
      cy: number,
      type: 'term' | 'screen' | 'action' | 'dec',
      lines: string[],
      stroke: string,
      fill: string,
      tc: string,
      id = '',
    ) {
      const g = app(e('g', id ? { id } : {}))
      if (type === 'dec') {
        const { hw, hh } = D.dec
        g.appendChild(
          e('polygon', {
            points: `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`,
            fill,
            stroke,
            'stroke-width': 1.5,
          }),
        )
        txt(g, cx, cy, lines, tc, 10, '500')
      } else {
        const d = D[type]
        g.appendChild(
          e('rect', {
            x: cx - d.w / 2,
            y: cy - d.h / 2,
            width: d.w,
            height: d.h,
            rx: d.rx,
            ry: d.rx,
            fill,
            stroke,
            'stroke-width': 1.5,
          }),
        )
        txt(g, cx, cy, lines, tc, 10.5, type === 'screen' ? '500' : '600')
      }
    }

    function arrow(d: string, markerId: string, dashArr?: string) {
      const p = e('path', {
        d,
        fill: 'none',
        stroke: MARKERS[markerId] || MARKERS.gray,
        'stroke-width': 1.5,
        'marker-end': `url(#iuf-arr-${markerId})`,
      })
      if (dashArr) p.setAttribute('stroke-dasharray', dashArr)
      app(p)
    }

    function edgeLbl(x: number, y: number, text: string, col = '#6b7280') {
      const t = e('text', {
        x,
        y,
        fill: col,
        'font-size': 9.5,
        'font-family': 'Inter,system-ui,sans-serif',
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
      })
      t.textContent = text
      app(t)
    }

    function sectionLbl(x: number, y: number, text: string, col?: string) {
      const t = e('text', {
        x,
        y,
        fill: col || '#374151',
        'font-size': 9,
        'font-family': 'Inter,system-ui,sans-serif',
        'font-weight': '700',
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'letter-spacing': '1.2',
      })
      t.textContent = text.toUpperCase()
      app(t)
    }

    /* ── SECTION LABELS ──────────────────────────────────── */
    sectionLbl(210, 105, '← Dashboard Analytics', '#1d4a2a')
    sectionLbl(620, 105, 'Primary Flow — Create Itinerary', '#5c3a00')
    sectionLbl(1140, 105, 'Secondary Actions ▶', '#1a2a4a')

    /* Vertical divider lines (subtle) */
    app(e('line', { x1: 430, y1: 130, x2: 430, y2: 1820, stroke: '#161616', 'stroke-width': 1 }))
    app(e('line', { x1: 870, y1: 130, x2: 870, y2: 1820, stroke: '#161616', 'stroke-width': 1 }))

    /* ════════ EDGES (drawn before nodes so nodes sit on top) ════════ */

    /* ── Left column internal ── */
    arrow('M210,221 L210,309', 'green') // dash → analytics
    arrow('M210,351 L210,439', 'blue') // analytics → edit btn
    arrow('M210,481 L210,554', 'amber') // edit → stu_edit

    /* stu_edit → step1 (cross into main flow) */
    arrow('M330,580 L430,580 L430,795 L500,795', 'amber')

    /* ── Management branches LEFT ── */
    arrow('M500,200 L330,200', 'green') // mgmt → dash
    arrow('M620,226 L390,226 L390,460 L330,460', 'blue') // mgmt → edit btn

    /* ── Management branches RIGHT ── */
    arrow('M740,200 L1010,200', 'blue') // right spine from mgmt
    app(e('line', { x1: 1010, y1: 200, x2: 1010, y2: 1340, stroke: MARKERS.blue, 'stroke-width': 1.5 }))
    arrow('M1010,320 L1000,320', 'blue') // → view_btn
    arrow('M1010,440 L1000,440', 'blue') // → dup_btn
    arrow('M1010,645 L1000,645', 'blue') // → del_btn
    arrow('M1010,1005 L1000,1005', 'blue') // → kw_btn

    /* ── Right column internal ── */
    arrow('M1140,461 L1140,520', 'green') // dup → dup_end
    arrow('M1140,666 L1140,737', 'red') // del → dec_pass
    arrow('M1140,813 L1140,875', 'red') // dec_pass Yes → del_done
    arrow('M1140,1026 L1140,1094', 'cyan') // kw_btn → kw_page
    arrow('M1140,1146 L1140,1214', 'cyan') // kw_page → kw_crud
    arrow('M1140,1256 L1140,1320', 'cyan') // kw_crud → kw_end
    edgeLbl(1155, 1285, 'Used in Studio', '#0891b2')

    /* dec_pass No label */
    edgeLbl(1062, 775, 'Yes', MARKERS.red)
    const decPNo = app(
      e('text', {
        x: 1055,
        y: 813,
        fill: '#4b5563',
        'font-size': 9.5,
        'font-family': 'Inter,system-ui,sans-serif',
        'text-anchor': 'start',
        'dominant-baseline': 'middle',
      }),
    )
    decPNo.textContent = 'No → back to Management'

    /* view → Preview (long connection via dashed line) */
    arrow('M1140,341 C1140,1080 980,1080 980,1474', 'purple', '5,4')
    edgeLbl(1080, 900, '↳ Preview', '#7c3aed')

    /* ── Main Create Flow ── */
    arrow('M620,90 L620,174', 'gray') // start → mgmt
    arrow('M620,226 L620,299', 'amber') // mgmt → create
    arrow('M620,341 L620,409', 'amber') // create → cat_modal
    arrow('M620,461 L620,522', 'amber') // cat_modal → dec_sel
    arrow('M620,598 L620,659', 'amber') // dec_sel Yes → code_ok
    edgeLbl(638, 627, 'Yes', MARKERS.amber)
    arrow('M550,560 L480,560 L480,435 L500,435', 'gray', '4,3') // dec_sel No loop
    edgeLbl(464, 495, 'No', '#4b5563')
    arrow('M620,701 L620,769', 'amber') // code_ok → step1
    arrow('M620,821 L620,884', 'amber') // step1 → step2
    edgeLbl(638, 853, 'Next ›', MARKERS.amber)
    arrow('M620,936 L620,999', 'amber')
    edgeLbl(638, 968, 'Next ›', MARKERS.amber)
    arrow('M620,1051 L620,1114', 'amber')
    edgeLbl(638, 1083, 'Next ›', MARKERS.amber)
    arrow('M620,1166 L620,1234', 'green') // step4 → save
    arrow('M620,1276 L620,1337', 'green') // save → dec_prev
    arrow('M550,1375 L495,1375', 'gray') // dec_prev No → stay
    edgeLbl(523, 1363, 'No', '#4b5563')
    arrow('M690,1375 L980,1375 L980,1474', 'purple') // dec_prev Yes → preview
    edgeLbl(835, 1362, 'Yes', MARKERS.purple)
    arrow('M980,1527 L980,1592', 'purple') // preview → dec_dl
    arrow('M980,1668 L980,1730', 'green') // dec_dl Yes → pdf
    edgeLbl(1000, 1700, 'Yes', MARKERS.green)
    arrow('M910,1630 L720,1630 L720,1730', 'gray') // dec_dl No → back
    edgeLbl(815, 1618, 'No', '#4b5563')

    /* Unsaved changes guard (dashed loop from any step → mgmt) */
    arrow('M500,900 L450,900 L450,195 L500,195', 'gray', '4,3')
    edgeLbl(432, 550, 'Unsaved change guard', '#2d2d2d')

    /* ════════ NODES (drawn on top of edges) ════════ */

    /* ── Left column: Dashboard ── */
    node(210, 200, 'screen', ['Dashboard', '/ (root)'], '#10b981', '#061a0f', '#6ee7b7', 'dash')
    node(210, 330, 'action', ['Date · Region · Group Type Filters', 'KPI Cards + Charts'], '#059669', '#041a0c', '#6ee7b7')
    node(210, 460, 'action', ['✏ Edit Row', '(from Management)'], '#3b82f6', '#0a1628', '#93c5fd')
    node(210, 580, 'screen', ['Studio — Edit Mode', '/studio/:id (pre-loaded)'], '#f59e0b', '#1c1200', '#fcd34d')

    /* ── Main flow: center ── */
    node(620, 70, 'term', ['▶ Open App'], '#f59e0b', '#1c1200', '#fbbf24', 'start')
    node(620, 200, 'screen', ['Management', '/management'], '#3b82f6', '#0a1628', '#93c5fd', 'mgmt')
    node(620, 320, 'action', ['+ Create Itinerary'], '#f59e0b', '#1c1200', '#fbbf24')
    node(620, 435, 'screen', ['Category Modal', 'Region · Group Type · Consultant'], '#f59e0b', '#1c1200', '#fcd34d')
    node(620, 560, 'dec', ['All fields', 'selected?'], '#4b5563', '#161616', '#d1d5db')
    node(620, 680, 'action', ['Code Issued · Counter Incremented'], '#f59e0b', '#1c1200', '#fbbf24')
    node(620, 795, 'screen', ['Step 1 — Summary', 'Consultant · Client · Trip · Pricing'], '#f59e0b', '#1c1200', '#fcd34d')
    node(620, 910, 'screen', ['Step 2 — Itinerary', 'Day Plans + Keyword Picker'], '#f59e0b', '#1c1200', '#fcd34d')
    node(620, 1025, 'screen', ['Step 3 — Details', 'Notes · Inclusions · Exclusions'], '#f59e0b', '#1c1200', '#fcd34d')
    node(620, 1140, 'screen', ['Step 4 — Policies', 'T&C · Cancellation Policy'], '#f59e0b', '#1c1200', '#fcd34d')
    node(620, 1255, 'action', ['💾 Confirm & Save'], '#10b981', '#061a0f', '#34d399')
    node(620, 1375, 'dec', ['Preview', 'Itinerary?'], '#4b5563', '#161616', '#d1d5db')
    node(380, 1375, 'term', ['Stay in Studio'], '#4b5563', '#161616', '#6b7280')

    /* Preview branch */
    node(980, 1500, 'screen', ['Preview Page', '/preview/:id'], '#8b5cf6', '#130c2b', '#c4b5fd')
    node(980, 1630, 'dec', ['Download', 'PDF?'], '#4b5563', '#161616', '#d1d5db')
    node(980, 1760, 'term', ['📄 PDF Downloaded'], '#10b981', '#061a0f', '#34d399')
    node(720, 1760, 'term', ['← Back to Management'], '#4b5563', '#161616', '#6b7280')

    /* ── Right column ── */
    node(1140, 320, 'action', ['🔍 View Row', '(from Management)'], '#3b82f6', '#0a1628', '#93c5fd', 'view_btn')
    node(1140, 440, 'action', ['⧉ Duplicate Row'], '#3b82f6', '#0a1628', '#93c5fd')
    node(1140, 540, 'term', ['New Record Created', '(suffix code e.g. -001A)'], '#10b981', '#061a0f', '#34d399')
    node(1140, 645, 'action', ['🗑 Delete Row'], '#ef4444', '#1a0000', '#fca5a5')
    node(1140, 775, 'dec', ['Password', 'correct?'], '#4b5563', '#161616', '#d1d5db')
    node(1140, 895, 'term', ['Record Deleted'], '#ef4444', '#1a0000', '#fca5a5')
    node(1140, 1005, 'action', ['Keywords Library'], '#06b6d4', '#001518', '#67e8f9')
    node(1140, 1120, 'screen', ['Keywords Library', '/keywords'], '#06b6d4', '#001518', '#67e8f9')
    node(1140, 1235, 'action', ['Add / Edit / Delete', 'Keyword Templates'], '#0891b2', '#001518', '#67e8f9')
    node(1140, 1340, 'term', ['Templates ready in', 'Studio Step 2 Picker'], '#0891b2', '#001518', '#67e8f9')

    return () => {
      if (svg) while (svg.firstChild) svg.removeChild(svg.firstChild)
    }
  }, [])

  const legend: { label: string; bg: string; border: string }[] = [
    { label: 'Management', bg: '#0a1628', border: '#3b82f6' },
    { label: 'Itinerary Studio', bg: '#1c1200', border: '#f59e0b' },
    { label: 'Preview / PDF', bg: '#130c2b', border: '#8b5cf6' },
    { label: 'Dashboard / Success', bg: '#061a0f', border: '#10b981' },
    { label: 'Keywords', bg: '#001518', border: '#06b6d4' },
    { label: 'Delete', bg: '#1a0000', border: '#ef4444' },
    { label: 'Decision / Neutral', bg: '#161616', border: '#4b5563' },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <div className="px-5 pt-5 pb-1">
        <p className="text-[15px] font-bold tracking-tight" style={{ color: '#f8fafc' }}>
          AH Itinerary Tool — User Flow Diagram
        </p>
        <p className="text-[12px] mt-1" style={{ color: '#6b7280' }}>
          Primary flow: Create Itinerary · Secondary: Edit · View / Download PDF · Keywords · Dashboard Analytics
        </p>
      </div>

      <div className="overflow-x-auto px-5 pb-4">
        <div style={{ minWidth: 1380 }}>
          <svg ref={svgRef} viewBox="0 0 1380 1870" style={{ display: 'block', width: '100%' }} role="img" aria-label="AH Itinerary user flow diagram" />
        </div>
      </div>

      <div
        className="flex flex-wrap gap-x-5 gap-y-2.5 px-5 py-4"
        style={{ borderTop: '1px solid #1a1a1a' }}
      >
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-[11px]" style={{ color: '#9ca3af' }}>
            <span
              className="inline-block rounded-[3px]"
              style={{ width: 26, height: 14, background: l.bg, border: `1.5px solid ${l.border}` }}
            />
            {l.label}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] basis-full" style={{ color: '#4b5563' }}>
          <span>⬭ Terminal — Start / End</span>
          <span>▭ Rectangle — Page / Screen</span>
          <span>⬰ Pill — Action / Button</span>
          <span>◇ Diamond — Decision</span>
        </div>
      </div>
    </div>
  )
}
