# Practical 6 - Full Stack Task Management Application

This project extends the Practical 1-5 portfolio and Task Manager API into a full-stack application. The Projects page keeps the portfolio showcase and now manages tasks through the Express API.

## Features

* Reusable React components
* Props for data passing
* Skills rendered dynamically
* Simple and responsive UI

## Features

* Create, view, update, and delete tasks
* Loading and error states
* Delete confirmation and success/error notifications
* MongoDB persistence across browser and server restarts

## Technologies

* React
* Node.js and Express.js
* MongoDB and Mongoose
* CORS
* Thunder Client

## Architecture

React -> Express -> Mongoose -> MongoDB

The backend runs on port `5000` and the Vite frontend runs on port `5173`. Keep MongoDB credentials in the backend `.env` file; never put them in frontend code or this README.

## Installation and Run

Backend:

```bash
cd task-manager-api-24IT087
npm install
node server.js
```

Frontend, in a second terminal:

```bash
cd 24IT087-portfolio
npm install
npm run dev
```

Open `http://localhost:5173` and visit the Projects page. Use Thunder Client with `http://localhost:5000/tasks` to test GET, POST, PUT, and DELETE. Verify created documents in the `TaskManager` database and `tasks` collection using the MongoDB extension.

# Practical 8 - Performance Optimization and Lazy Loading

## Objective

Improve frontend performance by splitting route-based JavaScript into smaller chunks with React.lazy() and Suspense. The goal is to reduce the initial JavaScript required for the first view while preserving the existing protected task workflow, authentication, and task CRUD behavior.

## What was changed

* Route-level pages such as Home, Projects, Contact, Login, Register, and NotFound are loaded lazily.
* A reusable PageLoader component provides a clean fallback loading screen.
* Suspense wraps the existing Routes section so each route loads only when needed.
* The task manager, JWT authentication, login/register/logout, and protected routes were kept intact.

## React.lazy()

`React.lazy()` lets a component load only when the route is requested. This prevents the browser from downloading all page code upfront. Instead, it downloads a chunk when the user navigates to that route.

## Suspense

`Suspense` shows a fallback UI while the browser loads the lazily imported component. In this project, the fallback is a small loading card with a spinner and the text “Loading page...”. This keeps the app responsive without breaking the route flow.

## Route-based code splitting

The app now uses code splitting at the route level. The initial bundle remains smaller because the main shell loads first, and each page chunk is fetched only when needed. This is especially helpful for pages like Projects and Contact, which are heavier than the landing page.

## Before/after performance comparison

See the file [docs/performance-before-after.md](docs/performance-before-after.md) for the measured before and after build data and the comparison table.

## How to test lazy loading

1. Start the backend and frontend servers.
2. Open the app in Chrome.
3. Open DevTools > Network.
4. Filter to JS.
5. Reload the Home page and note the initial JavaScript loaded.
6. Navigate to /projects and check that a separate Projects chunk downloads.
7. Navigate to /contact and check that a separate Contact chunk downloads.
8. Use Slow 3G throttling to confirm the fallback loader appears while the chunk loads.

## Chrome DevTools Network testing

Use the following workflow:

1. Open the frontend in Chrome.
2. Go to DevTools > Network.
3. Select JS only.
4. Reload the Home page.
5. Observe the initial JavaScript bundle.
6. Navigate to /projects and confirm the route chunk loads.
7. Navigate to /contact and confirm the route chunk loads.
8. Repeat with Slow 3G to see the loading state clearly.

## Slow 3G testing

Slow 3G simulates a weak connection. This makes the fallback loader visible for longer and helps confirm that the route code is truly being downloaded on demand instead of bundled into the initial page load.

## React DevTools Profiler observation

No definite unnecessary re-render was identified during this practical. The app remains stable and the lazy loading does not change the behavior of the task manager or protected routes.

> Note: lazy loading reduces the JavaScript required at the initial route, while the total downloaded code for a full session may still be similar over time because the user eventually loads more route chunks.

