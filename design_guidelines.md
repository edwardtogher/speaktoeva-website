# EVA Hero - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern SaaS landing pages like Linear and Notion, emphasizing clean minimalism with strategic brand color usage to highlight the innovative voice AI technology.

## Core Design Elements

### A. Color Palette
**Primary Brand**: 240 88% 53% (RGB 30,28,241 equivalent)
**Background**: Pure white (0 0% 100%)
**Text**: Charcoal gray (220 9% 25%) for primary text, lighter gray (220 5% 55%) for secondary
**Success States**: Green (142 76% 36%) for connected/active states
**Error States**: Red (0 84% 60%) for error notifications

### B. Typography
**Primary Font**: Inter or similar modern sans-serif via Google Fonts
**Headings**: Font weights 600-700, sizes from text-2xl to text-5xl
**Body Text**: Font weight 400-500, sizes text-sm to text-lg
**UI Elements**: Font weight 500, consistent with body sizing

### C. Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, and 16 (p-4, m-6, gap-8, etc.)
**Consistent rhythm** using these values for padding, margins, and gaps
**Generous whitespace** to emphasize the minimalist aesthetic

### D. Component Library

**EVA Logo Animation**:
- Five vertical bars with symmetrical scaling from horizontal midline
- Four distinct states: dormant (static), connecting (gentle pulse), speaking (dynamic scaling), listening (focused center activity)
- SVG-based for crisp scaling, brand color fills
- Clickable with subtle hover feedback

**Buttons**:
- Primary: Brand color background, white text, rounded corners
- Secondary: Outline style with brand color border
- Large touch targets (min 44px height)
- Clear visual hierarchy between primary actions

**Hero Section**:
- Centered content stack with generous vertical spacing
- Logo prominently positioned above headline
- Clear value proposition with supporting subtext
- Dual CTA buttons (Talk to EVA primary, Book walkthrough secondary)

**Toast Notifications**:
- Minimal design with subtle shadows
- Status-appropriate colors (success green, error red)
- Auto-dismiss with manual close option

### E. Visual Hierarchy
**Content Structure**:
1. Animated EVA logo (primary focal point)
2. Compelling headline emphasizing voice AI capabilities
3. Supporting description text
4. Primary CTA: "Talk to EVA" button
5. Secondary CTA: "Book a 10-min walkthrough" link

**Emphasis Strategy**:
- Brand color used sparingly for maximum impact
- Logo animation as primary attention driver
- Clean typography hierarchy guides user flow
- Strategic use of whitespace creates breathing room

### F. Interaction Design
**Voice Call Flow**:
- Single-click activation from logo or button
- Real-time visual feedback through logo animation states
- Clear audio permissions and connection status
- Graceful error handling with helpful messaging

**Responsive Behavior**:
- Mobile-first approach with touch-friendly targets
- Logo scales appropriately across devices
- Maintains visual hierarchy on smaller screens
- Horizontal layout adjustments for optimal viewing

### G. Accessibility
- High contrast ratios for all text elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility for logo states
- Focus indicators consistent with brand colors

## Key Design Principles
1. **Minimalist Focus**: Every element serves the core goal of demonstrating voice AI
2. **Brand Consistency**: Strategic use of brand color creates memorable identity
3. **Functional Animation**: Logo animation provides meaningful feedback, not decoration
4. **Intuitive Interaction**: Clear affordances guide users toward voice engagement
5. **Professional Polish**: Clean execution builds trust in the AI technology

This design emphasizes the innovative nature of voice AI while maintaining professional credibility through clean, modern aesthetics.