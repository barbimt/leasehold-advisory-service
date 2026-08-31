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

## Live demo

- App: https://leasehold-advisory-service-frontend.vercel.app/
- API: `POST https://leasehold-advisory-service.onrender.com/api/triage/`

The React app is on Vercel. The Django API is on Render. Local development
still uses the Vite `/api` proxy with an empty `VITE_API_BASE_URL`. The
Render free instance may sleep; the first request after idle can fail or
take about a minute, then retry.

## What this prototype does not cover

- Login or user accounts
- Saving enquiry text
- Park-home enquiries
- Generated legal answers
- Always-on production hosting

GOV.UK Design System patterns informed errors and focus. GOV.UK Frontend is
not installed. Mapping individual HTTP 400 field errors into the form is
still out of scope.

## Prerequisites

- Node.js 22 (see `.nvmrc`; Node 22+ is required)
- Python 3.12 (see `.python-version`; `backend/.python-version` is the same
  value for a backend-rooted deploy)

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
frontend uses that relative path by default. An optional public
`VITE_API_BASE_URL` can point at a separate API origin later. Leave it empty
for local development. A frontend `.env` file is not required.

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
The required variables are `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, and
`DJANGO_ALLOWED_HOSTS`. Leave `CORS_ALLOWED_ORIGINS` empty locally so the
Vite proxy stays same-origin. Set it only when the API is called from a
separate frontend origin.

## API

The only application endpoint is `POST /api/triage/`.

The React form posts JSON through the frontend API client. Django REST
Framework validates the body, a deterministic classifier picks a topic, and
the response is curated guidance. Enquiry text is not stored.

During local development the frontend calls the relative URL `/api/triage/`.
Vite proxies `/api` to Django. To test Django directly, use:

`http://127.0.0.1:8000/api/triage/`

### Example request

```json
{
  "scenario": "repairs",
  "description": "There is a leak in the building."
}
```

Send `scenario`, `description`, or both. Extra fields are rejected.

### Example response

A known topic looks like this. Field names are the current contract. Values
are representative.

```json
{
  "topic": {
    "slug": "repairs",
    "label": "Repairs",
    "summary": "This topic may be relevant to questions about the condition of your home or building.",
    "nextStep": "Check your lease if you have it, keep a record of the problem, and look at LEASE guidance on repairs.",
    "primaryResource": {
      "title": "Repairs and maintenance in leasehold properties",
      "summary": "Who is usually responsible for repairs, and how to request work.",
      "url": "https://www.lease-advice.org/building-management/repairs/repairs-and-maintenance-in-leasehold-properties/",
      "linkText": "Read about repairs and maintenance"
    },
    "relatedResources": [
      {
        "title": "Water leaks in leasehold flats",
        "summary": "Who may be responsible for leaks, and what to check in your lease.",
        "url": "https://www.lease-advice.org/building-management/repairs/water-leaks/",
        "linkText": "Read about water leaks in leasehold flats"
      }
    ]
  }
}
```

Known topics can include more related resources. The unknown topic uses slug
`unknown`, `primaryResource` is `null`, and `relatedResources` is empty.

### Validation and fallback

An empty request (no situation and no description) returns a validation
error. If the classifier is not sure, it returns the controlled `unknown`
topic instead of guessing.

### curl

```sh
curl http://127.0.0.1:8000/api/triage/ \
  -H 'Content-Type: application/json' \
  -d '{"scenario":"repairs","description":"There is a leak in the building."}'
```

The same body works against the public API:

```sh
curl https://leasehold-advisory-service.onrender.com/api/triage/ \
  -H 'Content-Type: application/json' \
  -d '{"scenario":"repairs","description":"There is a leak in the building."}'
```

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
command reports that as blocked, not as a missing page. Developers can also
run the guidance-link check manually from the GitHub Actions tab.
