# DLC Web Admin Frontend - Structure Overview

## Version
0.0.1-alpha - Initial Frontend Release

## Architecture

The DLC Web Admin frontend follows a modular architecture that mirrors the backend structure. The application is built with:
- **Vite + React 19** for fast development and modern React features
- **TypeScript** for type safety
- **React Router v7** for client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS v4** for styling
- **Axios** for API communication

## Directory Structure

```
frontend/
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root component with providers
│   ├── router/
│   │   └── index.tsx           # Route definitions
│   ├── layout/
│   │   └── DashboardLayout.tsx # Main layout with navigation
│   ├── pages/
│   │   ├── dashboard/          # Dashboard page
│   │   └── settings/           # Settings page
│   ├── tools/
│   │   ├── data/               # Data management modules
│   │   │   ├── items/          # Items CRUD module
│   │   │   │   ├── types.ts    # TypeScript interfaces
│   │   │   │   ├── api.ts      # API calls
│   │   │   │   ├── hooks.ts    # React Query hooks
│   │   │   │   └── index.tsx   # Main component
│   │   │   ├── skills/         # Skills CRUD module
│   │   │   ├── skilllevel/     # Skill levels CRUD module
│   │   │   └── strings/        # Strings CRUD module
│   │   ├── auth/               # Authentication (placeholder)
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── register/
│   │   └── ui/                 # Shared UI components
│   │       ├── components/
│   │       │   ├── Button.tsx
│   │       │   ├── Card.tsx
│   │       │   ├── ErrorBox.tsx
│   │       │   ├── FormModal.tsx
│   │       │   ├── Loader.tsx
│   │       │   ├── NavBar.tsx
│   │       │   └── TableView.tsx
│   │       ├── hooks/          # Custom React hooks
│   │       └── context/        # React context providers
│   ├── api/
│   │   └── client.ts           # Axios instance and interceptors
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   └── styles/
│       └── index.css           # Global styles and Tailwind
├── docs/
│   ├── FRONTEND_STRUCTURE_OVERVIEW.md  # This file
│   ├── API_BINDINGS.md                 # API endpoint documentation
│   ├── CHANGELOG.md                    # Version history
│   └── README.md                       # Setup instructions
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── .env.example           # Environment variables template
```

## Module Organization

### Tools Layer
The `tools/` directory contains modular functionality similar to the backend:

#### Data Modules
Each data module (`items`, `skills`, `skilllevel`, `strings`) follows a consistent structure:
- `types.ts` - TypeScript interfaces and DTOs
- `api.ts` - Axios API calls
- `hooks.ts` - React Query hooks for data fetching and mutations
- `index.tsx` - Main page component with CRUD UI

#### UI Module
Reusable components used throughout the application:
- `Button` - Customizable button with variants
- `Card` - Container component for content sections
- `ErrorBox` - Error message display
- `FormModal` - Modal dialog for forms
- `Loader` - Loading spinner
- `NavBar` - Main navigation bar
- `TableView` - Generic data table with actions

### State Management

The application uses TanStack Query (React Query) for server state:
- Automatic caching and background refetching
- Optimistic updates
- Error handling
- Loading states

### Routing

React Router v7 handles client-side navigation:
- `/` - Dashboard
- `/items` - Items management
- `/skills` - Skills management
- `/skilllevels` - Skill levels management
- `/strings` - Strings/localization management
- `/settings` - Application settings

### API Integration

The API client (`src/api/client.ts`) provides:
- Base URL configuration from environment variables
- Request interceptor for authentication tokens
- Response interceptor for error handling
- Centralized error handling with redirects

### Styling

Tailwind CSS v4 is used for styling:
- Custom color scheme (primary gold, secondary dark)
- Responsive design
- Utility-first approach
- Consistent spacing and typography

## Data Flow

1. **User Action** → Component triggers action (e.g., create item)
2. **Hook Call** → React Query hook executes mutation
3. **API Request** → Axios sends request to backend
4. **Response** → Data is returned and cached
5. **UI Update** → Components re-render with new data
6. **Cache Invalidation** → Related queries are invalidated and refetched

## Best Practices

- All API calls go through the central `api` client
- Components use custom hooks for data fetching
- TypeScript ensures type safety across the application
- Reusable components promote consistency
- Environment variables configure the API URL
- Error boundaries handle unexpected errors

## Future Enhancements

- Authentication and authorization
- Advanced filtering and search
- Pagination for large datasets
- Export/import functionality
- Real-time updates with WebSockets
- Dashboard metrics and analytics
- User role management
