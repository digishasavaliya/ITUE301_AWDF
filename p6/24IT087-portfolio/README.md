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

