# Leasehold Advisory Service

**Barbara Torres** · 31 August 2026

A small digital service for leaseholders in England and Wales.

Users can choose a common situation or describe their problem in their own words. The service classifies the enquiry and shows a clear next step with links to official guidance.

The service is designed for triage and navigation. It doesn't provide personalised legal advice.

## Live demo

- **App:** https://leasehold-advisory-service-frontend.vercel.app/
- **API:** `POST https://leasehold-advisory-service.onrender.com/api/triage/`

The React frontend is hosted on Vercel and the Django API is hosted on Render.

> The API uses Render's free tier and may sleep when it hasn't been used for a while. The first request can take longer while the service starts again.

## How it works

The main flow is:

```text
User enquiry
    ↓
React form
    ↓
POST /api/triage/
    ↓
Django REST Framework
    ↓
Controlled classification
    ↓
Topic + curated guidance
    ↓
React result
```

A user can:

- choose a common situation
- describe their situation in free text
- use both together

If a situation is selected, that choice decides the topic. “I'm not sure” maps to `unknown`.

If the user only writes free text, Django normalises the text and checks it against controlled phrases linked to the available topics.

If one topic matches clearly, the API returns that topic and its guidance.

If the service can't identify one clear topic, it returns the `unknown` topic instead of guessing.

Enquiry text is processed for the request but isn't stored.

## Project structure

The prototype has two main parts:

- **Frontend:** React, TypeScript, Vite and Tailwind CSS
- **Backend:** Django and Django REST Framework

The frontend is responsible for the user journey and presentation.

The backend is responsible for validation, classification, controlled topic data and guidance links.

For more detail:

- [PLAN.md](PLAN.md) — original implementation plan
- [QUALITY.md](QUALITY.md) — quality decisions, self review and future improvements
- [AI_USAGE.md](AI_USAGE.md) — how AI-assisted tools were used

## Prerequisites

- Node.js 22+
- Python 3.12

Version files are included in the repository:

- `.nvmrc`
- `.python-version`
- `backend/.python-version`

No additional database setup is required. Django uses SQLite for its local configuration.

The triage flow doesn't persist enquiries.

## Run locally

Keep both processes running: the Django API and the React app.

### 1. Backend

From the repository root:

```sh
cd backend

python3.12 -m venv .venv
source .venv/bin/activate

pip install -r requirements-dev.txt

cp .env.example .env

python manage.py runserver
```

Copy `.env.example` to `.env` before starting Django. The example contains the local configuration required by the backend.

`CORS_ALLOWED_ORIGINS` can stay empty for local development because Vite proxies `/api` requests to Django.

The API listens at:

```text
http://127.0.0.1:8000
```

You don't need migrations to use triage. Django may warn about unapplied
migrations; you can ignore that.

### 2. Frontend

In another terminal, from the repository root:

```sh
npm install
npm run frontend:dev
```

The app opens at:

```text
http://localhost:5173/
```

Vite proxies `/api` to:

```text
http://127.0.0.1:8000
```

so the form can post to `/api/triage/` on the Vite origin.

No frontend `.env` file is required locally.

The optional public variable:

```text
VITE_API_BASE_URL
```

is only needed when the frontend and API are hosted on different origins.

## API

### Triage an enquiry

```http
POST /api/triage/
Content-Type: application/json
```

Direct local URL:

```text
http://127.0.0.1:8000/api/triage/
```

Public API:

```text
https://leasehold-advisory-service.onrender.com/api/triage/
```

### Request

Send `scenario`, `description`, or both.

```json
{
  "scenario": "repairs",
  "description": "There is a leak in the building."
}
```

An empty request returns a validation error.

Unexpected JSON fields are rejected.

### Response

A successful classification returns a controlled topic and its guidance:

```json
{
  "topic": {
    "slug": "repairs",
    "label": "Repairs",
    "summary": "This topic may be relevant to questions about the condition of your home or building and who may be responsible for repairs.",
    "nextStep": "Check your lease if you have it, keep a record of the problem, and look at guidance on repairs.",
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

If the classifier can't identify one clear topic, it still returns HTTP 200 with a `topic` object whose `slug` is `unknown`, `primaryResource` is `null`, and `relatedResources` is empty.

### Test with curl

Local:

```sh
curl -X POST http://127.0.0.1:8000/api/triage/   -H "Content-Type: application/json"   -d '{"scenario":"repairs","description":"There is a leak in the building."}'
```

Public API:

```sh
curl -X POST https://leasehold-advisory-service.onrender.com/api/triage/   -H "Content-Type: application/json"   -d '{"scenario":"repairs","description":"There is a leak in the building."}'
```

## Quality checks

### Frontend

From the repository root:

```sh
npm run frontend:lint
npm run frontend:format:check
npm run frontend:typecheck
npm run frontend:test
npm run frontend:build
```

### Backend

From `backend/`, with `.env` present and the virtual environment active:

```sh
ruff check .
ruff format --check .
pytest
python manage.py check
```

GitHub Actions runs the frontend checks and backend Ruff plus pytest on every push and pull request. Django's system check is run locally.

## Guidance link maintenance

The backend contains curated links to official guidance.

From `backend/`, with the virtual environment active, you can check those links with:

```sh
python manage.py check_guidance_links
```

The same check is also available from the **GitHub Actions** tab using the manual **Check guidance links** workflow.

It isn't part of normal CI because the external website can be temporarily unavailable or block automated requests without there being a problem with this application.

## What this prototype doesn't cover

This first version intentionally doesn't include:

- login or user accounts
- storing enquiries
- park-home enquiries
- personalised or generated legal advice
- a full content-management workflow
