# OL Technology Management Panel

## Overview

This is a full-stack web application designed as a management panel for OL Technology company. The system provides comprehensive analyst management capabilities with role-based access control, including salary tracking, vacation management, and performance monitoring. Built with a modern React frontend and Express.js backend, the application uses PostgreSQL for data persistence and includes authentication features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Management**: React Hook Form with Zod validation
- **Theme System**: Custom theme provider with light/dark mode support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Connection**: Neon serverless PostgreSQL
- **Authentication**: Session-based authentication with in-memory session store
- **API Design**: RESTful API with role-based access control

### Build System
- **Build Tool**: Vite for frontend bundling
- **Backend Build**: esbuild for server-side compilation
- **Development**: Hot module replacement with Vite dev server
- **TypeScript**: Strict type checking across the entire application

## Key Components

### Authentication System
- Session-based authentication with temporary in-memory storage
- Role-based access control (admin, manager, analyst)
- Protected routes and API endpoints
- User profile management with theme preferences

### Analyst Management Module
- Complete CRUD operations for analyst records
- Fields include: name, position, start date, active status, day-off settings, observations
- Role-restricted fields: performance ratings, salary information
- Comprehensive filtering and search capabilities

### Salary Management System
- Current salary tracking with adjustment history
- Historical salary records with dates and notes
- Role-based visibility (admin/manager only)
- Salary adjustment logging and audit trail

### Vacation Management
- Support for up to 4 vacation periods per analyst
- Date range validation and conflict detection
- Calendar integration for vacation tracking

### UI Components
- Comprehensive component library based on Radix UI primitives
- Responsive design with mobile-first approach
- Collapsible sidebar navigation
- Theme-aware components with CSS custom properties
- Toast notifications for user feedback

## Data Flow

### Client-Server Communication
1. React Query manages all server state and caching
2. API requests use fetch with automatic error handling
3. Session management through HTTP headers
4. Real-time updates through query invalidation

### Database Operations
1. Drizzle ORM provides type-safe database queries
2. Schema definitions shared between client and server
3. Migration support for database schema changes
4. Referential integrity with foreign key constraints

### Authentication Flow
1. Login credentials validated against user database
2. Session ID generated and stored in memory
3. Client stores session ID for subsequent requests
4. Role-based access enforced on both client and server

## External Dependencies

### Frontend Dependencies
- **@radix-ui/\***: Headless UI components for accessibility
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **date-fns**: Date manipulation utilities
- **class-variance-authority**: Component variant management
- **tailwindcss**: Utility-first CSS framework

### Backend Dependencies
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **express**: Web application framework
- **tsx**: TypeScript execution for development

### Development Dependencies
- **vite**: Frontend build tool and dev server
- **@vitejs/plugin-react**: React plugin for Vite
- **esbuild**: JavaScript bundler for backend
- **typescript**: Type checking and compilation

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for backend development with auto-restart
- Shared TypeScript configuration for consistency
- Development-specific error overlays and debugging tools

### Production Build
1. Frontend: Vite builds optimized React application
2. Backend: esbuild bundles Express server
3. Static assets served from dist/public directory
4. Environment variables for database configuration

### Database Management
- Drizzle Kit for schema migrations
- PostgreSQL hosted on Neon serverless platform
- Connection pooling and automatic scaling
- Environment-based configuration for different stages

## Changelog
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.