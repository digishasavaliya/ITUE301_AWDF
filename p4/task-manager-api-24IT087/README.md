# Task Manager API

## Project Overview
This project is a complete RESTful API built with Node.js and Express.js for managing tasks using an in-memory array. It is designed for a college practical and follows the required middleware, routing, and response patterns.

## Features
- Create, read, update, and delete tasks
- Global request logging middleware
- JSON content-type validation for POST and PUT requests
- Numeric task ID validation for update and delete routes
- In-memory task storage using an array
- Consistent JSON error and success responses
- Global 404 and 500 handlers

## Project Structure
```text
task-manager-api-ROLLNO/
├── middleware/
│   ├── logger.js
│   ├── validateContentType.js
│   └── validateTaskId.js
├── routes/
│   └── tasks.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Installation
1. Open the project folder.
2. Run:
```bash
npm install
```

## Start the Server
```bash
node server.js
```

The server will run at:
```text
http://localhost:5000
```

## API Endpoints
### GET /tasks
- Retrieves all tasks
- Status: `200`

### POST /tasks
- Creates a new task
- Request body:
```json
{
  "title": "Study Express"
}
```
- Status: `201`

### PUT /tasks/:id
- Updates an existing task
- Request body:
```json
{
  "title": "Study API Design",
  "completed": true
}
```
- Status: `200`

### DELETE /tasks/:id
- Deletes a task
- Status: `200`

## Sample Requests
### Create a task
```http
POST http://localhost:5000/tasks
Content-Type: application/json

{
  "title": "Study Express"
}
```

### Get all tasks
```http
GET http://localhost:5000/tasks
```

### Update a task
```http
PUT http://localhost:5000/tasks/1
Content-Type: application/json

{
  "title": "Study APIs",
  "completed": true
}
```

### Delete a task
```http
DELETE http://localhost:5000/tasks/1
```

## Sample Responses
### Success
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "title": "Study Express",
    "completed": false
  }
}
```

### Failure
```json
{
  "error": "Task not found"
}
```

## Middleware Explanation
### Request Logger
Logs every incoming request in this format:
```text
GET /tasks 2026-08-02T10:15:00.000Z
```

### Content-Type Validation
Rejects `POST` and `PUT` requests unless the `Content-Type` is `application/json` with a `415 Unsupported Media Type` response.

### Task ID Validation
Validates numeric IDs for `PUT /tasks/:id` and `DELETE /tasks/:id` routes. Invalid IDs return `400 Bad Request`.

## HTTP Status Codes Used
- `200` - Successful retrieval or update/delete
- `201` - Task created successfully
- `400` - Invalid task ID
- `404` - Route not found or task not found
- `415` - Unsupported media type
- `500` - Internal server error

## Testing using Postman
1. Start the server using `node server.js`.
2. Open Postman.
3. Set the request method and URL accordingly.
4. For `POST` and `PUT`, set the header:
```http
Content-Type: application/json
```
5. Send the request body as JSON.
6. Observe the response status and response body.

## Notes
- No database is used.
- Data is stored in an array inside the router for the duration of the server process.
- The project uses CommonJS modules as required.
