# Codex Collective

A modern, interactive social book discovery and tracking web application built with React, TypeScript, and Vite.

## Overview

Codex Collective is a social reading platform that empowers users to search, track, and share books. The application integrates with the Google Books API for book discovery and provides a seamless experience for managing your reading journey.

## Features

- **Book Discovery**: Search and discover books using the Google Books API
- **Reading Management**: Organize books into "Want to Read", "Currently Reading", and "Read" lists
- **Social Feed**: Like, comment, and share updates in a community feed
- **Drag & Drop**: Intuitive drag-and-drop interface for organizing your books
- **Local Persistence**: All data is stored locally using LocalStorage
- **Responsive Design**: Fully responsive UI that works on all devices

## Tech Stack

- **React 18+** with TypeScript
- **Vite** for fast development and building
- **React Router DOM** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Google Books API** for book data

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/d2kole/livre-final.git
cd livre-final
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Project Structure

```
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── store/          # Zustand state management
│   ├── services/       # API services
│   ├── types/          # TypeScript type definitions
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── dist/               # Production build output
```

## License

This project is private and proprietary.

