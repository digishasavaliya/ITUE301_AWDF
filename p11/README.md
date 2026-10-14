# Practical 11 — Dockerized Full-Stack Task Manager

This project containerizes the existing React/Vite frontend, Express/Mongoose backend, and MongoDB database. The Practical 1–10 features remain in the original application folders, including JWT authentication, protected task CRUD, in-memory caching, and EventEmitter notifications.

## Prerequisites

- Docker Desktop with Linux containers enabled
- Docker Compose v2 (`docker compose`)
- Ports `5173`, `5000`, and `27017` available

Verify Docker before starting:

```powershell
docker --version
docker compose version
docker info
```

## Start all services

Run these commands from this project root:

```powershell
docker compose config
docker compose up --build -d
docker compose ps
```

The first build installs dependencies from the existing lockfiles. Compose injects `mongodb://mongodb:27017/taskdb` into the backend; this hostname is available inside the Compose network only. The frontend is built with `VITE_API_URL=http://localhost:5000`, which is the URL the user's browser can reach.

Application URLs:

- Frontend: <http://localhost:5173>
- Backend health: <http://localhost:5000/health>
- Backend API root: <http://localhost:5000>
- MongoDB: `mongodb://localhost:27017` from a host MongoDB client

## Logs and stopping

```powershell
docker compose logs -f
docker compose logs -f backend
docker compose ps
docker compose top
docker compose stop
```

To start stopped services again, use `docker compose start`. To stop and remove containers and the network while retaining database data, use:

```powershell
docker compose down
```

Do not add `--volumes` unless you intentionally want to delete the named `mongodb-data` volume.

## Persistence

MongoDB stores its data in the named Docker volume `mongodb-data`. Recreating containers with `docker compose down` followed by `docker compose up -d` keeps users and tasks. Confirm the volume with `docker volume ls` and `docker volume inspect p11_mongodb-data` (the project prefix may differ if the folder is renamed).

## Validation checklist

```powershell
docker compose config
docker compose build frontend
docker compose build backend
docker compose up -d
docker compose ps
Invoke-RestMethod http://localhost:5000/health
Invoke-WebRequest http://localhost:5173
```

For the application workflow, open the frontend, register and log in, then create, edit, complete, and delete a task from the protected Projects page. Inspect `docker compose logs -f backend` after creating a task: the `Task notification scheduled` and delayed `Task notification completed` messages verify the existing EventEmitter listener. The browser Network tab should show API calls to `http://localhost:5000`, never `http://backend:5000`.

For a direct API JWT check, register and log in first, then use the returned token:

```powershell
$body = @{ email = 'docker-test@example.com'; password = 'password123' } | ConvertTo-Json
Invoke-RestMethod http://localhost:5000/register -Method Post -ContentType 'application/json' -Body $body
$login = Invoke-RestMethod http://localhost:5000/login -Method Post -ContentType 'application/json' -Body $body
$headers = @{ Authorization = "Bearer $($login.token)" }
Invoke-RestMethod http://localhost:5000/tasks -Headers $headers
```

To check persistence, create a task, run `docker compose down`, run `docker compose up -d`, log in again, and confirm the task remains. This does not remove the volume. `docker compose down --volumes` intentionally removes the persisted database.

## Troubleshooting

- If a port is busy, stop the process using it or change the host-side value before the colon in `docker-compose.yml`.
- If the backend is unhealthy, run `docker compose logs backend mongodb`; MongoDB must pass its health check first.
- If the frontend shows API connection errors, rebuild after changing `VITE_API_URL`: `docker compose build --no-cache frontend`.
- If an old frontend bundle is displayed, reload without cache or recreate the frontend container.
- If authentication behaves unexpectedly after code changes, remove the browser's `token` local-storage item and log in again.
- If MongoDB data is unexpectedly missing, check that `mongodb-data` was not removed with `docker compose down --volumes`.

## Local development remains supported

The original local workflow is unchanged. Start MongoDB locally, use the existing backend `.env` with `MONGO_URI=mongodb://localhost:27017/AWDF_P5`, run `node server.js` in `task-manager-api-24IT087`, and run `npm run dev` in `24IT087-portfolio`. The container-specific URI is supplied only by Compose.
