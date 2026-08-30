# Leasehold Advisory Service

Small digital prototype for The Leasehold Advisory Service.

**Status:** first product slice in progress (controlled triage, a JSON API, and
an enquiry form connected to `POST /api/triage/`).

## Prerequisites

- Node.js 22 (see `.nvmrc`; Node 22+ is required)
- Python 3.12 (see `.python-version`)
- Docker, for PostgreSQL via Compose

The app processes run on your machine. Only PostgreSQL runs in Docker.

Tailwind CSS is used for the visual layer. The UI uses semantic React/HTML
controls and follows relevant GOV.UK Design System accessibility and service
patterns without depending on GOV.UK Frontend.

## Frontend

From the repository root:

```sh
npm install
npm run frontend:dev
```

The Vite dev server proxies `/api` to Django at `http://127.0.0.1:8000`. Run the
backend as well so form submissions reach `POST /api/triage/`. The frontend
calls that relative path; it does not hard-code the Django origin.

If the API returns a validation error (HTTP 400), the form currently shows a
generic failure message. Mapping individual server field errors into the form
is deferred.

## Backend

From the repository root, start PostgreSQL:

```sh
docker compose up -d
```

Then, still from the repository root:

```sh
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
python manage.py runserver
```

Copying `.env.example` to `.env` must be done inside `backend/`. Django reads `backend/.env`.

The backend exposes `POST /api/triage/` after installing dependencies (including Django REST Framework via `requirements.txt`).

## Validation

Frontend, from the repository root after `npm install`:

```sh
npm run frontend:lint
npm run frontend:format
npm run frontend:format:check
npm run frontend:typecheck
npm run frontend:test
npm run frontend:build
```

Backend, from the repository root (PostgreSQL running, `backend/.env` present):

```sh
cd backend
source .venv/bin/activate
ruff check .
ruff format .
ruff format --check .
pytest
python manage.py check
```
