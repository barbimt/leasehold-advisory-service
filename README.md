# Leasehold Advisory Service

Small digital prototype for The Leasehold Advisory Service.

**Status:** first product slice in progress (controlled triage plus a JSON API).

## Prerequisites

- Node.js 22 (see `.nvmrc`; Node 22+ is required)
- Python 3.12 (see `.python-version`)
- Docker, for PostgreSQL via Compose

The app processes run on your machine. Only PostgreSQL runs in Docker.

## Frontend

From the repository root:

```sh
npm install
npm run frontend:dev
```

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
