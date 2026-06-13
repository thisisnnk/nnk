# MASTER PROMPT — NNK Portfolio Website

---

## Project Overview

Build a premium, fully responsive personal portfolio website for **NNK** — a Product Designer and Business Systems Designer. The site must feel alive at all times. Every element has purposeful, modern animation. Nothing is static. Motion language is spring-based, fluid, and buttery smooth — Apple-level polish throughout.

---

## Color System

- **Accent / Primary:** `#00AAFF`
- **Dark Mode Background:** `#121212`
- **Light Mode Background:** `#ECECEC`
- **Default Mode:** Dark
- **Glass Buttons:** Semi-transparent with `#00AAFF` glow tint, frosted blur
- Both dark and light modes fully supported across all pages

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animation:** GSAP + ScrollTrigger (primary), Framer Motion (component-level)
- **Smooth Scroll:** Lenis
- **3D:** Spline (placeholder embed)
- **Icons:** Lucide React or custom SVGs

---

## Global Design Rules

### Animation Philosophy

- **Zero plain fade in/out.** Every entrance, exit, and transition must use layered, creative motion
- **Text animations:** Every section uses a unique style — character splits, word reveals, line wipes, scramble effects, magnetic text, staggered letter drops. No two sections repeat the same text animation
- **Scroll-driven:** Most animations are ScrollTrigger-based. Page scroll drives everything
- **Spring physics everywhere:** All motion must have weight — overshoot, settle, bounce where appropriate
- **Endless ambient animations:** Hero, 3D character, cards, backgrounds — always something subtly moving even when the user is idle
- **Parallax:** Applied throughout every section on every page — images, text layers, backgrounds, and cards all move at different scroll speeds
- **60fps target:** Use only `transform` and `opacity` in animations. No layout-triggering properties. Use `will-change` where needed

### Button Style — Apple Liquid Glass (Global)

- Background: `backdrop-filter: blur(20px)`, semi-transparent white/dark fill
- Soft inner glow border in `#00AAFF`
- Subtle gradient overlay
- Hover: scale up with spring easing, glow intensifies, glass clarity shifts
- Click: compress with spring bounce-back
- Works in both dark and light mode

### Typography

- Bold, large display fonts for all headings
- Clean sans-serif for body text
- Every text element animates on enter — nothing appears instantly
- Use a premium variable font (e.g., Clash Display, Cabinet Grotesk, or similar)

### Responsiveness

- Fully responsive across all screen sizes — mobile, tablet, desktop
- All sections adapt layout based on screen size

---

## Site Map

1. Landing Page
2. Projects Page
3. 5 × Project Detail Pages (Case Studies)
4. About Page
5. Creatives Page
6. Blog Listing Page
7. 10 × Blog Detail Pages

---

## Navigation (Landing Page)

- **Top Left:** Logo (NNK or custom mark)
- **Top Right:** Two links — *Creatives*, *Projects*
- Nav uses Apple Liquid Glass style — frosted, floating, blurred background
- Nav animates in on load with spring drop from top

---

## PAGE 1 — LANDING PAGE

### Section 1: Hero

- **Full viewport height**
- **Center:** Heading — *"Helping Growing Businesses Solve Operational Challenges Through System Design"*
  - Large, bold display font
  - Animate with word-by-word staggered reveal, each word slightly offset in Y with spring settle
- **Below heading:** Two Apple Liquid Glass CTAs side by side
  - *"Build Your System"* — primary, `#00AAFF` glow
  - *"Let's Talk"* — secondary, neutral glass
- **Bottom Center:** *"Scroll Down"* button with a looping animated arrow/chevron bouncing downward
- **Bottom Left:** LinkedIn icon button, Apple Liquid Glass style
- **Background:** Reference nvrmndstudio.com — immersive, animated background. Use dynamic gradient mesh, noise texture, or abstract particle/geometry animation in `#00AAFF` tones on `#121212`
- **Ambient:** Subtle continuous background motion even when user is idle
- All elements have staggered entrance animations on load — nothing appears at once

---

### Section 2: Projects (Landing — 3 Projects)

- Displays 3 of the 5 total projects
- **Left:** Product mockup image (placeholder — use realistic device mockup frames)
- **Right:** Project details structured as:
  - **Project Name** — bold display font, large
  - **Duration** — highlighted with `#00AAFF` background color, white text overlaid
  - **Problem** — heading + 2–3 key lines
  - **Solution** — heading + 2 lines
  - **Result** — heading + numeric metrics (e.g., "40% reduction in operational time")
  - **View Details** — Apple Liquid Glass link button → goes to project detail page
- **All 3 projects use the same left-right layout — no alternating**
- **Transitions between projects:** Spring physics — bouncy, elastic, buttery smooth. Think overshoot and settle, not a simple slide
- **Parallax:** Mockup image and text layers move at different scroll speeds
- **Use sample placeholder content for all 3 projects**

**Sample Project Placeholders:**

*Project 1:*
- Name: OperaFlow — Duration: 3 Months
- Problem: A growing logistics company had no centralized system to track team tasks, leading to missed deadlines and communication gaps
- Solution: Designed and built a no-code internal operations dashboard connecting task management, team communication, and reporting
- Result: 60% reduction in missed deadlines, 3× faster reporting cycle

*Project 2:*
- Name: ClientOS — Duration: 2 Months
- Problem: A consulting firm was managing 50+ clients through spreadsheets and email threads causing data loss and inefficiency
- Solution: Built a structured client management system with automated follow-ups, status tracking, and document management
- Result: 80% reduction in manual follow-up time, 100% client data centralized

*Project 3:*
- Name: WorkMap — Duration: 6 Weeks
- Problem: An agency had no visibility into internal workflow bottlenecks, resulting in project overruns
- Solution: Designed a workflow audit system and built a visual operations board to surface bottlenecks in real time
- Result: 45% improvement in project delivery time, 2× team capacity visibility

---

### Section 3: How I Solve Problems

- **Standalone section between Projects and Creatives**
- **Heading:** "How I Solve Problems" — animate in with a scramble/glitch-to-clear text effect
- **Content:** 5 points revealed one by one as user scrolls
- Section is **pinned/sticky** — user scrolls within the section while the page stays locked
- Each point animates in sequentially — previous point dims slightly, new one enters with spring motion from bottom
- Each point has:
  - Bold title
  - 1–2 line description

**The 5 Points:**

1. **Strategy Before Execution** — "Many developers build what you ask for. We analyze your workflow first and then build what you actually need. That difference saves time, cost, and future rework."
2. **Systems Thinking** — "Most custom systems solve one problem. We design connected systems that improve your entire operational flow — not just one feature."
3. **Long-Term Partnership** — "We don't disappear after delivery. We focus on scalability, documentation, and continuous optimization. Our goal is long-term performance, not one-time development."
4. **Execution Quality** — "Anyone can write code. Not everyone understands business processes, edge cases, automation layers, and performance architecture. We build with that depth in mind."
5. **Risk Reduction** — "Choosing the cheapest or fastest option often leads to rebuilds. We design systems correctly the first time — structured, scalable, and future-proof."

After all 5 points revealed, closing line appears:
*"I believe the best solutions are not the most complex ones — they are the ones that make work simpler, faster, and more effective."*

---

### Section 4: Creatives

- **Bento grid layout, column-based**
- Varying card sizes — mix of large, medium, small cells in the grid
- Placeholder images for now (use high-quality abstract/design-related Unsplash images)
- **Inner card parallax:** As user scrolls, the image inside each card shifts at a different speed than the card frame, creating a depth effect
- Cards have subtle hover animation — scale, glow, or tilt
- **Bottom:** *"View More"* Apple Liquid Glass button → links to Creatives page

---

### Section 5: Client Testimonials

- Section heading: *"What Clients Say"* — unique text animation on scroll enter
- Display testimonial cards in a clean layout (horizontal scroll or stacked with spring transitions)
- Each card:
  - Client name
  - Role / Company
  - Testimonial text
  - Star rating or accent mark
- Use 4–5 placeholder testimonials relevant to system design and product design work
- Cards have ambient float or soft idle animation
- Background uses subtle parallax or gradient shift

---

### Section 6: Footer (Slide Reveal)

- **Interaction:** Footer is hidden beneath the last section. As user scrolls to the very end, the last section (Testimonials) **slides upward** like a panel being lifted, revealing the footer underneath — reference nvrmndstudio.com footer animation

**Footer Layout — 4 Blocks:**

**Block 1 — Brand / Statement**
- Bottom left corner
- NNK logo or name at very bottom
- Above it: a short tagline (e.g., *"Designing systems that work."*)

**Block 2 — Contact**
- Heading: Contact
- Email or contact link

**Block 3 — Social**
- LinkedIn icon + link
- Gmail icon + link

**Block 4 — Navigation**
- Blogs
- Creatives
- Projects

- Footer itself has subtle ambient animation — gradient shift, noise, or particle motion
- All footer text and links animate in after the reveal

---

## PAGE 2 — PROJECTS PAGE

- Same left (mockup) / right (details) layout as landing page projects section
- **Lists all 5 projects** (3 from landing + 2 additional)
- Same spring-based bouncy transitions between projects
- Clicking any project → navigates to its dedicated detail page

**Additional 2 Project Placeholders:**

*Project 4:*
- Name: FormSync — Duration: 4 Weeks
- Problem: A healthcare admin team was manually transferring form data across 3 separate tools, causing errors and delays
- Solution: Automated the entire data pipeline between intake forms, CRM, and reporting dashboard using no-code automation
- Result: 100% elimination of manual data transfer, 90% reduction in entry errors

*Project 5:*
- Name: ScaleBoard — Duration: 2.5 Months
- Problem: A SaaS startup had no internal visibility into customer health scores, churn risks, or usage patterns
- Solution: Designed and built a customer success dashboard surfacing real-time usage data, health scores, and automated alerts
- Result: 35% improvement in customer retention, 50% faster escalation response time

---

## PAGE 3–7 — PROJECT DETAIL PAGES (Case Studies)

One page per project. All 5 follow the same structure with placeholder content relevant to each project.

**Structure per page:**

1. **Hero** — Project name, duration, one-line summary, hero mockup image. Full width. Cinematic entrance animation
2. **Empathize** — User research, stakeholder pain points, context setting. Who was affected and how
3. **Define** — Clear problem statement. What exactly needed to be solved
4. **Ideate** — Ideas explored, approaches considered, decisions made on direction
5. **Design** — Visual and system design decisions. Include placeholder wireframe/mockup images
6. **Information Architecture** — Structure, flows, hierarchy followed. Include a placeholder IA diagram or flowchart
7. **Build** — How it was developed. Tools, no-code platforms, systems used. Process of execution
8. **Result** — Numeric metrics, before vs after, impact delivered

- Every section on the case study page has scroll-triggered animations
- Images use parallax
- Metrics in Result section animate with a count-up number animation on scroll enter
- Navigation between projects at the bottom (Previous / Next project)

---

## PAGE 8 — ABOUT PAGE

### Section 1: Intro

- Full viewport or near-full section
- *"Hi, I'm NNK. I design and build systems that help businesses operate better."*
- Full bio: background in design, expanded into Product Design, Business Systems Design, and No-Code Development to solve operational challenges and create scalable solutions
- Large display text, animated word by word
- Ambient background motion

### Section 2: Clients

- Heading: *"Businesses I've Worked With"*
- Logo strip or card grid of client names/logos
- Placeholder client logos for now
- Infinite marquee loop animation or grid with hover effects

### Section 3: What I Do

- Heading: *"What I Do"*
- Scroll-triggered vertical reveal — each point animates in one by one
- 4 points:
  - → Identify operational bottlenecks and inefficiencies
  - → Understand user, team, and business needs
  - → Design workflows, products and systems around real problems
  - → Build internal tools, automations, and business solutions
- Each line has a unique entrance animation — not all the same

### Section 4: My Approach

- Heading: *"My Approach"*
- User scrolls **vertically** but cards move **horizontally**
- Horizontal card track driven by vertical scroll via ScrollTrigger
- 4 cards, one per approach point
- Each card has:
  - Animated SVG / vector illustration (looping idle animation)
  - Bold heading
  - Sub-paragraph

**The 4 Cards:**

1. **Understand First** — "Understand the problem before proposing solutions"
   - SVG: magnifying glass or mind map animation
2. **Ask Why** — "Ask 'why' until the root cause becomes clear"
   - SVG: layered funnel or root tree animation
3. **Balance** — "Balance user needs with business goals"
   - SVG: scales or Venn diagram animation
4. **Reduce Complexity** — "Focus on systems that reduce complexity, not add to it"
   - SVG: tangled lines simplifying into clean flow animation

### Section 5: Results

- Heading: *"What This Delivers"*
- Bold, prominent numeric metrics
- Placeholder metrics (update later):
  - 5+ Systems Built
  - 60% Average Efficiency Gain
  - 100% Client Satisfaction
  - 3× Faster Operational Cycles
- Each metric animates with count-up on scroll enter
- Large typography, `#00AAFF` for numbers

---

## PAGE 9 — CREATIVES PAGE

- Reference: **yutaabe.com/playground/** — take layout style, interaction behavior, and animation approach from this page
- Immersive, full-page creative gallery experience
- Cursor interactions, hover effects, fluid transitions between pieces
- Placeholder creative works for now (high-quality abstract/design images)
- Every element must move — nothing static
- Page entrance animation must be cinematic

---

## PAGE 10 — BLOG LISTING PAGE

- **Layout:** 3-column grid
- **10 Blog Cards**, each containing:
  - Placeholder image (design/systems/abstract themed)
  - Heading
  - Sub-paragraph (2–3 lines)
  - *"View Blog"* Apple Liquid Glass button → links to individual blog page
- Cards animate in on scroll with staggered spring entrance
- Hover on card: subtle lift, glow, image parallax shift

**10 Blog Topics:**

1. How to Map Operational Bottlenecks Before Building a System
2. Why Most Business Tools Fail — A Systems Thinking Perspective
3. The Difference Between UI Design and Product Design
4. How No-Code Is Changing Business Operations
5. Information Architecture: The Foundation Nobody Talks About
6. How to Run a Workflow Audit Before Any Build
7. Designing for Edge Cases — Why It Matters More Than the Main Flow
8. From Problem to Product: My End-to-End Process
9. When to Automate and When Not To
10. What Makes a System Scalable From Day One

---

## PAGE 11–20 — BLOG DETAIL PAGES

One page per blog. All 10 with full placeholder content relevant to their topic.

**Structure per page:**

- **Hero** — Blog title, date, read time, hero image. Cinematic entrance
- **Full blog article** — well-structured with headings, paragraphs, pull quotes
- Each blog is meaningful, detailed, 600–900 words of placeholder content
- Parallax on hero image
- Text reveals on scroll
- Related blogs at bottom (3 cards)
- Back to Blogs link

---

## Additional Global Notes

- **Lenis** must be initialized globally for buttery smooth scroll across all pages
- **GSAP ScrollTrigger** must be registered globally and used for all scroll-driven animations
- **Every page transition** must animate — not a hard cut. Use a page transition overlay or curtain effect
- **Custom Cursor:** A dot that follows with spring lag, expands on hover over interactive elements
- **Preloader:** Add a site preloader on first load — NNK logo or name animates in, then sweeps away to reveal the hero
- **No section should be silent** — every scroll position should have something in motion
- Use placeholder content everywhere. All real content will be updated later
- Code must be clean, modular, and component-based — each section is its own component
