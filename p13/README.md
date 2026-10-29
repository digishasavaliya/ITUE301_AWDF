# Practical 13 — Dockerized Full-Stack Task Manager with Groq AI

[![CI Pipeline](https://github.com/digishasavaliya/ITUE301_AWDF/actions/workflows/ci.yml/badge.svg)](https://github.com/digishasavaliya/ITUE301_AWDF/actions/workflows/ci.yml)

This project contains a React/Vite frontend in `24IT087-portfolio`, an Express/Mongoose backend in `task-manager-api-24IT087`, and a Docker Compose setup for running them with MongoDB. Each app folder contains its Dockerfile and `.dockerignore`, so the same source folders support both local development and container builds. Features include JWT authentication, protected task CRUD, in-memory caching, EventEmitter notifications, and backend-only Groq task-description generation.

## Practical 13 — Groq AI task descriptions

The protected `POST /api/ai/generate-description` endpoint accepts only the task title and returns a short description. The Groq API key belongs in the backend because browser code and Vite variables are visible to users; keeping it server-side prevents client users from extracting and abusing the credential. The backend sends only the minimum necessary task title to Groq. Never send passwords, JWTs, personal identifiers, private student information, or other sensitive data.

AI output is a suggestion, not authoritative content. Review and edit it before saving. If Groq is unavailable, times out, rejects the key, or reaches quota, the endpoint returns a user-friendly fallback response and manual task creation remains available. A repeated normalized title is limited to one generation per minute; this rate limiter is in-memory and resets when the backend restarts, and it is not shared across multiple backend instances.

For local development, copy `.env.example` to `.env` in `task-manager-api-24IT087`, then replace the placeholder with your real key. The `.env` file is ignored by Git:

```powershell
Set-Location "D:\sem 5\ITUE301_AWDF\p13\task-manager-api-24IT087"
Copy-Item .env.example .env -Force
# Edit .env and set GROQ_API_KEY=your_real_key
```

Do not add the key to React, `VITE_*` variables, source files, logs, or API responses. For Docker Compose, set the root-shell variable before starting the stack:

```powershell
$env:GROQ_API_KEY = 'your_real_key'
docker compose up --build -d
```

The official `groq-sdk` package is installed only in the backend. The model defaults to `openai/gpt-oss-20b` and can be changed with `GROQ_MODEL`.

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

For local development, start MongoDB locally, use the backend `.env` with `MONGO_URI=mongodb://localhost:27017/AWDF_P5`, run `node server.js` in `task-manager-api-24IT087`, and run `npm run dev` in `24IT087-portfolio` (on PowerShell, use `npm.cmd run dev` if script execution is restricted). Compose builds directly from these same folders and supplies its own MongoDB URI.

Run the local application in two PowerShell windows:

```powershell
Set-Location "D:\sem 5\ITUE301_AWDF\p13\task-manager-api-24IT087"
npm.cmd install
npm.cmd start
```

```powershell
Set-Location "D:\sem 5\ITUE301_AWDF\p13\24IT087-portfolio"
npm.cmd install
npm.cmd run dev
```

After registering and logging in at `http://localhost:5173`, enter a task title and select **Generate description with AI**. To test provider failure without using quota, temporarily set `GROQ_API_KEY=` in the backend `.env`, restart the backend, and click the button; the UI should show an unavailable message while still allowing manual saving. Restore the key afterward.

### Practical 13 validation

```powershell
Set-Location "D:\sem 5\ITUE301_AWDF\p13\task-manager-api-24IT087"
npm.cmd test
Set-Location "D:\sem 5\ITUE301_AWDF\p13\24IT087-portfolio"
npm.cmd run build
```

## Practical 12 — CI/CD Pipeline with GitHub Actions

### Objective and workflow

Continuous integration (CI) automatically installs dependencies and checks the backend tests and frontend production build after code changes. Continuous delivery/deployment (CD) takes a verified build and prepares or publishes it to an environment; this practical configures CI checks only and does not deploy the application.

The workflow is [`.github/workflows/ci.yml`](./.github/workflows/ci.yml). It has separate Ubuntu jobs for backend tests and frontend build validation. It uses Node.js 22 and installs each app's dependencies with `npm install`. Backend tests run with `npm test`; the frontend is checked with `npm run build`. Neither job needs Docker, MongoDB, or a private `.env` file.

The workflow is configured for every push to `main` and pull requests targeting `main`. **Repository layout note:** the Git root detected for this checkout is the parent `ITUE301_AWDF` folder, while this project is in its `p12` subfolder. GitHub only loads workflow files from the Git root's `.github/workflows` directory. To activate the workflow in that repository, place this file at `ITUE301_AWDF/.github/workflows/ci.yml`; the job working directories already point to `p12/task-manager-api-24IT087` and `p12/24IT087-portfolio`. If P12 is later made its own Git repository, place the workflow at that repository's `.github/workflows/ci.yml` and remove the `p12/` prefix from both working directories. The status badge URL for the detected repository is `https://github.com/digishasavaliya/ITUE301_AWDF/actions/workflows/ci.yml/badge.svg`; it will show a status after GitHub discovers and runs the workflow.

### Run checks locally

In PowerShell, install and test the backend:

```powershell
Set-Location "D:\sem 5\ITUE301_AWDF\p12\task-manager-api-24IT087"
npm.cmd install
npm.cmd test
```

Build the frontend:

```powershell
Set-Location "D:\sem 5\ITUE301_AWDF\p12\24IT087-portfolio"
npm.cmd install
npm.cmd run build
```

### Inspect and demonstrate a failed run

After the workflow is installed at the actual repository root and pushed, open the repository on GitHub and select **Actions**. Choose **CI Pipeline**, then open a run and expand a job and step to read its logs. A red run means one or more checks failed; a green run means all jobs passed.

To demonstrate a deliberate test failure, temporarily change the first status assertion in `task-manager-api-24IT087/tests/api.test.js` from `expect(response.status).toBe(200);` to `expect(response.status).toBe(201);`. From the backend directory run `npm.cmd test` to confirm the test fails. Commit and push this test-only edit to `main` (or open a pull request targeting `main`) and capture the resulting failed Actions run. Do not leave this assertion in the final version.

Restore the expected status to `200`, run `npm.cmd test` again from the backend directory, then commit and push the restored assertion. Capture the new successful Actions run after GitHub finishes it. Suggested commits for the demonstration are `Demonstrate failing CI assertion` and then `Restore passing CI assertion`. Screenshots can be added here after the runs exist, for example under a `screenshots/` folder, with links to the actual images; no run links or screenshots are included before capture.

## GitHub repository

The detected remote is `https://github.com/digishasavaliya/ITUE301_AWDF.git`, and the current branch is `main`. To push the completed work after reviewing it, run `git add p12`, `git commit -m "Add GitHub Actions CI pipeline and automated tests"`, then `git push origin main` from the Git root. No changes are pushed automatically.
