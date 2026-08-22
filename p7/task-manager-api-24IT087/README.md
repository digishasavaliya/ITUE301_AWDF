# Task Manager API

## Project Overview
This project extends the Practical 6 Task Manager API with Practical 7 authentication and middleware while retaining MongoDB-backed task CRUD.

## MongoDB Integration
- Uses Mongoose for schema-based MongoDB access.
- Stores tasks in a MongoDB collection using a dedicated Task model.
- Reads configuration from the environment using dotenv.

## Folder Structure
```text
task-manager-api-24IT087/
├── middleware/
│   ├── logger.js
│   ├── validateContentType.js
│   └── validateTaskId.js
├── models/
│   └── Task.js
├── routes/
│   └── tasks.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Installation
1. Open the project folder.
2. Run:
```bash
npm install
```
3. Create a MongoDB connection string and place it in the .env file.

## Environment Variables
Create a .env file with:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
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

### GET /tasks/:id
- Retrieves one task by ID
- Status: `200`
- Returns `404` if the task does not exist

### POST /tasks
- Creates a new task
- Request body:
```json
{
  "title": "Study MongoDB",
  "description": "Practical 5",
  "priority": "high"
}
```
- Status: `201`

### PUT /tasks/:id
- Updates a task
- Request body:
```json
{
  "title": "Study APIs",
  "completed": true,
  "priority": "medium"
}
```
- Status: `200`

### DELETE /tasks/:id
- Deletes a task
- Status: `200`

## Thunder Client Testing
Use Thunder Client inside VS Code.

### GET all tasks
```http
GET http://localhost:5000/tasks
```
Expected response:
```json
{
  "message": "Tasks retrieved successfully",
  "tasks": []
}
```

### POST a task
```http
POST http://localhost:5000/tasks
Content-Type: application/json

{
  "title": "Study MongoDB",
  "description": "Practical 5",
  "priority": "high"
}
```
Expected response:
```json
{
  "message": "Task created successfully",
  "task": {
    "title": "Study MongoDB",
    "description": "Practical 5",
    "completed": false,
    "priority": "high"
  }
}
```

### GET task by ID
```http
GET http://localhost:5000/tasks/<task_id>
```
Expected response:
```json
{
  "message": "Task retrieved successfully",
  "task": {
    "_id": "<task_id>",
    "title": "Study MongoDB"
  }
}
```

### PUT update task
```http
PUT http://localhost:5000/tasks/<task_id>
Content-Type: application/json

{
  "completed": true,
  "priority": "medium"
}
```
Expected response:
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "<task_id>",
    "completed": true
  }
}
```

### DELETE task
```http
DELETE http://localhost:5000/tasks/<task_id>
```
Expected response:
```json
{
  "message": "Task deleted successfully",
  "task": {
    "_id": "<task_id>"
  }
}
```

## MongoDB Extension
1. Open the VS Code MongoDB extension.
2. Connect using your MongoDB Atlas or local MongoDB connection.
3. Confirm that the database and collection are created after the first request.

## CRUD Examples
### Create
```bash
curl -X POST http://localhost:5000/tasks -H "Content-Type: application/json" -d '{"title":"Study MongoDB","description":"Practical 5","priority":"high"}'
```

### Read
```bash
curl http://localhost:5000/tasks
```

### Update
```bash
curl -X PUT http://localhost:5000/tasks/<task_id> -H "Content-Type: application/json" -d '{"completed":true}'
```

### Delete
```bash
curl -X DELETE http://localhost:5000/tasks/<task_id>
```

## Notes
- The project uses CommonJS modules as required.
- The existing logger, JSON content-type validation, 404 handler, and global error handler remain in place.

## Practical 7 Authentication
- Register users with bcrypt-hashed passwords.
- Login returns a JWT that expires according to `JWT_EXPIRES_IN`.
- All task routes and `GET /me` require JWT authentication.
- Task POST/PUT payloads use server-side validation middleware.
- The React client stores only the JWT in `localStorage`, handles 401 responses, and supports logout.

### Environment Variables
Copy `.env.example` to `.env` and set a private JWT secret. Never commit `.env` or place `JWT_SECRET` in the frontend.

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

### Authentication Endpoints
| Method | Endpoint | Auth |
| --- | --- | --- |
| POST | `/register` | No |
| POST | `/login` | No |
| GET | `/me` | Bearer token |
| GET | `/tasks` | Bearer token |
| GET | `/tasks/:id` | Bearer token |
| POST | `/tasks` | Bearer token |
| PUT | `/tasks/:id` | Bearer token |
| DELETE | `/tasks/:id` | Bearer token |

Protected requests must include:
```http
Authorization: Bearer <token>
```

### Practical 7 Test Sequence
1. `POST /register` with `{"email":"student@example.com","password":"password123"}`.
2. `POST /login` with the same JSON and copy `token`.
3. Call `GET /tasks` without a header and confirm `401`.
4. Call `GET /tasks` with `Authorization: Bearer <token>` and confirm `200`.
5. Create a task with `{"title":"JWT Protected Task","description":"Testing authentication","priority":"high"}`.
6. Test PUT, DELETE, and `GET /me` with the token.
7. Test `Bearer abc123invalid`, missing title, duplicate email, and an incorrect password.
8. In the MongoDB extension, confirm `users.password` begins with a bcrypt hash such as `$2b$10$` and never contains the plain password.

### Run Commands
Backend: `npm install` then `node server.js`.
Frontend: from `24IT087-portfolio`, run `npm install` then `npm run dev`.
