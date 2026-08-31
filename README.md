# Leasehold Advisory Service

**Barbara Torres** · 31 August 2026

Small prototype for The Leasehold Advisory Service. A leaseholder in England
or Wales can describe their situation and get a clearer next step. This is
triage and navigation. It is not personalised legal advice.

The browser is a React form. It posts to a Django JSON API at
`POST /api/triage/`. A deterministic classifier picks a leasehold topic or
returns unknown. The result screen shows a plain-English next step and
curated LEASE links. Enquiry text is not stored.

See [PLAN.md](PLAN.md) for the original plan, [QUALITY.md](QUALITY.md) for
review notes, and [AI_USAGE.md](AI_USAGE.md) for how AI-assisted tools were
used.

## What this prototype does not cover

- Login or user accounts
- Saving enquiry text
- Park-home enquiries
- Generated legal answers
- Production hosting

GOV.UK Design System patterns informed errors and focus. GOV.UK Frontend is
not installed. Mapping individual HTTP 400 field errors into the form is
still out of scope.

## Prerequisites

- Node.js 22 (see `.nvmrc`; Node 22+ is required)
- Python 3.12 (see `.python-version`)

The frontend and Django run on your machine. There is no Docker step. Django
uses a local SQLite file only because Django expects a database setting. You
do not need to run migrations to use triage.

## Frontend

From the repository root:

```sh
npm install
npm run frontend:dev
```

The Vite dev server proxies `/api` to Django at `http://127.0.0.1:8000`. Run
the backend as well so form submissions reach `POST /api/triage/`. The
frontend uses that relative path. It does not hard-code the Django origin.

## Backend

From the repository root:

```sh
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
python manage.py runserver
```

Copy `.env.example` to `.env` inside `backend/`. Django reads `backend/.env`.
The three variables are `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, and
`DJANGO_ALLOWED_HOSTS`.

## Validation

Frontend, from the repository root after `npm install`:

```sh
npm run frontend:lint
npm run frontend:format:check
npm run frontend:typecheck
npm run frontend:test
npm run frontend:build
```

Backend, from `backend/` with `.env` present and the virtualenv active:

```sh
ruff check .
ruff format --check .
pytest
python manage.py check
```

Optional: `python manage.py check_guidance_links` checks the curated LEASE
URLs over the network. Do not add it to CI. The live website can change
without a code change. Some networks get HTTP 403 from bot protection; the
command reports that as blocked, not as a missing page.
