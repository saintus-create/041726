# Source of Truth — Internal Reference

> **Purpose**: This document is the single source of truth for project-wide decisions, conventions, and references. It does not ship to production and is for internal team use only.

---

## Project Overview

- **Name**: ADHD Pharmacotherapy Research
- **Type**: Documentation / Research Site
- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Fumadocs MDX
- **Purpose**: Public-facing research documentation on ADHD pharmacotherapy treatments

---

## Directory Structure

```
/ (project root)
├── app/                    # Next.js app router (public routes)
│   ├── (home)/            # Landing pages
│   ├── docs/              # Documentation UI (Fumadocs)
│   ├── api/               # API route handlers
│   └── og/                # Open Graph image routes
├── components/            # React components (shadcn + custom)
├── content/               # Source content (MDX/MD)
│   └── docs/              # Documentation pages
├── data/                  # Static data files (JSON/TS)
├── lib/                   # Utility functions & helpers
├── .source/               # Fumadocs generated source (gitignored)
├── .kilo/                 # Kilo CLI config (if used)
├── node_modules/
└── [config files]
```

---

## Technical Stack

| Tool / Library | Version | Purpose |
|---|---|---|
| Next.js | 16.2.3 | React framework (App Router) |
| React | 19.2.5 | UI library |
| TypeScript | 6.0.2 | Type safety |
| Tailwind CSS | 4.2.2 | Utility-first CSS |
| Fumadocs | 16.7.14 (core/ui) / 14.3.0 (mdx) | Documentation framework |
| shadcn/ui | 4.3.0 | Component library |
| Base UI | 1.4.0 | Primitive components |
| Lucide React | 1.8.0 | Icon set |
| Recharts | 3.8.1 | Charts library |
| Exa SDK | 0.5.0 | AI/external API |

---

## Content Architecture

### Source Configuration
- **Config file**: `source.config.ts` (Fumadocs MDX config)
- **Content directory**: `content/docs/` 
- **Collection type**: MDX pages with frontmatter
- **Schema**: `pageSchema` (Fumadocs default, extendable)

### Frontmatter Fields (Zod schema via `pageSchema`)
- `title`: string (required)
- `description`: string (optional)
- `tags`: string[] (optional)
- `date`: string/date (optional)
- `draft`: boolean (optional)

### Route Mapping
- `/docs/[...slug]` → MDX pages from `content/docs/`
- Slug is derived from file path
- Supports nested folders

---

## Development Workflow

### Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run start      # Start production server
npm run types:check  # Type checking + fumadocs validation
```

### Environment
- Requires `.env.local` (gitignored)
- Typical vars: API keys, OAuth secrets, search endpoints
- Development: `http://localhost:3000`

### Code Style
- TypeScript strict mode enabled
- React Server Components (RSC) preferred
- Tailwind CSS with CSS variables (shadcn Nova theme)
- Path aliases:
  - `@/*` → project root
  - `collections/*` → `.source/*`

---

## Design System

### Theme
- **shadcn style**: Nova (base-nova)
- **Color system**: neutral base with subtle accent
- **CSS Variables**: enabled (see `app/global.css`)
- **RTL**: disabled

### Base Design System — Spacing & Dimensions

#### Spacing Interval
- **Root**: 4px spacing increments
- **Scale**: Modular scale with major second ratio (1.125)
- All grids, typography, and component constructions use this scale
- Provides pixel-fitted, harmonious structure

#### Baseline Grid
- Built from 4px spacing scale
- Text flows vertically along baseline for consistent vertical rhythm
- Use multiples of 4 for all measurements, spacing, and positioning

#### Core Sizes (Archetypes)
Five primary sizes cover ~90% of layouts (in px):
- X-Small
- Small
- Medium
- Large
- X-Large

Not all assets are shown in all sizes (e.g., X-small avatar may compromise readability).

#### Phone Layout Grid
Both Android and iOS use the same grid system (only status bar height varies by OS/device):

| Platform | Status Bar | Navigation Bar | Left/Right Margin | Artwork Column |
|---|---|---|---|---|
| iOS | Variable | 44px | 16px | 64px |
| Android | Variable | 48px | 16px | 64px |

### Layout Grids

#### Anatomy
Layout grids consist of 3 elements:

- **Columns**: Content alignment areas; sizes change based on container
- **Gutter**: Fixed space between columns (constant regardless of container size)
- **Margin**: Space between outer columns and container (constant regardless of container size)

#### Usage Principles
- **Align content to columns**, not gutters
- Gutters provide space between content blocks only
- Intrinsic-width items (tags, pill buttons) stay at default width, don't force column span
- Use `span` prop to specify how many columns a cell spans
- Use `skip` prop to offset/skip columns
- Set `span={0}` to hide cell (removed from flow)

#### Fixed-Width Content
Specify arbitrary fixed width for elements (e.g., side-nav). Adjacent content uses parent gutter width.

#### Behaviors
- **Fluid** (default): Takes container's full width
- **Fixed**: Fixed-size grid (centered or left/right aligned to container)
- **Hybrid**: Combine multiple behaviors on single screen

#### Breakpoints
Container's horizontal size determines which layout grid applies. Resizing past breakpoint updates grid. All grid properties (span, hide, skip) are responsive per breakpoint.

#### Sub-Grids
Sub-divide base grid areas using separate grids. For each breakpoint, marginless versions provided for easier alignment to rest of content.

### Elevation (Shadows)

#### Purpose
Elevation communicates surface depth and stacking order via shadows. Used for elements on maps, overlays, dialogs, snackbars, tooltips, etc.

#### Usage Guidelines
- Use shadows for elevated components only, not for borders on banners/cards
- Shadows should NOT indicate tappability or scrollability
- Shadows may indicate dragging/picking up state
- **Shadows do NOT flip in dark mode**

#### Types
- **Shallow**: Most common use cases
- **Deep**: For components with darker backgrounds (e.g., Snackbar, Tooltip) where standard shadows are hard to see

### Typography
- Inherits from Tailwind defaults
- Inter / system fonts (configured in global CSS)

### Component Library
- Components in `components/ui/` (shadcn primitives)
- Custom components in `components/` (e.g., `research-explorer.tsx`)
- Icon library: Lucide React

### Component Styling Patterns

#### Styling Approaches
HeroUI (shadcn/ui) components support multiple styling methods:

**className prop**: All components accept `className` for Tailwind utilities:
```tsx
<Button className="bg-purple-500 hover:bg-purple-600">
  Custom Button
</Button>
```

**style prop**: Inline styles:
```tsx
<Button style={{ backgroundColor: '#8B5CF6' }}>
  Styled Button
</Button>
```

#### State-Based Styling
Components expose state via data attributes (like CSS pseudo-classes):
```css
.button[data-hovered="true"], .button:hover {
  background: var(--accent-hover);
}
.button[data-pressed="true"], .button:active {
  transform: scale(0.97);
}
.button[data-focus-visible="true"], .button:focus-visible {
  outline: 2px solid var(--focus);
}
```

#### Render Props
Dynamic styling based on component state:
```tsx
<Button
  className={({ isPressed }) =>
    isPressed ? 'bg-blue-600' : 'bg-blue-500'
  }
>
  Press me
</Button>

<Button>
  {({ isHovered, isPressed }) => (
    <>
      <Icon className={isPressed ? 'text-red-500' : 'text-neutral-400'} />
      <span className={isHovered ? 'underline' : ''}>Like</span>
    </>
  )}
</Button>
```

#### BEM Classes
BEM (Block Element Modifier) methodology for class naming:
- **Block**: `.button`, `.accordion`
- **Element**: `.accordion__trigger`, `.accordion__panel`
- **Modifier**: `.button--primary`, `.button--lg`, `.accordion--outline`

**Global customization via CSS layers**:
```css
@layer components {
  .button {
    @apply font-semibold uppercase;
  }
  .button--primary {
    @apply bg-indigo-600 hover:bg-indigo-700;
  }
  .button--gradient {
    @apply bg-gradient-to-r from-purple-500 to-pink-500;
  }
}
```

#### Wrapper Components with tailwind-variants
Create reusable custom components using `tailwind-variants`:
```tsx
import { tv, type VariantProps } from '@heroui/styles';

const customButtonVariants = tv({
  extend: buttonVariants,
  base: 'font-medium transition-all',
  variants: {
    intent: {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300',
      danger: 'bg-red-500 hover:bg-red-600 text-white',
    },
    size: {
      small: 'text-sm px-2 py-1',
      medium: 'text-base px-4 py-2',
      large: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});
```

#### CSS-in-JS Integration
**Styled Components**:
```tsx
import styled from 'styled-components';
const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
  border-radius: 8px;
  color: white;
  padding: 12px 24px;
  &:hover {
    box-shadow: 0 3px 10px rgba(255, 105, 135, 0.3);
  }
`;
```

**Emotion**:
```tsx
import { css } from '@emotion/css';
const buttonStyles = css`
  background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
`;
<Button className={buttonStyles}>Emotion Button</Button>
```

#### Responsive Design
**Tailwind responsive utilities**:
```tsx
<Button className="text-sm md:text-base lg:text-lg px-3 md:px-4 lg:px-6">
  Responsive Button
</Button>
```

**CSS media queries**:
```css
.button {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}
@media (min-width: 768px) {
  .button {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
}
```

#### CSS Modules
Scoped styles using CSS Modules:
```css
/* Button.module.css */
.button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}
.button:hover {
  transform: translateY(-2px);
}
```
```tsx
import styles from './Button.module.css';
<Button className={styles.button}>Scoped Button</Button>
```

#### Component Classes Reference
- **Button**: `.button`, `.button--{variant}`, `.button--{size}`, `.button--icon-only`
- **Accordion**: `.accordion`, `.accordion__item`, `.accordion__trigger`, `.accordion__panel`, `.accordion--outline`

> See component docs for complete class references. All component classes documented in `@heroui/styles/components`.

### Component Sizing & Proportions

#### Size Variants (from tailwind-variants pattern)
Standard size scale extracted from HeroUI wrapper component examples:

| Variant | Text | Padding (x/y) | Use Case |
|---|---|---|---|
| **small** | `text-sm` (14px) | `px-2 py-1` (8/4px) | Dense UIs, compact tables |
| **medium** (default) | `text-base` (16px) | `px-4 py-2` (16/8px) | Standard buttons, inputs |
| **large** | `text-lg` (18px) | `px-6 py-3` (24/12px) | Primary CTAs, touch-friendly |

Implementation with `tailwind-variants`:
```tsx
const customButtonVariants = tv({
  extend: buttonVariants,
  variants: {
    size: {
      small: 'text-sm px-2 py-1',
      medium: 'text-base px-4 py-2',
      large: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: { size: 'medium' },
});
```

#### Icon-Only Variants
**BEM class**: `.button--icon-only`

**Specifications**:
- Circular shape (not square) — `rounded-full` or `aspect-square`
- Fixed dimensions: `w-10 h-10` minimum (40×40px)
- Must include `aria-label` for screen reader accessibility
- Accepts `size="icon"` prop where component supports it

```tsx
// Implementation
<Button size="icon" aria-label="Close">
  <CloseIcon />
</Button>

// CSS override
.button--icon-only {
  @apply w-10 h-10 rounded-full aspect-square;
}
```

**With icon + text**: Use `gap-2` spacing between icon and label:
```tsx
<Button className="gap-2">
  <Icon /> <span>Label</span>
</Button>
```

#### Width Specifications

**Fixed Width Patterns**:
- `w-32` (128px) — Short labels, icon buttons
- `w-48` (192px) — Standard form inputs
- `w-64` (256px) — Search inputs, dropdowns
- `w-96` (384px) — Wide inputs, textareas
- `w-full` — Full-width containers (mobile-first)

**Min/Max Constraints** (flexible but bounded):
```tsx
<input className="min-w-[100px] max-w-full" />
```

**Auto Width** (intrinsic components):
- Tags, badges, pills: `w-auto` (default)
- **Do NOT** force into grid columns unless layout requires
- Let content dictate width naturally

**Responsive Width Progression**:
```tsx
className="w-full md:w-64 lg:w-96"
// Mobile: full, Tablet: 256px, Desktop: 384px
```

#### Height Standards

| Height | px | Tailwind | Touch Target | Use |
|---|---|---|---|---|
| **small** | 32px | `h-8` | ❌ Below min | Dense tables, compact UI |
| **medium** | 40px | `h-10` | ❌ Below min | Standard buttons (border-box) |
| **large** | 48px | `h-12` | ✅ Meets Android | Primary CTAs, touch targets |
| **extra-large** | 56px | `h-14` | ✅ Exceeds min | Hero sections, accessibility mode |

**Note**: Button `height` includes border when using `box-sizing: border-box`. Use `min-h` for flexible height with variable content.

#### Padding & Spacing Scale (Base 4px Grid)

All spacing derived from 4px increment scale (modular scale ratio 1.125):

| Scale | px | Tailwind | Typical Usage |
|---|---|---|---|
| 1 | 4px | `p-1` | Icon padding, tight gaps |
| 2 | 8px | `p-2` | Button inner, dense spacing |
| 3 | 12px | `p-3` | Moderate gaps, small cards |
| 4 | 16px | `p-4` | Standard inputs, section margins |
| 5 | 20px | `p-5` | Card padding, medium gaps |
| 6 | 24px | `p-6` | Large button padding, sections |
| 8 | 32px | `p-8` | Section containers, wide margins |
| 10 | 40px | `p-10` | Layout gutters, page margins |
| 12 | 48px | `p-12` | Page sections, hero spacing |

**Horizontal padding pattern**:
- Buttons: `px-4` (medium), `px-6` (large), `px-2` (small)
- Inputs: `px-3 py-2` (default), `px-4 py-3` (large)

#### Responsive Sizing Pattern

Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for adaptive sizing:

```tsx
<Button className="text-sm md:text-base lg:text-lg px-3 md:px-4 lg:px-6">
  Responsive Button
</Button>
```

**Breakpoint mapping**:
- Mobile-first (base): smallest size
- `md` (768px): medium sizing
- `lg` (1024px): large sizing
- `xl` (1280px): extra-large if needed

**Equivalent CSS queries**:
```css
.button {
  font-size: 0.875rem; /* text-sm */
  padding: 0.5rem 1rem; /* px-3 py-2 (12/8px actually) */
}
@media (min-width: 768px) {
  .button {
    font-size: 1rem; /* text-base */
    padding: 0.75rem 1.5rem; /* px-4 py-3 (16/12px) */
  }
}
```

#### State-Based Dynamic Sizing (Render Props)

Apply different sizes based on component state:

```tsx
// Dynamic className based on state
<Button
  className={({ isPressed }) =>
    isPressed ? 'text-sm px-2 py-1' : 'text-base px-4 py-2'
  }
>
  Press me
</Button>

// Dynamic content within component
<Button>
  {({ isHovered, isPressed }) => (
    <>
      <Icon
        className={isPressed ? 'w-4 h-4' : 'w-5 h-5'}
      />
      <span className={isHovered ? 'text-lg' : 'text-base'}>
        Like
      </span>
    </>
  )}
</Button>
```

**State properties available**: `isPressed`, `isHovered`, `isFocused`, `isDisabled`, `isSelected`, `isLoading`

#### BEM Size Modifiers

Consistent naming for size variants using BEM modifier syntax:

```css
/* Buttons */
.button--xs { @apply text-xs px-1.5 py-0.5; }  /* 12px text */
.button--sm { @apply text-sm px-2 py-1; }      /* 14px text */
.button--md { @apply text-base px-4 py-2; }    /* 16px text (default) */
.button--lg { @apply text-lg px-6 py-3; }      /* 18px text */
.button--xl { @apply text-xl px-8 py-4; }      /* 20px text */

/* Accordion */
.accordion--compact { @apply text-sm; }
.accordion--spacious { @apply text-lg py-4; }

/* Input */
.input--sm { @apply text-sm h-8; }
.input--lg { @apply text-lg h-12; }
```

**Global overrides** in `global.css`:
```css
@layer components {
  .button--lg {
    @apply text-lg px-6 py-3 font-semibold;
  }
}
```

#### Width & Height Shorthand Patterns

**Square components** (avatars, icons, badges):
- `w-8 h-8` (32px) — Small avatar, icon
- `w-10 h-10` (40px) — Medium avatar, default icon button
- `w-12 h-12` (48px) — Large avatar, touch target
- `w-16 h-16` (64px) — Extra-large avatar, profile

**Rectangular components** (cards, inputs):
- **Width dominant**: `w-full max-w-md` (responsive with max constraint)
- **Height dominant**: `h-64 overflow-y-auto` (fixed height, scrollable)
- **Aspect ratios**: `aspect-video` (16:9), `aspect-square` (1:1), `aspect-[4/3]` custom

**Full-bleed containers**: `w-[calc(100vw+2rem)] mx-[-1rem]` (account for margins)

#### Touch Target Sizing

**Minimum touch target sizes** (accessibility requirement):
- **iOS HIG**: 44×44pt (≈44×44px @1x, 88×88px @2x)
- **Material Design**: 48×48dp (≈48×48px)
- **WCAG 2.5.5.1 (AAA)**: 44×44CSS pixels recommended

**Implementation**:
```tsx
<Button className="min-w-[44px] min-h-[44px]">
  {/* Touch target expanded via padding, not element size */}
</Button>
```

**Icon-only buttons**: Ensure `w-10 h-10` (40px) minimum, prefer `w-12 h-12` (48px) for comfortable tap.

#### Border Radius & Proportions

**Corner radius scale** (Tailwind default):
| Radius | px | Usage |
|---|---|---|
| `rounded-none` | 0 | Sharp edges, rarely |
| `rounded-sm` | 2px | Subtle rounding |
| `rounded` (default) | 4px | Minor rounding |
| `rounded-md` | 6px | Standard for buttons/cards |
| `rounded-lg` | 8px | Large buttons, modals |
| `rounded-xl` | 12px | Cards, dialogs |
| `rounded-2xl` | 16px | Hero sections |
| `rounded-full` | 9999px | Circular (avatars, pills) |

**Consistency rule**: All size variants of a component use same radius:
- Small/Medium buttons: `rounded-md`
- Large buttons: `rounded-lg`
- Icon-only: `rounded-full`

#### Sizing Consistency Checklist

✅ Use multiples of 4 for all spacing (Base 4px grid)  
✅ Stick to standard Tailwind scale (no arbitrary values unless necessary)  
✅ Touch targets ≥44×44px (iOS) / ≥48×48px (Android)  
✅ Body text no smaller than `text-sm` (14px)  
✅ Heading hierarchy: `text-4xl` → `text-3xl` → `text-2xl` → `text-xl` → `text-lg` → `text-base`  
✅ Maintain aspect ratios for media (use `aspect-ratio` utilities)  
✅ Use `box-sizing: border-box` globally to include borders/padding in element size  
✅ Set `touch-action: manipulation` on interactive elements to improve mobile response time  

### Design Support
- Figma comments
- Slack: `#base-design-support`

---

## Accessibility & Inclusion (Mobile Screen Readers)

### Overview
This guide covers mobile accessibility for screen reader users (VoiceOver on iOS, TalkBack on Android). Focus on grouping elements, defining accessibility attributes, and providing text alternatives to create excellent experiences.

### Accessibility Elements
An accessibility element is what gets focused and read aloud when users touch the screen — a rectangle with metadata that's spoken during navigation.

**VoiceOver attributes**:
- `label` (spoken text)
- `value` (numeric or state)
- `trait` (role, e.g., button)
- `hint` (what happens on interaction)

**TalkBack attributes**:
- `contentDescription` (label)
- `role`
- `action` (what happens on interaction)

### Grouping Elements
Screen reader navigation is time-intensive. Group elements going to the same destination to reduce swipes and clarify meaning/relationships.

**Why group**:
- Reduces navigation time (fewer swipes)
- Preserves meaning and content relationships
- Prevents confusing read-order (e.g., button read after unrelated label)

**VoiceOver**: Use `.accessibilityElementsHidden = YES` to hide elements already represented in UI text or decorative elements.

**Android**: `importantForAccessibility="no/yes/noHideDescendants"`

### Custom Action Menus
Menus reduce clutter and improve speed for complex interactions (especially swipe gestures).

- **VoiceOver**: Use actions rotor — "Actions available" spoken; swipe up/down to select, double-tap to activate
- **TalkBack**: Use TalkBack menu — three-finger tap opens menu; "Actions" section at top contains custom actions

**Use cases**:
- Swipe actions (list items — inaccessible otherwise for screen reader users)
- Repetitive actions across many list items (avoid hearing same actions repeatedly)

### Announcements
Tell screen readers to automatically announce dynamic content without user explicitly focusing it.

**Use for**: notifications, system alerts, toasts, snackbars, driver arrival updates, new walking directions, new messages.

### Focus Management
**General rule**: Don't mess with default system focus or focus order. Let OS handle it (expected behavior).

**Do change focus when**:
- Tapping on a tab (when ViewController segue events don't fire but screen changes)
- Dismissing a modal/message and returning to previous context (return to scroll position)
- Expanding an accordion (occasionally)

**Don't change focus when**:
- Users navigate to new screen (expect first element like nav icon/title)
- Most other cases — preserve natural flow

### Escape Gestures
All screen readers have escape gestures to exit/go back. Any modal presentation must support escape gesture.

- **VoiceOver**: Two fingers in Z gesture (or double-finger scrub) to go back/close modal
- **TalkBack**: Swipe down-left to activate back button (browser) or close app (apps)

### Alternative Text (Alt Text)

#### Why Important
- Read aloud to screen reader users (visual, physical, cognitive disabilities, or preference)
- Visually appears when non-text content fails to load (poor internet)

#### Element Types
- **Informative images**: Convey concepts/info — need alt text
- **Decorative images**: Purely visual — can be hidden from screen readers

#### Identify Need for Alt Text
Ask:
- Context of element?
- Purpose: decorative or informative?
- Emotions to evoke?
- Context users should know?

#### Best Practices
- Alt text should describe essential information
- Write concisely, focus on purpose/meaning
- Keep under ~125 characters (screen readers may truncate)

#### Ways to Add Alt Text
1. **Copy Docs** — annotate in documentation
2. **Figma** — use Base annotation tool (see "Design for accessibility - Attributes, custom actions, and alternative text" screencast)

#### Roles & Responsibilities
- **Design**: Identify if element is informative vs decorative; include alt text annotation in Figma for engineers
- **Content Design**: Write alt text for photos, illustrations, icons, graphs, infographics; consult accessibility expert if needed
- **Product**: Consult content designer or accessibility expert; attend Content Office Hours or Product Equity Office Hours if no content designer
- **Engineering**: Fill alt text property; consult designer/content designer on wording; attend office hours if needed

#### Platform-Specific Implementation

**Web**:
- Decorative images: `alt=""` (empty string)
- Ensure appropriate `aria` attributes added; use `aria-label` for images
- Use screen reader to verify traversal/announcement
- If design lacks alt text, contact design team

**iOS**:
- Use `accessibilityLabel` to describe
- Also use `isAccessibilityElement`, `accessibilityTraits`, `accessibilityCustomActions`, `accessibilityHint` as needed
- Watch for redundancy (label on image can duplicate)
- See VoiceOver specs in Zeroheight component docs
- If alt text missing, contact design team

**Android**:
- Use `contentDescription` attribute
- Jetpack Compose: use semantic properties like `clickLabel` for buttons, `Modifier.semantics{}`
- Read Screen reader content section for combining hints
- Use TalkBack to verify naming/understandability
- Contact design team if alt text missing

### Product Inclusion Principles

Foster inclusive products that work for everyone — regardless of ability, background, or circumstance.

#### Principle 1: Recognize How Your Identity Informs Your Perspective
**Identity work**: Factors like race, gender, age, class, skin tone, religion, sexuality, ability shape your thoughts, beliefs, behaviors. Unpack identity to identify blind spots and avoid unintentional exclusion.

**Understand Your Identity**:
- Reflect on identities you hold
- Reflect on how you relate to those identities and why

**Understand Access to Opportunities**:
- Talent is everywhere, opportunity is not
- Societal practices grant different access to social, economic, political freedom
- Link between identity and place in society affects access

**Actions**:
- Listen to people with different lived experiences
- Learn about economic mobility, housing security, social justice
- Volunteer (food banks, shelters, housing assistance, mentorship) — see inequality up close

#### Principle 2: Consider Multiple Perspectives
**Design with, not for**: Ensure people with direct lived experience are authentically considered in design process.

**Build Empathy**:
- Consider perspectives of people from all backgrounds, locations, abilities, classes, cultures
- Products built with empathy resonate more deeply
- Users who feel seen/understood engage more and recommend to others

#### Principle 3: Prioritize Your Impact Over Your Intentions
** Examine impact, not intent**: When design harms communities, our instinct is to center good intentions over negative impact. We must consider consequences of our designs.

**Consider Who Benefits**:
- Ask: Are we prioritizing Uber over communities we serve?
- Ask: Who is most likely to be excluded?
- If trade-offs can harm communities, rethink them

**Consider Unintended Consequences**:
- Conduct adversarial testing
- Ensure careful review before launch
- Be intentional — your actions cause reactions

#### Learn and Improve
**Hold Ourselves Accountable**:
- Evaluate impact post-launch
- Design thoughtful, data-based success metrics
- Work with communities to understand impact and desired changes
- Iterate based on feedback

---

## Content Design & Writing Guidelines

### Core Philosophy

**User Advocacy**: We are our users' advocates. Before writing, immerse yourself in their needs, priorities, and goals. Focus not only on the specific experience but on the user's entire lifecycle — whether they're clinicians, researchers, patients, or other audiences engaging with ADHD pharmacotherapy research.

**User-First, Business-Second**: Consider potential user impact first; address business needs second. Write to help users solve problems and meet their goals.

**TL;DR**:
- Focus on users' needs, priorities, goals
- Prioritize impact on users over business impact
- Lead with most important information
- Be clear, conversational, concise, consistent
- Write in sentence case
- Avoid jargon, slang, idioms, acronyms, technical language
- Remember content may be localized into multiple languages

#### Voice & Tone
- Write like a human — conveys empathy, builds trust
- Second-person voice ("you", "your") in body text
- "We", "us", "our" acceptable when referring to organization/team
- Be positive (avoid negative phrasing)
- Be respectful (use please/thank you/sorry appropriately)
- Be conversational (direct, informal)

#### Prioritize Information
- Most important message = most noticeable (placement, size, style)
- Start headers/body with user goals, not required actions
- ✅ `To arrive on time, request within 15 minutes` (user goal first)
- ❌ `Request within 15 minutes to arrive on time` (action-first)

#### Be Conversational
- Direct, informal style as if speaking to someone
- Use common contractions (you're, it's, we'll, etc.)
- ✅ `Where to?` vs ❌ `Enter destination of ride`
- Use articles (`a`, `an`, `the`) and possessive pronouns (`your`, `their`, `our`)
- Note: button labels rarely use articles/pronouns

#### When to Use "We"
- ✅ `Thanks for letting us know. Your feedback helps us improve.`
- ❌ `We're matching you with a driver.` (implies people doing work; can sound like technology is doing it)

#### Adverse Event / Error Messaging
- Focus on what user needs to know, not internal system terms
- ✅ `Insufficient License History: You may not have at least 1 year of licensed driving experience in the US.`
- ❌ `When a driver doesn't have at least 1 year..., they have Insufficient License History.`

#### Writing Best Practices

**Be Concise**
- Use fewest words necessary
- Every word must have purpose; cut the rest

**Use Simple Words**
- `use` not `utilize`
- `pay` not `authorize payment`
- `Pick up` not `The order is ready for you to pick up`

**Verb Forms & Tenses**
- Use simplest verb form that makes sense
- Present tense preferred; future tense only when necessary for clarity
- Simple past tense for completed events
- Avoid perfect tenses unless required

**Active Voice**
- Use active over passive when possible
- "Learn how to improve ratings" not "Learn how ratings could be improved"

**Avoid Jargon & Acronyms**
- Spell out acronyms/initialisms, especially uncommon ones
- Don't use internal terminology in product
- Avoid feature name capitalization where possible

**Avoid Editorializing**
- Don't tell users how to feel; just provide info + solutions
- Avoid adjectives: great, easy, helpful, simple, best, amazing, friendly
- Avoid adverbs: always, never, quickly, simply

**Avoid Directional Language**
- No "below", "above", "to the left" — they don't translate well to RTL or assistive tech
- Don't refer to UI position for instructions

**Don't Refer to UI Components**
- Focus on user intent or label, not "button", "menu", "tab", "checkbox"
- Example: "Choose Use this as my default card" (not "Click the checkbox...")

**Account for Dynamic Content**
- Insert variables where least likely to truncate
- Watch for header/string line-break issues
- Example: `[FIRSTNAME], take a quick selfie` works for short names; for long names consider alternative phrasing

### Acronyms

Acronyms condense multiple words into a single expression by concatenating first letters (FOMO, YOLO) or initialisms (IDK, IRL).

**General rule**: Avoid acronyms in product — they're hard to understand and don't localize well.

**If you must use an acronym**:
1. Spell out what it stands for the first time it's used in a flow
2. Capitalize words only if it's a proper name (branded product, entity, place, organization)
3. Example: "Set up your batch-boosting queue (BBQ)" not "Set up your BBQ"

Internal reference: Uber acronyms list (Slack: `#content-design-guidelines`, Email: `@content-design-guidelines-group`)

## Deployment & Infrastructure

| Environment | URL / Host | Notes |
|---|---|---|
| Development | localhost:3000 | `npm run dev` |
| Production | [TBD] | Vercel / Netlify / other |
| Preview/Staging | [TBD] | PR deployments |

- **CI/CD**: [specify if any]
- **Domain**: [add if known]
- **Hosting**: Next.js app (likely Vercel)

---

## Important Conventions

### File Naming
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx`
- Components: PascalCase (`ResearchExplorer.tsx`)
- Utility files: kebab-case (`source.config.ts`)

### Content Files
- MDX files: `.mdx` extension
- Live in `content/docs/` mirroring URL structure
- Use frontmatter for metadata

### API Routes
- Route handlers: `route.ts` (Next.js 13+ convention)
- Location: `app/api/<path>/route.ts`

### Imports
- Prefer relative imports within feature folders
- Use `@/` alias for root-relative imports
- Example: `import { foo } from '@/lib/utils'`

---

## Key Configuration Files

| File | Purpose |
|---|---|
| `source.config.ts` | Fumadocs MDX collection config, frontmatter schema |
| `next.config.mjs` | Next.js configuration with MDX integration |
| `tsconfig.json` | TypeScript compiler options, path mappings |
| `components.json` | shadcn/ui component registry settings |
| `package.json` | Dependencies and scripts |
| `postcss.config.mjs` | Tailwind/PostCSS setup |

---

## Data & APIs

### Internal APIs
- `app/api/search/route.ts` — Site search endpoint
- `app/api/ai/route.ts` — AI/external integration (Exa?)

### External Services
- **Exa** — AI/external search (sdk package)
- **Fumadocs** — Documentation rendering

### Data Files
- Check `data/` directory for JSON/TS data sources

---

## Content Guidelines

### Medical / Research Content
- Follow evidence-based writing
- Cite sources appropriately (MDX can include references)
- Include appropriate medical disclaimers
- Follow editorial guidelines: [link to internal doc if exists]

### Tone & Voice
- Professional, accessible, educational
- Target audience: clinicians, researchers, patients
- Avoid unsupported claims

---

## Team & Ownership

| Role | Owner | Contact |
|---|---|---|
| Documentation Lead | [name] | [contact] |
| Frontend Dev | [name] | [contact] |
| Content Editor | [name] | [contact] |
| DevOps / Deployment | [name] | [contact] |

---

## Important Links & Resources

- **Fumadocs Docs**: https://fumadocs.dev/docs/mdx
- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Repository**: [GitHub URL if applicable]
- **Issue Tracker**: [Project board / GitHub Issues]
- **Staging URL**: [if exists]
- **Analytics**: [Google Analytics / Plausible / etc]

---

## Architectural Decisions (ADR)

### ADR-001: Fumadocs MDX for Documentation
- **Decision**: Use Fumadocs MDX over pure Next.js MDX
- **Rationale**: Built-in search, sidebar generation, type-safe collections, easier content management
- **Date**: [add date]

### ADR-002: shadcn/ui over custom components
- **Decision**: Adopt shadcn/ui as base component library
- **Rationale**: No external runtime dependency, copy-paste model, full customization
- **Trade-offs**: Requires manual updates

### ADR-003: App Router (Next.js 16)
- **Decision**: Use App Router (not Pages Router)
- **Rationale**: Modern React patterns, Server Components, better performance

---

## Open Questions / TODOs

- [ ] Finalize production deployment URL and hosting provider
- [ ] Document search indexing strategy
- [ ] Define content moderation workflow
- [ ] Set up analytics and monitoring
- [ ] Establish update schedule for content
- [ ] Create content style guide (if not present elsewhere)
- [ ] Define citation format (APA, AMA, etc.)
- [ ] Medical disclaimer language approval

---

## Revision History

| Date | Author | Changes |
|---|---|---|
| 2026-04-17 | Kilo | Initial document creation |
