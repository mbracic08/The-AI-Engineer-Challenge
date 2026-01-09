# Mental Coach Frontend

A modern, responsive chat interface built with Next.js, TypeScript, and Tailwind CSS that connects to the Mental Coach backend API.

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- The backend API running on `http://localhost:8000` (see the main [README.md](../README.md) for backend setup)

## Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

Or if you're using yarn:

```bash
cd frontend
yarn install
```

Or if you're using pnpm:

```bash
cd frontend
pnpm install
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

**Important:** Make sure the backend API is running on `http://localhost:8000` before using the frontend. You can start the backend with:

```bash
# From the project root
uv run uvicorn api.index:app --reload
```

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Features

- 🎨 Modern, clean UI with dark mode support
- 💬 Real-time chat interface with message history
- 🔄 Loading states and error handling
- 📱 Responsive design that works on all screen sizes
- ♿ Accessible design with proper contrast and focus states
- 🚀 Optimized for Vercel deployment

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Main chat page
│   └── globals.css     # Global styles with Tailwind
├── components/
│   ├── ChatMessage.tsx # Message display component
│   └── ChatInput.tsx   # Input component with send button
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── next.config.js      # Next.js configuration with API rewrites
```

## Configuration

### Environment Variables

The frontend uses environment variables to configure the backend API URL. Create a `.env.local` file in the `frontend` directory (you can copy from `.env.local.example`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For local development, this defaults to `http://localhost:8000` if not set.

For production deployment on Vercel, set the `NEXT_PUBLIC_API_URL` environment variable in your Vercel project settings to point to your deployed backend URL.

## Troubleshooting

### Backend Connection Issues

If you see errors about the backend not being available:

1. Ensure the backend is running: `uv run uvicorn api.index:app --reload`
2. Check that the backend is accessible at `http://localhost:8000`
3. Verify your `OPENAI_API_KEY` environment variable is set for the backend

### Port Already in Use

If port 3000 is already in use, Next.js will automatically try the next available port (3001, 3002, etc.). You can also specify a custom port:

```bash
PORT=3001 npm run dev
```

### Build Errors

If you encounter TypeScript errors during build:

```bash
npm run lint
```

This will help identify any type issues that need to be resolved.
