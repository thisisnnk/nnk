export const projects = [
  {
    id: 1,
    slug: 'ah-crm',
    name: 'AH-CRM',
    tagline: 'Purpose-Built CRM for the Travel Industry',
    duration: 'Research to Deployment',
    year: '2025',
    category: 'UX / UI Case Study',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80',
    mockup: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
    problem: 'There was no single connected system that could take a lead from enquiry to execution with full accountability, role-based access, and a real-time audit trail. Every handoff between teams was a potential point of failure.',
    solution: 'Designed a role-based internal CRM for Adventure Holidays where 8 distinct user types operate in one unified system — from first enquiry to tour guide handoff — with enforced quality gates and real-time financial visibility.',
    result: 'Conversion disputes dropped from ~35% to near zero. Financial visibility moved from T+14 days to real-time. 100% of leads have a complete audit trail.',
    metrics: [
      { label: 'Conversion Disputes', value: '35', suffix: '% → 0' },
      { label: 'Financial Lag Eliminated', value: '14', suffix: ' days → 0' },
      { label: 'Leads with Audit Trail', value: '100', suffix: '%' },
    ],
    tags: ['React 18', 'TypeScript', 'Supabase', 'shadcn/ui', 'TanStack Query', 'Figma'],
  },
  {
    id: 2,
    slug: 'ah-itinerary',
    name: 'AH-Itinerary',
    tagline: 'Itinerary Quotation Builder for the Travel Industry',
    duration: 'Research to Deployment',
    year: '2025',
    category: 'UX / UI Case Study',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80',
    mockup: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    problem: 'Consultants spent 45–60 minutes formatting itinerary documents in Word every time. No reusable content, no version tracking, no consistent branding, and no analytics on quotation volume or performance.',
    solution: 'A 4-step guided wizard that takes a consultant from blank screen to a branded PDF quotation in under 12 minutes — with a keyword library for 80% content reuse, atomic code generation, and a live analytics dashboard.',
    result: 'Creation time reduced from 45 min to 12 min (new) or 5 min (duplicate). Code collisions dropped from 15% to 0%. 15–17 hours saved per week across the 4-consultant team.',
    metrics: [
      { label: 'Creation Time', value: '45', suffix: 'min → 12min' },
      { label: 'Code Collisions', value: '15', suffix: '% → 0%' },
      { label: 'Content Reuse Rate', value: '80', suffix: '% (was 0%)' },
    ],
    tags: ['React 18', 'TypeScript', 'Vite', 'Supabase', 'shadcn/ui', 'Tailwind', 'jsPDF', 'Figma'],
  },
  {
    id: 3,
    slug: 'workmap',
    name: 'WorkMap',
    tagline: 'Visual operations board surfacing workflow bottlenecks',
    duration: '6 Weeks',
    year: '2023',
    category: 'Product Design',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    mockup: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    problem: 'An agency had no visibility into internal workflow bottlenecks, resulting in consistent project overruns and inability to forecast team capacity.',
    solution: 'Designed a workflow audit system and built a visual operations board to surface bottlenecks in real time, giving leadership full operational visibility.',
    result: '45% improvement in project delivery time, 2× team capacity visibility',
    metrics: [
      { label: 'Project Delivery', value: '45%', suffix: ' improvement' },
      { label: 'Capacity Visibility', value: '2x', suffix: '' },
      { label: 'Overruns Reduced', value: '70%', suffix: '' },
    ],    tags: ['ClickUp', 'Figma', 'Miro', 'Product Design'],
  },
  {
    id: 4,
    slug: 'formsync',
    name: 'FormSync',
    tagline: 'Automated data pipeline eliminating manual form transfers',
    duration: '4 Weeks',
    year: '2023',
    category: 'Business Systems Design',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    mockup: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    problem: 'A healthcare admin team was manually transferring form data across 3 separate tools, causing entry errors, delays, and compliance risks.',
    solution: 'Automated the entire data pipeline between intake forms, CRM, and reporting dashboard using no-code automation, eliminating all manual transfer steps.',
    result: '100% elimination of manual data transfer, 90% reduction in entry errors',
    metrics: [
      { label: 'Manual Transfer', value: '100%', suffix: ' eliminated' },
      { label: 'Entry Errors', value: '90%', suffix: ' reduction' },
      { label: 'Processing Time', value: '5x', suffix: ' faster' },
    ],    tags: ['Typeform', 'Make.com', 'HubSpot', 'Product Design'],
  },
  {
    id: 5,
    slug: 'scaleboard',
    name: 'ScaleBoard',
    tagline: 'Customer success dashboard for SaaS retention intelligence',
    duration: '2.5 Months',
    year: '2024',
    category: 'Product Design',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    mockup: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    problem: 'A SaaS startup had no internal visibility into customer health scores, churn risks, or usage patterns — making retention entirely reactive.',
    solution: 'Designed and built a customer success dashboard surfacing real-time usage data, health scores, and automated escalation alerts for the CS team.',
    result: '35% improvement in customer retention, 50% faster escalation response',
    metrics: [
      { label: 'Customer Retention', value: '35%', suffix: ' improvement' },
      { label: 'Escalation Response', value: '50%', suffix: ' faster' },
      { label: 'Churn Predicted', value: '80%', suffix: ' accuracy' },
    ],    tags: ['Retool', 'Segment', 'Mixpanel', 'Product Design'],
  },
]

export const blogPosts = [
  {
    id: 1,
    slug: 'map-operational-bottlenecks',
    title: 'How to Map Operational Bottlenecks Before Building a System',
    excerpt: 'Most system failures happen before a single line of code is written. The real issue is that no one stops to map where work actually breaks down.',
    date: 'May 28, 2024',
    readTime: '6 min read',
    category: 'Systems Thinking',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
    content: `Before you build anything, you need to understand what's actually broken. Most teams skip this step entirely — they have a problem, they want a solution, and they assume the solution is obvious. It rarely is.

## Start With a Process Walk

The first thing I do with any client is what I call a process walk. We go through every step of their workflow, from start to finish, in real-time. Not how they think it works. How it actually works.

This always reveals three things:
- Steps that exist only because they once fixed a problem that no longer exists
- Handoffs that rely entirely on individual memory or informal communication
- Bottlenecks disguised as "how we've always done it"

## The Bottleneck Triad

In most operational systems, bottlenecks come from three sources: people, tools, or information flow.

**People bottlenecks** happen when work requires a specific person's approval, knowledge, or action — and that person is unavailable. The solution isn't always automation. Sometimes it's documentation and delegation.

**Tool bottlenecks** are the most obvious but often the most misdiagnosed. Teams assume they need a new tool when what they actually need is better use of the tools they already have.

**Information flow bottlenecks** are the most dangerous. These are the silent killers — work that stalls not because someone is blocked, but because the right information didn't reach the right person at the right time.

## How to Map It

I use a three-column framework:

1. **Input** — What triggers this step?
2. **Output** — What does this step produce?
3. **Constraint** — What can delay or break this step?

Once every step is mapped, patterns emerge. You'll see which steps have unclear inputs, which produce outputs no one uses, and which have constraints that cascade downstream.

## Build After You See

The biggest mistake teams make is building before they see. They implement a project management tool without mapping their actual workflow first. Then they wonder why adoption fails.

Map first. Understand the constraint. Then design the system around the real problem — not the perceived one.

The best systems I've built started not with a brief, but with a whiteboard full of broken processes. That whiteboard is where the real work happens.`,
  },
  {
    id: 2,
    slug: 'why-most-business-tools-fail',
    title: 'Why Most Business Tools Fail — A Systems Thinking Perspective',
    excerpt: 'Companies spend thousands on software that never gets used. The problem is never the tool — it is always the system around it.',
    date: 'May 15, 2024',
    readTime: '8 min read',
    category: 'Systems Thinking',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    content: `Every week, another company adopts a new tool to solve an old problem. Six months later, the tool is abandoned. The team reverts to spreadsheets and email. The tool gets blamed. The real cause is never examined.

## The Tool Is Never the Problem

Tools fail because of three reasons — none of which are the tool itself:

**1. No clear ownership.** If everyone can edit the system, but no one is responsible for maintaining it, it degrades. Entropy wins. Data goes stale. Processes get skipped. Eventually, people stop trusting the system and stop using it.

**2. No process alignment.** The tool was implemented without mapping the existing workflow. Now people have to change how they work to fit the tool — instead of the tool fitting how they work. Adoption dies immediately.

**3. No integration with existing systems.** The new tool becomes an island. People have to update three places instead of one. The overhead exceeds the benefit. The tool loses.

## Systems Thinking Changes the Question

Instead of asking "what tool do we need?", systems thinking asks "where does information flow break down, and what would fix that?"

This reframe matters enormously. It shifts focus from features to function. From software to workflow. From implementation to adoption.

A $10/month Notion database that fits your workflow perfectly beats a $500/month enterprise platform that doesn't.

## What Good Tool Implementation Looks Like

Before implementing any tool, answer these questions:
- Who owns this system, and what does ownership mean?
- How does this connect to the systems that already exist?
- What happens when data goes stale or processes change?
- Who is trained on this, and is that training documented?

The implementation plan is as important as the tool itself. Usually more important.

## The Uncomfortable Truth

Most businesses don't need better tools. They need better-defined processes. Once processes are clear, tool selection becomes obvious — and implementation becomes straightforward.

The best tool is the one your team will actually use, consistently, without being asked. That consistency only happens when the tool fits the workflow — not the other way around.`,
  },
  {
    id: 3,
    slug: 'ui-design-vs-product-design',
    title: 'The Difference Between UI Design and Product Design',
    excerpt: 'UI design makes things look good. Product design makes things work well. These are not the same discipline, and confusing them is expensive.',
    date: 'April 30, 2024',
    readTime: '5 min read',
    category: 'Product Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    content: `The industry treats "UI designer" and "product designer" as interchangeable job titles. They are not. Understanding the difference isn't just semantic — it changes how problems get solved.

## UI Design Is About Presentation

UI design answers: how does this look? What color is the button? How much padding surrounds the card? Is the typography hierarchy clear? These are real questions that matter. But they operate at the surface level of a product.

A UI designer can make a broken flow beautiful. They can apply consistency to a confusing journey. They can make something that doesn't work look like it should.

## Product Design Is About Behavior

Product design answers: what happens when? Why is this step in the flow? What does the user need to know, and when? What edge case breaks this?

A product designer questions the existence of every element before designing it. They work with constraints — technical, business, user — and find solutions that balance all three.

Product design begins before any screen is designed. It starts in user research, stakeholder interviews, competitive analysis, and workflow mapping.

## Where Most Products Fail

Most products fail at the product design level — not the UI level. The screen looks good but the flow is wrong. The interface is clean but the user can't accomplish their goal. The component library is polished but the mental model is broken.

This is why good UI design alone cannot save a bad product.

## Why Both Matter

The distinction isn't to diminish UI design. Presentation matters enormously. Users judge products by their interface before they judge them by their function. A great product with poor UI loses to a mediocre product with great UI — at least in the short term.

But in the long run, behavior wins. Products that solve real problems in clear, efficient ways retain users. Products that only look good don't.

The best design combines both: flows that work, presented in a way that builds confidence and clarity.`,
  },
  {
    id: 4,
    slug: 'no-code-changing-operations',
    title: 'How No-Code Is Changing Business Operations',
    excerpt: 'No-code tools have removed the barrier between having a business problem and having a system that solves it. The implications are enormous.',
    date: 'April 14, 2024',
    readTime: '7 min read',
    category: 'No-Code',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    content: `Five years ago, if a business wanted an internal tool, they had two options: buy expensive software that sort of fit their needs, or hire a developer to build something that exactly fit their needs.

No-code changed that equation entirely.

## What No-Code Actually Is

No-code doesn't mean "no complexity." It means "no syntax." The logic is still there — the conditions, the triggers, the data structures. What's removed is the barrier of programming language knowledge.

This matters because it puts system design capability into the hands of people who understand the business problem best: operators, not engineers.

## The Real Shift

The shift isn't technical. It's organizational.

When a non-technical team can build and maintain their own internal tools, the feedback loop shortens dramatically. Instead of filing a ticket, waiting for sprint planning, getting a scoped estimate, and waiting for delivery — they can build a prototype in an afternoon and iterate in real time.

This changes not just speed but quality. The person closest to the problem builds the solution to the problem. That alignment produces better systems.

## What No-Code Can't Do

No-code has limits. Complex algorithms, high-volume data processing, deep integrations with custom APIs, and security-critical infrastructure still require engineering.

The mistake is treating no-code as a replacement for engineering rather than a complement to it. The right question is: what problems are best solved without code, and what problems genuinely require it?

For most operational challenges — task tracking, client management, reporting, data routing, automation workflows — no-code is not just sufficient. It's often superior.

## What This Means for Businesses

For growing businesses, no-code is a competitive advantage. It allows small teams to operate with the system sophistication of large organizations.

The constraint is no longer "can we afford to build this?" The constraint is "do we understand our problem well enough to design the right system?"

That's a much better problem to have.`,
  },
  {
    id: 5,
    slug: 'information-architecture-foundation',
    title: 'Information Architecture: The Foundation Nobody Talks About',
    excerpt: 'Every system has structure. Whether that structure is intentional or accidental determines whether the system helps or confuses the people who use it.',
    date: 'March 28, 2024',
    readTime: '6 min read',
    category: 'Product Design',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
    content: `Information Architecture (IA) is one of the most important disciplines in product and systems design. It's also one of the least discussed in business contexts. Most companies understand that they need a user interface. Almost none understand that they need an information architecture first.

## What IA Actually Means

Information Architecture is the structural design of shared information environments. In simpler terms: it's how you organize, label, and structure the information in a system so that people can navigate and use it effectively.

IA asks: What are the things in this system? How do they relate to each other? How will users look for them? What words will they use?

Every product has IA — whether it was designed intentionally or emerged accidentally. The difference between the two is usually the difference between a product that works and one that confuses.

## The Most Common IA Mistakes

**Organizing by internal logic, not user mental models.** Teams build structures that make sense to them — based on how their company is organized, how their database is structured, or how their process flows internally. Users don't think this way. They think by task and goal.

**Label inflation.** Every new feature gets a new label. Over time, the navigation grows into a list of jargon that only long-term users understand. New users are immediately lost.

**Missing the edges.** Most IA is designed for the primary use case. Edge cases — the thing a user tries once a quarter, the emergency action, the admin path — are bolted on as afterthoughts. They break the structure.

## How to Design IA Intentionally

Start with content inventory. List every piece of information the system contains. Then ask: how does a user think about this? What mental model do they arrive with?

Card sorting is the fastest way to find this out. Give users labels and ask them to group them. The patterns that emerge reveal the actual mental model.

Then design structure around the mental model — not around your internal logic.

## Why It Matters for Internal Tools

For internal business tools, IA is often overlooked entirely. The assumption is that because users know the business, they'll figure out the system. This is wrong.

A poorly structured internal tool creates invisible friction. Work takes longer. Errors increase. People develop workarounds. Eventually, they stop using the tool.

Good IA removes that friction before it starts.`,
  },
  {
    id: 6,
    slug: 'workflow-audit-before-build',
    title: 'How to Run a Workflow Audit Before Any Build',
    excerpt: 'A workflow audit is the most valuable thing you can do before designing or building any internal system. Here is exactly how to run one.',
    date: 'March 12, 2024',
    readTime: '9 min read',
    category: 'Systems Thinking',
    image: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=80',
    content: `A workflow audit answers one question: how does work actually happen in this organization? Not how leadership thinks it happens. Not how the process document says it should happen. How it actually, operationally happens.

The gap between those two things is where every system problem lives.

## Phase 1: Stakeholder Interviews

Start by interviewing the people who do the work. Not just managers — the people who execute daily tasks. Ask them:

- Walk me through a typical day
- Where do you spend the most time on tasks you feel shouldn't take that long?
- What information do you need that you can't always get when you need it?
- If you could change one thing about how work gets done here, what would it be?

The answers reveal the real workflow — not the documented one.

## Phase 2: Process Documentation

Document every step of every core process. For each step, capture:

- **Trigger:** What starts this step?
- **Actor:** Who does this?
- **Input:** What information or materials does this require?
- **Action:** What happens?
- **Output:** What does this produce?
- **Handoff:** Where does this go next?
- **Failure mode:** What most commonly goes wrong here?

This is tedious. It is also irreplaceable.

## Phase 3: Bottleneck Identification

Once processes are documented, bottlenecks become visible. Look for:

- Steps with unclear ownership
- Steps that require waiting on other people's availability
- Steps where information gets recreated instead of transferred
- Steps that exist only to correct errors from upstream

Each of these is a design opportunity.

## Phase 4: Prioritization

Not every bottleneck is worth solving. Prioritize by:

1. Impact on output quality or speed
2. Frequency of occurrence
3. Cost of the workaround (in time, errors, or frustration)
4. Ease of resolution

The highest priority targets are high-impact, high-frequency, and high-cost. These are the ones to design around first.

## What to Build After the Audit

The audit output is a prioritized list of workflow problems with documented context. That becomes the design brief.

Every system built without this brief is designed around assumptions. Some of those assumptions will be wrong. The audit replaces assumptions with evidence.

Build from evidence. The system you create will be used.`,
  },
  {
    id: 7,
    slug: 'designing-for-edge-cases',
    title: 'Designing for Edge Cases — Why It Matters More Than the Main Flow',
    excerpt: 'Most design time goes into the happy path. But systems break at the edges. Designing for edge cases is what separates good products from great ones.',
    date: 'February 25, 2024',
    readTime: '5 min read',
    category: 'Product Design',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    content: `Every product has a happy path — the intended flow where everything works as expected. Most design energy goes into this path. The buttons are polished. The transitions are smooth. The copy is clear.

Then a user does something slightly unexpected, and the system breaks.

## The Happy Path Illusion

The happy path represents maybe 60% of actual usage. The remaining 40% is variations: users who are confused, users who make mistakes, users who arrive at the wrong moment, users whose data is incomplete.

These are not edge cases in the sense of rare exceptions. These are the normal conditions of real-world use.

Designing only for the happy path is designing for an idealized user who doesn't exist.

## What Edge Cases Actually Are

Edge cases fall into several categories:

**Data edge cases:** Empty states, partial data, corrupted inputs, data that exceeds expected ranges.

**Permission edge cases:** Users who have partial access, users whose permissions have changed mid-session, users who are between roles.

**Timing edge cases:** Actions taken simultaneously by two users, actions taken while data is loading, actions taken during system maintenance.

**Error edge cases:** Failed API calls, lost connections, timeouts, validation failures.

Each category requires intentional design — not fallback text that says "Something went wrong."

## How to Find the Edges

The fastest way to find edge cases is to ask: what happens if the input is wrong? What happens if the data is missing? What happens if two people do this at the same time?

For every step in a flow, ask: what could go wrong here, and what should happen when it does?

## Designing the Edge

Edge case design doesn't mean building complex error handling for every possible scenario. It means:

1. Designing clear empty states that guide next action
2. Writing error messages that tell users what happened and what to do
3. Gracefully degrading when data is incomplete
4. Preventing errors before they occur (validation, confirmation dialogs, progress indicators)

## The Return on Investment

Designing for edge cases pays back disproportionately. Users remember the moments when something goes wrong. If you handle those moments well, you build trust. If you don't, you lose it.

The happy path earns users. The edges keep them.`,
  },
  {
    id: 8,
    slug: 'problem-to-product-process',
    title: 'From Problem to Product: My End-to-End Process',
    excerpt: 'There is a structured process between identifying a business problem and delivering a working system. Here is exactly how I run it.',
    date: 'February 10, 2024',
    readTime: '10 min read',
    category: 'Process',
    image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80',
    content: `Every system I build follows the same process. Not because the process is rigid — but because it ensures that the thing delivered actually solves the right problem.

Here is the full process, phase by phase.

## Phase 1: Empathize

The first phase is understanding — not prescribing. I spend significant time in this phase before anything else begins.

This involves stakeholder interviews, workflow observation, document review, and competitive research. The goal is to understand the environment in which the solution will live.

The deliverable of this phase is not a design. It's a research synthesis: a clear picture of who is affected by the problem, how they experience it, and what they need.

## Phase 2: Define

Once I have research, I define the problem. Not the problem as the client described it — the actual problem revealed by the research.

These are often different. Clients typically describe their symptoms ("our reporting takes too long") rather than their root cause ("our data is spread across four disconnected systems"). The definition phase finds the root cause.

The deliverable is a problem statement: specific, actionable, and grounded in research.

## Phase 3: Ideate

With a clear problem, I generate multiple possible solutions. Not one. Multiple.

This matters because the first solution that comes to mind is usually the most obvious — and often not the best. Ideation creates space to explore alternatives before committing.

I present three directions: the minimal path (solves the core constraint with least complexity), the full path (solves the constraint completely), and the future path (solves the constraint and enables scale).

The client chooses the direction that fits their constraints.

## Phase 4: Design

Design translates the chosen direction into a concrete system — wireframes, workflow diagrams, information architecture, interface mockups.

For product design projects, this means detailed UI design with interactive prototypes. For systems design projects, this means workflow documentation, data structure design, and tool architecture.

Design is iterative. I review with stakeholders, gather feedback, and refine. Usually two to three rounds before proceeding to build.

## Phase 5: Build

Build is implementation. The system designed in the previous phase is constructed, configured, and connected.

I maintain a build log throughout — documenting decisions, edge cases encountered, and departures from the original design (and why they happened).

## Phase 6: Deliver and Document

Delivery includes training, documentation, and a handoff session. The client receives not just a working system but a full understanding of how to maintain, adapt, and extend it.

Documentation is non-negotiable. Systems without documentation become systems that only I can maintain — and that's not a good outcome for anyone.

This is the process. It's not fast. But it reliably produces systems that work and get used.`,
  },
  {
    id: 9,
    slug: 'when-to-automate',
    title: 'When to Automate and When Not To',
    excerpt: 'Automation is one of the most powerful tools in business operations. It is also one of the most misapplied. Here is how to tell the difference.',
    date: 'January 28, 2024',
    readTime: '6 min read',
    category: 'Systems Thinking',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    content: `Automation is not always the answer. It is sometimes the problem. Understanding when to automate — and when not to — is one of the most valuable operational judgments a business can develop.

## When Automation Adds Value

Automation adds value when the task meets all of the following criteria:

**It is repetitive.** The same steps are performed, in the same sequence, producing the same type of output, repeatedly. If the task varies significantly each time it is performed, automation will be brittle.

**It is well-defined.** The rules governing the task are clear and consistent. If "it depends" is a common answer when describing how the task is done, the task isn't ready for automation.

**It is high-frequency.** If a task happens ten times a day and takes two minutes each time, automation saves 20 minutes daily. If it happens once a month, the ROI calculation changes significantly.

**Errors are costly.** Repetitive manual tasks accumulate errors over time. When those errors have downstream consequences — data corruption, missed communications, compliance issues — automation reduces that risk.

## When Not to Automate

**The process isn't stable yet.** Automating an unstable process locks in its current dysfunction. If the process is still being figured out, automate after it's settled.

**Judgment is required.** Some tasks look repetitive but actually require contextual judgment at key decision points. Automating these produces outputs that are technically correct but practically wrong.

**The task is performed rarely.** If the overhead of building and maintaining an automation exceeds the time saved, don't automate. Do the math.

**The stakes are high and errors are hard to detect.** Automation runs silently. If an error in an automated process isn't caught quickly, it can compound before anyone notices. High-stakes, low-visibility tasks need human checkpoints.

## The Middle Path

Most business processes don't need full automation — they need partial automation. Automate the data routing. Leave the decision to a human. Automate the notification. Leave the response to a human.

This hybrid approach captures most of the efficiency gain while preserving the judgment layer that keeps systems from producing harmful outputs.

The goal of automation is not to remove people from processes. It is to remove people from the parts of processes that don't benefit from human involvement — and give them more capacity for the parts that do.`,
  },
  {
    id: 10,
    slug: 'scalable-system-from-day-one',
    title: 'What Makes a System Scalable From Day One',
    excerpt: 'Most systems break when they grow. The systems that don\'t have something in common: they were designed with scale in mind from the beginning.',
    date: 'January 14, 2024',
    readTime: '7 min read',
    category: 'Systems Thinking',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    content: `Scalability is often treated as a future problem. Build it now, fix it later when growth demands it. This thinking is expensive. Systems rebuilt under operational pressure are rebuilt badly — with technical debt, data migration risks, and team disruption.

Scalable systems aren't harder to build. They are just designed differently from the start.

## Principle 1: Separate Data from Display

A scalable system stores information in one place and displays it in many. If you change how something looks, you don't touch the data. If you add a new view or report, you don't restructure the data.

Systems that mix storage and display — where the "dashboard" is also the "database" — become unmaintainable at scale. Adding a new view requires re-architecting the whole thing.

## Principle 2: Design for More Than One User Type

Systems designed for one type of user break when a second type is added. If the only people using your CRM are account managers, and then finance needs read access, and then leadership needs executive reporting — a system designed only for account managers will require extensive rework.

Design with user types in mind from the start. Who will use this? What do they need to see? What do they need to do?

## Principle 3: Standardize Inputs

Inconsistent input data creates analysis nightmares at scale. If "Client Name" can be entered as "Acme Corp", "ACME Corp", "Acme", and "ACME Corporation" — you have four records that represent one entity.

Standardize through dropdowns over free text, validation rules, and naming conventions enforced at the input level.

## Principle 4: Document as You Build

Documentation is the scalability multiplier that teams ignore most. A system without documentation can only be maintained by its creator. When that person leaves — or is unavailable — the system becomes opaque.

Document not just how the system works but why decisions were made. The why is what allows future maintainers to make good decisions about changes.

## Principle 5: Plan the Edge Cases

What happens when data volume doubles? What happens when a new department needs access? What happens when the tool you're building on changes its pricing or API?

These aren't hypotheticals for large companies. They are operational realities for any growing business.

## The Payoff

Systems built with these principles cost slightly more upfront — in thinking time, not necessarily in build time. But they compound positively. Every quarter that passes, the gap between them and hastily built alternatives widens.

The systems that scale are the ones designed to.`,
  },
]

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'COO',
    company: 'Meridian Logistics',
    text: "NNK didn't just build us a system — they redesigned how our team operates. The clarity they brought to our process was more valuable than the tool itself. Three months later, we're running at a level we didn't think was possible with our current team size.",
    rating: 5,
  },
  {
    id: 2,
    name: 'James Okafor',
    role: 'Founder',
    company: 'Okafor Consulting',
    text: "I came in thinking I needed a new CRM. NNK showed me I needed a client management process first. The system they designed around that process has been running for six months without a single issue. The ROI was clear within the first two weeks.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Priya Anand',
    role: 'Head of Operations',
    company: 'VelocityHealth',
    text: "The workflow audit alone was worth the engagement. NNK surfaced problems we had been living with for two years and didn't realize were optional. The automation they built eliminated four hours of daily manual work across our admin team.",
    rating: 5,
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'CEO',
    company: 'LayerStack',
    text: "What sets NNK apart is that they think like a business partner, not a service provider. Every recommendation came with business reasoning, not just technical rationale. The dashboard they built gives me real-time visibility I've never had before.",
    rating: 5,
  },
  {
    id: 5,
    name: 'Amara Williams',
    role: 'Creative Director',
    company: 'Studio Forma',
    text: "Our agency was running on chaos. NNK systematized our entire project delivery flow in six weeks. Now our team knows exactly what's happening at every stage without anyone having to ask. Project overruns are down significantly.",
    rating: 5,
  },
]

export const howISolveProblems = [
  {
    title: 'Strategy Before Execution',
    body: 'Many developers build what you ask for. We analyze your workflow first and then build what you actually need.',
  },
  {
    title: 'Connected Systems Thinking',
    body: 'Most custom systems solve one problem. We design connected systems that improve your entire operational flow — not just one feature.',
  },
  {
    title: 'Business Focused Execution',
    body: 'Anyone can write code. Not everyone understands business processes, edge cases and automation layers.',
  },
  {
    title: 'Reduce Project Risk',
    body: 'Choosing the cheapest or fastest option often leads to rebuilds. We design systems correctly the first time — structured and stable.',
  },
  {
    title: 'Long Term Partnership',
    body: "We don't disappear after delivery. We focus on scalability, documentation, and continuous optimization.",
  },
]

export const aboutApproach = [
  {
    title: 'Understand First',
    body: 'Understand the problem before proposing solutions',
    icon: 'search',
  },
  {
    title: 'Ask Why',
    body: "Ask 'why' until the root cause becomes clear",
    icon: 'layers',
  },
  {
    title: 'Balance',
    body: 'Balance user needs with business goals',
    icon: 'scale',
  },
  {
    title: 'Reduce Complexity',
    body: 'Focus on systems that reduce complexity, not add to it',
    icon: 'simplify',
  },
]

export const aboutMetrics = [
  { value: 5, suffix: '+', label: 'Systems Built' },
  { value: 60, suffix: '%', label: 'Average Efficiency Gain' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
  { value: 3, suffix: '×', label: 'Faster Operational Cycles' },
]
