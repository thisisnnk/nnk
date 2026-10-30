/* Hierarchical information-architecture trees (site-map style), keyed by project slug.
 * Structure only — these are not user flows. `d: true` marks a detail view / field / entity
 * (rendered dashed) rather than a standalone page. */

export interface IANode {
  t: string
  c?: IANode[]
  d?: boolean
}

export interface IAColumn {
  color: string // branch colour for everything under this top-level section
  n: IANode
}

export interface IATreeData {
  root: string
  cols: IAColumn[]
  note?: string
}

const P = {
  navy: '#2d3a78',
  olive: '#a6b04f',
  purple: '#6a2fbf',
  orange: '#e09b34',
  teal: '#1f8481',
  red: '#de5a52',
  plum: '#42214f',
  pink: '#d9124f',
  gray: '#7a7e82',
}

const N = (t: string, c?: IANode[], d = false): IANode => ({ t, c, d })

export const iaTrees: Record<string, IATreeData> = {
  'ah-crm': {
    root: 'Custom CRM',
    note: 'Notifications is available to every role. Owner also sees Leads, Contacts, Quotation, Execution and General Ledger.',
    cols: [
      {
        color: P.navy,
        n: N('Auth & Roles', [
          N('Login'),
          N('Admin → /dashboard'),
          N('Employee → /dashboard'),
          N('Execution → /quotation'),
          N('Accounts → /general-ledger'),
          N('Itinerary → /itineraries'),
          N('Owner → /owner-dashboard'),
          N('Tour Guide → /tour-guide/trips'),
          N('Backend → /verify-trips'),
        ]),
      },
      {
        color: P.olive,
        n: N('Sales & CRM', [
          N('Dashboard'),
          N('Leads', [N('Lead Detail', undefined, true)]),
          N('Leads Activity'),
          N('Contacts', [N('Contact Detail', undefined, true)]),
          N('All Trips'),
          N('My Trips'),
          N('My Tasks'),
          N('Notifications'),
        ]),
      },
      {
        color: P.purple,
        n: N('Execution', [
          N('Quotation', [N('Respond to Quotation', undefined, true)]),
          N('Execution'),
          N('Trip Payments'),
        ]),
      },
      { color: P.orange, n: N('Itinerary', [N('Itineraries', [N('Respond to Itinerary', undefined, true)])]) },
      { color: P.teal, n: N('Accounts', [N('General Ledger')]) },
      { color: P.red, n: N('Owner', [N('Owner Dashboard'), N('Employee Performance')]) },
      { color: P.plum, n: N('Tour Guide', [N('My Trips', [N('Trip Detail', undefined, true)])]) },
      { color: P.pink, n: N('Backend Verification', [N('Verify Trips', [N('Verify Trip Detail', undefined, true)])]) },
      { color: P.gray, n: N('Admin Tools', [N('Console'), N('Tasks')]) },
    ],
  },

  'ah-itinerary': {
    root: 'Itinerary Builder',
    note: 'Six flat routes, all reachable from the top navigation. Dashed boxes are fields on a screen, not separate pages.',
    cols: [
      {
        color: P.navy,
        n: N('Dashboard', [N('Date range filter'), N('Summary cards'), N('Charts & breakdowns')]),
      },
      {
        color: P.olive,
        n: N('Itinerary Management', [
          N('Itinerary list & filters'),
          N('Itinerary record (view / edit)'),
          N('Create New Itinerary'),
          N('Keywords Management'),
        ]),
      },
      {
        color: P.purple,
        n: N('Studio (4-step wizard)', [
          N('Region & group type'),
          N('Step 1 · Summary'),
          N('Step 2 · Day Plans'),
          N('Step 3 · Details'),
          N('Step 4 · Review & PDF'),
        ]),
      },
      {
        color: P.orange,
        n: N('Keyword Templates', [
          N('Template library'),
          N('Create template', [
            N('Keyword (unique ID)', undefined, true),
            N('Day title', undefined, true),
            N('Day notes', undefined, true),
            N('Day activities', undefined, true),
          ]),
        ]),
      },
    ],
  },

  'ah-website': {
    root: 'Website',
    note: 'Global elements appear on every page. The Back Office is staff-only.',
    cols: [
      {
        color: P.navy,
        n: N('Home', [
          N('Destination hero carousel'),
          N('Achievements & client logos'),
          N('Package discovery grid'),
          N('Testimonials'),
          N('Contact form'),
        ]),
      },
      {
        color: P.olive,
        n: N('Packages', [
          N('International', [N('Continent', undefined, true), N('Country', undefined, true)]),
          N('Domestic', [N('Region', undefined, true), N('State', undefined, true)]),
          N('Cruise'),
          N('Signature Tours'),
        ]),
      },
      {
        color: P.purple,
        n: N('Services', [N('Group tours'), N('Corporate retreats'), N('Custom itineraries'), N('Cruise bookings')]),
      },
      { color: P.orange, n: N('About', [N('CEO note'), N('Team profiles'), N('Achievement counters')]) },
      { color: P.teal, n: N('Blogs', [N('Destination guides')]) },
      { color: P.red, n: N('Album', [N('Client & trip photography')]) },
      { color: P.plum, n: N('Contact', [N('Contact details'), N('Office map'), N('Enquiry form')]) },
      {
        color: P.pink,
        n: N('Back Office (staff)', [N('Package management'), N('Photo & review uploads'), N('Form submission inbox')]),
      },
      { color: P.gray, n: N('Global elements', [N('WhatsApp CTAs'), N('Google Translate'), N('Scroll to top')]) },
    ],
  },

  'ah-accounts': {
    root: 'Billing Software',
    note: 'The Data model column shows the entity chain, not navigable pages. Dashboard is view-only.',
    cols: [
      { color: P.navy, n: N('/dashboard', [N('Revenue / expense / net cards'), N('Recent transactions')]) },
      {
        color: P.olive,
        n: N('/general-ledger', [
          N('Revenue tab'),
          N('Expense tab'),
          N('Search & date filter'),
          N('Excel export'),
          N('/general-ledger/new', [N('Payment entry form', undefined, true), N('Proof upload', undefined, true)]),
        ]),
      },
      {
        color: P.purple,
        n: N('/trip-payments', [
          N('Bills list & filters'),
          N('Summary'),
          N('Payment history'),
          N('/trip-payments/new', [N('Bill form + live preview', undefined, true), N('PDF download', undefined, true)]),
          N('/trip-payments/:id/edit'),
        ]),
      },
      {
        color: P.teal,
        n: N('Data model', [
          N('Itinerary Code'),
          N('Bill'),
          N('Bill Items'),
          N('Ledger Entry'),
          N('Invoice Counter'),
        ]),
      },
    ],
  },
}
