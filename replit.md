# EVA Voice AI Landing Page

## Overview

EVA is an AI voice assistant platform that handles phone calls for businesses 24/7. The project is a single-page React application that showcases EVA's capabilities through an interactive voice demo powered by Vapi AI. The landing page features a clean, minimalist design with an animated five-bar logo that responds to voice interaction states, allowing users to start conversations with EVA directly through their browser.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system following modern SaaS aesthetics
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context for Vapi integration state, TanStack Query for server state

### Component Design System
- **Color Palette**: Pure white background with brand blue (RGB 30,28,241) as primary accent
- **Typography**: Inter font family with consistent weight and sizing hierarchy
- **Layout**: Tailwind spacing units (4, 6, 8, 12, 16) for consistent rhythm
- **Responsive Design**: Mobile-first approach with clamp() functions for fluid typography

### Voice Integration Architecture
- **Voice Provider**: Vapi AI Web SDK for real-time voice interactions
- **Logo Animation**: Custom SVG component with four distinct states (dormant, connecting, speaking, listening)
- **State Management**: React Context pattern managing voice call lifecycle and visual feedback
- **Event Handling**: Vapi SDK event listeners for call-start, call-end, speech-start, and speech-end

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints
- **Database**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Session Management**: In-memory storage implementation with interface for future database integration
- **Development**: Vite middleware integration for seamless development experience

### Data Storage Solutions
- **ORM**: Drizzle with PostgreSQL dialect for type-safe database operations
- **Schema**: User table with username/password fields as foundation
- **Migrations**: Drizzle Kit for database schema versioning
- **Storage Interface**: Abstracted storage layer allowing easy transition from memory to database

### Design Guidelines Implementation
- **Reference-Based Approach**: Inspired by Linear and Notion for clean minimalism
- **Component Library**: Toast notifications, responsive buttons, and accessible form elements
- **Animation System**: CSS-based logo animation with configurable timing and scaling
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support

## External Dependencies

### Voice AI Platform
- **Vapi AI**: Primary voice interaction service with Web SDK integration
- **Configuration**: Assistant ID and public key for voice call initialization
- **Features**: Real-time speech recognition, natural language processing, and text-to-speech

### UI and Development Tools
- **Shadcn/ui**: Component library built on Radix UI for accessible interface elements
- **Radix UI**: Headless component primitives for dialogs, tooltips, and form controls
- **TanStack Query**: Server state management for API calls and caching
- **React Hook Form**: Form handling with Zod validation integration

### Database and Backend Services
- **Neon Database**: PostgreSQL hosting service for production data storage
- **Drizzle ORM**: Type-safe database toolkit with schema generation
- **Connect PG Simple**: PostgreSQL session store for user authentication

### Styling and Assets
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **React Icons**: Icon library including Simple Icons for brand integrations
- **Lucide React**: Additional icon set for UI elements and controls

### Booking Integration
- **Cal.com**: External calendar booking service for demo appointments
- **Integration**: Direct linking to booking flow for qualified leads

### Development Environment
- **Vite**: Build tool and development server with HMR support
- **TypeScript**: Type safety across frontend and backend code
- **ESBuild**: Fast bundling for production builds