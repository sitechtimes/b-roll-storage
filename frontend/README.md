# B-Roll Storage - Frontend

A modern Nuxt.js application for uploading, organizing, and managing B-roll video footage with user authentication and search capabilities.

## Features

### Core Features

- **User Authentication**: Login system with guest mode support
- **Upload**: Upload video files with preview and tagging
- **Library**: Browse and manage uploaded media with gallery view
- **Search**: Search through media library
- **View History**: Track recently viewed items with persistent state
- **AI Integration**: AI-powered features for media management

### Technical Features

- Persistent state management using Pinia with state persistence
- Protected routes with authentication middleware
- Real-time video preview
- Responsive design with Tailwind CSS and daisyUI

## Tech Stack

- **Framework**: [Nuxt.js 4.3](https://nuxt.com/) with Vue 3
- **State Management**: [Pinia 3](https://pinia.vuejs.org/) with persistent state
- **UI/Styling**: [Tailwind CSS 4.2](https://tailwindcss.com/) + [daisyUI 5.5](https://daisyui.com/)
- **Routing**: Vue Router 4
- **Video Playback**: [Video.js 8](https://videojs.com/)
- **Language**: TypeScript
- **Linting**: Nuxt ESLint

## Project Structure

```
app/
├── app.vue                        # Main layout and navigation
├── pages/
│   ├── login.vue                  # Authentication page
│   ├── upload.vue                 # Video upload page
│   └── library.vue                # Media gallery/library
├── stores/
│   ├── auth.ts                    # Authentication state
│   └── viewHistory.ts             # View history tracking
├── middleware/
│   └── auth.global.ts             # Global auth middleware
├── assets/
│   └── css/
│       └── main.css               # Global styles
└── components/                    # Reusable Vue components

public/
├── test-data.json                 # Sample media data
└── [other static files]

Configuration Files:
├── nuxt.config.ts                 # Nuxt configuration
├── package.json                   # Dependencies and scripts
└── tailwind.config.ts             # Tailwind CSS config (if present)
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The application will hot-reload as you make changes.

### Build for Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Generate a static site:

```bash
npm run generate
```

## Application Routes

| Route      | Purpose                              | Protected |
| ---------- | ------------------------------------ | --------- |
| `/login`   | User authentication and guest access | No        |
| `/upload`  | Upload and manage video files        | Yes       |
| `/library` | Browse media gallery and search      | Yes       |

## State Management

### Auth Store (`stores/auth.ts`)

Manages user authentication state:

- User login/logout
- Guest mode support
- Session persistence across page reloads
- Accessible via `useAuthStore()` composable

### View History Store (`stores/viewHistory.ts`)

Tracks user interactions with media:

- Recently viewed items
- Persistent storage for analytics
- Accessible via `useViewHistoryStore()` composable

## Middleware

### Global Auth Middleware (`middleware/auth.global.ts`)

Protects routes and manages navigation:

- Prevents unauthenticated access to protected routes
- Redirects to login page when needed
- Checks session validity

## Pages

### `/login` - Authentication Page

- User login form
- Guest mode option
- Session management

### `/upload` - Upload Page

- File selection and upload
- Video preview during upload
- Tagging and metadata management
- Protected by auth middleware

### `/library` - Media Gallery

- Browse uploaded media
- Search functionality
- View history tracking
- Media item details and actions
- Protected by auth middleware

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build application for production
- `npm run preview` - Preview production build locally
- `npm run generate` - Generate static site
- `npm run postinstall` - Prepare Nuxt (auto-run after install)

## Configuration

### Nuxt Config (`nuxt.config.ts`)

- Tailwind CSS integration via Vite plugin
- Pinia setup with persistence plugin
- ESLint configuration
- Vue Router setup

### Tailwind CSS

Configured with daisyUI for pre-built components and dark mode support.

### Pinia Persistence

State is automatically persisted to localStorage for:

- Authentication state
- View history
- User preferences

## Browser Support

Works on all modern browsers supporting:

- ES2020+
- CSS Grid and Flexbox
- Local Storage (for Pinia persistence)

## Development Tips

- Use Vue DevTools to inspect component state and Pinia stores
- Check browser console for any warnings or errors
- Hot-reload works automatically during development
- State persists in localStorage - clear browser data to reset

## Features In Development

- [ ] Backend API integration
- [ ] MongoDB database setup
- [ ] User profile management
- [ ] Video thumbnail generation
- [ ] Advanced search filters
- [ ] Batch operations
- [ ] Media sharing
- [ ] Analytics dashboard

## Contributing

When working on features:

1. Create a feature branch from `main`
2. Make changes to the frontend
3. Test locally with `npm run dev`
4. Ensure no console errors
5. Commit with clear messages
6. Create a pull request

## Troubleshooting

**Port 3000 already in use:**

```bash
npm run dev -- -p 3001
```

**Dependencies issues:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**State not persisting:**
Check browser's localStorage is enabled and not blocked.

**Hot-reload not working:**
Try restarting the dev server with `npm run dev`.
