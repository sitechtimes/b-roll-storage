# B-Roll Storage

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
frontend/
├── app/
│   ├── app.vue                    # Main layout and navigation
│   ├── pages/
│   │   ├── login.vue              # Authentication page
│   │   ├── upload.vue             # Video upload page
│   │   └── library.vue            # Media gallery/library
│   ├── stores/
│   │   ├── auth.ts                # Authentication state
│   │   └── viewHistory.ts         # View history tracking
│   ├── middleware/
│   │   └── auth.global.ts         # Global auth middleware
│   ├── assets/
│   │   └── css/
│   │       └── main.css           # Global styles
│   └── components/                # Reusable Vue components
├── public/                        # Static files
│   └── test-data.json             # Sample media data
├── nuxt.config.ts                 # Nuxt configuration
└── package.json                   # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd b-roll-storage
   ```

2. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

3. Install dependencies:
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

- Manages user authentication state
- Handles login/logout logic
- Supports guest mode
- State persists across page reloads

### View History Store (`stores/viewHistory.ts`)

- Tracks recently viewed media items
- Persistent storage for user history
- Used for recommendations and user analytics

## Middleware

### Global Auth Middleware (`middleware/auth.global.ts`)

- Protects routes requiring authentication
- Redirects unauthenticated users to login
- Checks for valid user session

## Features In Development

- Backend integration for persistent data storage
- MongoDB database connection for media metadata
- Video thumbnail generation
- Advanced media filtering and organization
- AI-powered content tagging and recommendations
- User profile management

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build application for production
- `npm run preview` - Preview production build locally
- `npm run generate` - Generate static site
- `npm run postinstall` - Prepare Nuxt (auto-run after install)

## Configuration

Key configuration is handled in `nuxt.config.ts`. The application uses:

- Tailwind CSS via Vite plugin
- Pinia for state management with persistence plugin
- Nuxt ESLint for code quality

## Browser Support

Works on all modern browsers supporting:

- ES2020+
- CSS Grid and Flexbox
- Local Storage (for Pinia persistence)

## Contributing

When working on features:

1. Create a feature branch from `main`
2. Implement changes on the frontend
3. Test in development with `npm run dev`
4. Commit changes with clear messages
5. Create a pull request for review

## Future Enhancements

- [ ] Backend API integration
- [ ] MongoDB database setup
- [ ] User profile and preferences
- [ ] Video thumbnail generation
- [ ] Advanced search and filtering
- [ ] Batch operations
- [ ] Media sharing and collaboration
- [ ] Analytics dashboard
