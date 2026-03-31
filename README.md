# B-Roll Storage

This is a Nuxt.js application for uploading and managing B-roll video footage.

## Project Overview

The application consists of two main pages:

- `/upload`: Allows users to upload video files, preview them, and add tags.
- `/library`: Displays a gallery of uploaded media from a test data file.

## Tech Stack

- **Framework**: [Nuxt.js](https://nuxt.com/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/) with the [daisyUI](https://daisyui.com/) plugin
- **Language**: TypeScript

## Project Structure

- `app/`: Contains the main Vue.js application files.
  - `app.vue`: The main layout and navigation component.
  - `assets/`: For CSS and other static assets.
  - `pages/`: Contains the application's pages (`upload.vue`, `library.vue`).
- `public/`: For static files that are publicly accessible.
  - `test-data.json`: Sample data for the media library.
- `nuxt.config.ts`: Nuxt.js configuration file.
- `package.json`: Project dependencies and scripts.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1.  Clone the repository.
2.  Install the dependencies:

    ```bash
    npm install
    ```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Current State & Future Work

The project is in the early stages of development.

### What's working:

- Basic navigation between the upload and library pages.
- The library page fetches and displays media from a static JSON file.
- The upload page allows file selection, shows a video preview, and has a basic tagging UI.

### To-Do (based on `note.txt`):

- Implement backend logic for file uploads.
- Connect to a MongoDB database to store and retrieve media information.
- Generate thumbnails for uploaded videos.
- Implement the functionality to open and view a media item from the library.
