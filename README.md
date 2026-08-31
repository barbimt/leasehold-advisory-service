# Leasehold Advisory Service

**Barbara** · 31 August 2026

Small prototype for The Leasehold Advisory Service. A leaseholder in England
or Wales can describe their situation and get a clearer next step. This is
triage and navigation. It is not personalised legal advice.

## What this build includes

- An accessible enquiry form: common situations, free text, or both
- A Django JSON API at `POST /api/triage/`
- A deterministic classifier with a small set of leasehold topics
- A result screen with a plain-English next step and curated LEASE links
- An unknown outcome when the tool cannot match one topic with confidence

## What we left out

- Authentication and user accounts
- Wagtail or any CMS
- LLM or generated legal answers
- Park-home enquiries
- Saving enquiry text
- Production deployment
- Mapping individual HTTP 400 field errors into the form
- The full GOV.UK Frontend library

See [PLAN.md](PLAN.md) for the original plan, [QUALITY.md](QUALITY.md) for
review notes, and [AI_USAGE.md](AI_USAGE.md) for how AI-assisted tools were
used.

## Prerequisites

- Node.js 22 (see `.nvmrc`; Node 22+ is required)
- Python 3.12 (see `.python-version`)

The frontend and Django run on your machine. There is no Docker step. Django
uses a local SQLite file only because Django expects a database setting. The
app does not store enquiries and you do not need to run migrations to use
triage.

Tailwind CSS is the visual layer. The UI uses semantic HTML. We followed
GOV.UK Design System patterns for things like errors and focus, without
installing GOV.UK Frontend.

## Frontend

From the repository root:

```sh
npm install
npm run frontend:dev
```

The Vite dev server proxies `/api` to Django at `http://127.0.0.1:8000`. Run
the backend as well so form submissions reach `POST /api/triage/`. The
frontend uses that relative path. It does not hard-code the Django origin.

If the API returns HTTP 400, the form shows a generic failure message.
Mapping individual server field errors into the form is still out of scope.

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

The backend exposes `POST /api/triage/` after you install dependencies
(including Django REST Framework via `requirements.txt`).

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

Backend, from the repository root (`backend/.env` present):

```sh
cd backend
source .venv/bin/activate
ruff check .
ruff format .
ruff format --check .
pytest
python manage.py check
```
