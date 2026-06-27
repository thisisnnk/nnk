/* ------------------------------------------------------------------ *
 *  AH-CRM — Information Architecture data (single source of truth)     *
 *                                                                     *
 *  Shared by the case-study IA components:                            *
 *    • AccessArchitecture  — By Role / By Module / Access Matrix       *
 *    • RoleSitemap         — per-role navigation tree (Login → …)      *
 * ------------------------------------------------------------------ */

export type RoleKey =
  | 'admin' | 'employee' | 'execution' | 'accounts'
  | 'itinerary' | 'owner' | 'tour_guide' | 'backend'

export interface Role {
  key: RoleKey
  label: string
  short: string
  color: string
  landing: string
  blurb: string
  /** Short note on what the role is gated out of. */
  restrict: string
}

// Role accent colours are shared across every IA visual for continuity.
export const ROLES: Role[] = [
  { key: 'admin',      label: 'Admin',      short: 'Adm', color: '#3b82f6', landing: '/dashboard',        blurb: 'Full system access — every module',          restrict: 'Nothing — full access' },
  { key: 'employee',   label: 'Employee',   short: 'Emp', color: '#8b5cf6', landing: '/dashboard',        blurb: 'Sales only — own leads, trips, tasks',       restrict: "Others' leads · business metrics" },
  { key: 'execution',  label: 'Execution',  short: 'Exc', color: '#10b981', landing: '/quotation',        blurb: 'Operations — quoting, execution, payments',  restrict: 'Console · employee performance' },
  { key: 'accounts',   label: 'Accounts',   short: 'Acc', color: '#f59e0b', landing: '/general-ledger',   blurb: 'Finance only — ledger & alerts',             restrict: 'Lead details · contacts · trips' },
  { key: 'itinerary',  label: 'Itinerary',  short: 'Itn', color: '#06b6d4', landing: '/itineraries',      blurb: 'Itinerary requests & responses',             restrict: 'Financial data · console' },
  { key: 'owner',      label: 'Owner',      short: 'Own', color: '#b45309', landing: '/owner-dashboard',  blurb: 'Cross-team read access everywhere',           restrict: 'Editing · field & verification tools' },
  { key: 'tour_guide', label: 'Tour Guide', short: 'Gde', color: '#0f766e', landing: '/tour-guide/trips', blurb: 'Field ops — assigned trips & expenses',      restrict: 'All other leads · financial data' },
  { key: 'backend',    label: 'Backend',    short: 'Bk',  color: '#6366f1', landing: '/verify-trips',     blurb: 'Quality gate — slot verification',           restrict: 'Financial data · owner dashboard' },
]

export const ROLE_MAP: Record<RoleKey, Role> = Object.fromEntries(
  ROLES.map((r) => [r.key, r]),
) as Record<RoleKey, Role>

export const ALL: RoleKey[] = ROLES.map((r) => r.key)

/* ---------------------------------------------------------------- */
/*  Pages × modules — the enforced access model                     */
/* ---------------------------------------------------------------- */

export interface Page { route: string; label: string; roles: RoleKey[] }
export interface Module { name: string; color: string; pages: Page[] }

export const MODULES: Module[] = [
  {
    name: 'Sales & CRM', color: '#185FA5',
    pages: [
      { route: '/dashboard',      label: 'Dashboard',      roles: ['admin', 'employee'] },
      { route: '/leads',          label: 'Leads',          roles: ['admin', 'employee', 'execution', 'owner'] },
      { route: '/leads/:id',      label: 'Lead Detail',    roles: ['admin', 'employee', 'execution', 'owner'] },
      { route: '/leads-activity', label: 'Leads Activity', roles: ['admin', 'employee'] },
      { route: '/contacts',       label: 'Contacts',       roles: ['admin', 'owner'] },
      { route: '/contacts/:id',   label: 'Contact Detail', roles: ['admin', 'owner'] },
      { route: '/my-trips',       label: 'My Trips',       roles: ['admin', 'employee'] },
      { route: '/trips',          label: 'All Trips',      roles: ['admin'] },
      { route: '/my-tasks',       label: 'My Tasks',       roles: ['admin', 'employee'] },
      { route: '/notifications',  label: 'Notifications',  roles: ALL },
    ],
  },
  {
    name: 'Execution', color: '#D97706',
    pages: [
      { route: '/quotation',             label: 'Quotation',         roles: ['admin', 'execution', 'owner'] },
      { route: '/quotation/respond/:id', label: 'Quotation Respond', roles: ['admin', 'execution'] },
      { route: '/execution',             label: 'Execution',         roles: ['admin', 'execution', 'owner'] },
      { route: '/trip-payments',         label: 'Trip Payments',     roles: ['admin', 'execution'] },
    ],
  },
  {
    name: 'Itinerary', color: '#DB2777',
    pages: [
      { route: '/itineraries',             label: 'Itineraries',       roles: ['admin', 'itinerary'] },
      { route: '/itineraries/respond/:id', label: 'Itinerary Respond', roles: ['admin', 'itinerary'] },
    ],
  },
  {
    name: 'Accounts', color: '#7C3AED',
    pages: [
      { route: '/general-ledger', label: 'General Ledger', roles: ['admin', 'accounts', 'owner'] },
    ],
  },
  {
    name: 'Owner', color: '#DC2626',
    pages: [
      { route: '/owner-dashboard',      label: 'Owner Dashboard',      roles: ['admin', 'owner'] },
      { route: '/employee-performance', label: 'Employee Performance', roles: ['admin', 'owner'] },
    ],
  },
  {
    name: 'Tour Guide', color: '#0891B2',
    pages: [
      { route: '/tour-guide/trips',     label: 'My Trips',    roles: ['admin', 'tour_guide'] },
      { route: '/tour-guide/trips/:id', label: 'Trip Detail', roles: ['admin', 'tour_guide'] },
    ],
  },
  {
    name: 'Backend Verification', color: '#6B7280',
    pages: [
      { route: '/verify-trips',     label: 'Verify Trips',       roles: ['admin', 'backend'] },
      { route: '/verify-trips/:id', label: 'Verify Trip Detail', roles: ['admin', 'backend'] },
    ],
  },
  {
    name: 'Admin Tools', color: '#3B6D11',
    pages: [
      { route: '/console', label: 'Console', roles: ['admin', 'owner'] },
      { route: '/tasks',   label: 'Tasks',   roles: ['admin'] },
    ],
  },
]

export const ALL_PAGES: Page[] = MODULES.flatMap((m) => m.pages)
export const TOTAL_PAGES = ALL_PAGES.length // 25

// Per-role page count derived from the matrix so totals never drift.
export const COUNT: Record<RoleKey, number> = Object.fromEntries(
  ALL.map((k) => [k, ALL_PAGES.filter((p) => p.roles.includes(k)).length]),
) as Record<RoleKey, number>

export const STATS = [
  { value: '8',  label: 'Roles' },
  { value: '25', label: 'Pages' },
  { value: '7',  label: 'Modules' },
  { value: '16', label: 'Data Tables' },
]

/* ---------------------------------------------------------------- */
/*  Per-role navigation tree — the actual sidebar a role sees,       *
 *  with detail screens nested under their parent destination.       */
/* ---------------------------------------------------------------- */

export interface NavNode {
  label: string
  route: string
  children?: NavNode[]
}

export const ROLE_NAV: Record<RoleKey, NavNode[]> = {
  admin: [
    { label: 'Dashboard',      route: '/dashboard' },
    { label: 'Leads',          route: '/leads',          children: [{ label: 'Lead Detail', route: '/leads/:id' }] },
    { label: 'Leads Activity', route: '/leads-activity' },
    { label: 'All Trips',      route: '/trips' },
    { label: 'Contacts',       route: '/contacts',       children: [{ label: 'Contact Detail', route: '/contacts/:id' }] },
    { label: 'Tasks',          route: '/tasks' },
    { label: 'Notifications',  route: '/notifications' },
    { label: 'Console',        route: '/console' },
  ],
  employee: [
    { label: 'Dashboard',      route: '/dashboard' },
    { label: 'Leads',          route: '/leads',          children: [{ label: 'Lead Detail', route: '/leads/:id' }] },
    { label: 'Leads Activity', route: '/leads-activity' },
    { label: 'My Trips',       route: '/my-trips' },
    { label: 'My Tasks',       route: '/my-tasks' },
    { label: 'Notifications',  route: '/notifications' },
  ],
  execution: [
    { label: 'Leads',         route: '/leads',     children: [{ label: 'Lead Detail', route: '/leads/:id' }] },
    { label: 'Quotation',     route: '/quotation', children: [{ label: 'Quotation Respond', route: '/quotation/respond/:id' }] },
    { label: 'Execution',     route: '/execution' },
    { label: 'Trip Payments', route: '/trip-payments' },
    { label: 'Notifications', route: '/notifications' },
  ],
  accounts: [
    { label: 'General Ledger', route: '/general-ledger' },
    { label: 'Notifications',  route: '/notifications' },
  ],
  itinerary: [
    { label: 'Itineraries',   route: '/itineraries', children: [{ label: 'Itinerary Respond', route: '/itineraries/respond/:id' }] },
    { label: 'Notifications', route: '/notifications' },
  ],
  owner: [
    { label: 'Owner Dashboard',      route: '/owner-dashboard' },
    { label: 'Leads',                route: '/leads',    children: [{ label: 'Lead Detail', route: '/leads/:id' }] },
    { label: 'Contacts',             route: '/contacts', children: [{ label: 'Contact Detail', route: '/contacts/:id' }] },
    { label: 'Employee Performance', route: '/employee-performance' },
    { label: 'Quotation',            route: '/quotation' },
    { label: 'Execution',            route: '/execution' },
    { label: 'General Ledger',       route: '/general-ledger' },
    { label: 'Console',              route: '/console' },
    { label: 'Notifications',        route: '/notifications' },
  ],
  tour_guide: [
    { label: 'My Trips',      route: '/tour-guide/trips', children: [{ label: 'Trip Detail', route: '/tour-guide/trips/:id' }] },
    { label: 'Notifications', route: '/notifications' },
  ],
  backend: [
    { label: 'Verify Trips',  route: '/verify-trips', children: [{ label: 'Verify Trip Detail', route: '/verify-trips/:id' }] },
    { label: 'Notifications', route: '/notifications' },
  ],
}

/** Total navigable screens for a role (top-level + nested detail screens). */
export function navScreenCount(role: RoleKey): number {
  return ROLE_NAV[role].reduce((n, node) => n + 1 + (node.children?.length ?? 0), 0)
}
