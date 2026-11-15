# CityCare

CityCare is a web application for reporting and managing city service complaints. Residents can submit issues and follow their progress, while city staff can review reports and coordinate responses.
 live link: https://city-complaint-service-request-forn.vercel.app

## Features

- Public complaint listings and complaint details
- Complaint submission, tracking, and status updates
- Role-based dashboards for citizens, administrators, technicians, and department officers
- Complaint assignment and department/category management
- Notifications, payment flows, and user profile management
- Google sign-in support
- Map-based location selection and display

## Who does what?

CityCare brings residents and city service teams together in one place. Each role has a clear part to play:

- **Citizen — Report and stay informed.** Choose a service category, describe a local issue, add its location and supporting photos, then follow its status from a personal dashboard. Citizens can also review updates, manage related payments, and share feedback.
- **Department Officer — Coordinate the response.** Review complaints for the department, organize work assignments, and keep an eye on complaint progress, service categories, and department activity.
- **Technician — Get the work done.** View assigned jobs, manage active assignments, update work progress, and look back at completed work.
- **Administrator — Keep the service running.** Get an overview of platform activity and manage users, complaints, departments, categories, assignments, and payments.

### From a report to a response

1. A citizen submits a complaint with a description, category, and location.
2. The responsible department reviews the report and coordinates an assignment.
3. A technician works on the assigned issue and updates its progress.
4. The citizen follows those updates and can share feedback when appropriate.

Every step is designed to make it easier for residents to speak up and for city teams to respond transparently.

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS
- Axios for API requests
- TanStack Query for server-state management
- Zustand for client-side authentication state
- React Hook Form and Zod for forms and validation

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version
- npm
- A running CityCare backend API

### Install dependencies

```bash
npm ci
```

### Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

Replace the API URL with the address of your backend. Replace port `5000` with the backend's local port. The Google client ID is needed only if Google sign-in is enabled.

The API client accepts either the backend origin or an origin that already ends in `/api/v1`. It adds `/api/v1` when needed.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Deployment

For a Vercel deployment, configure these variables in the **frontend** project's environment settings:

- `NEXT_PUBLIC_API_URL` — the deployed backend URL, for example `https://your-backend.example.com`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google OAuth client ID, if Google sign-in is enabled

`NEXT_PUBLIC_API_URL` is included in the browser bundle, so redeploy the frontend after changing it.

Configure these variables separately in the **backend** project's environment settings:

```env
BACKEND_URL=https://backend-alpha-olive-51.vercel.app
FRONTEND_URL=https://city-complaint-service-request-forn.vercel.app
```

- `BACKEND_URL` — the backend's public base URL, used when backend code needs to build absolute links. This frontend does not read this variable; configure it if the backend uses it.
- `FRONTEND_URL` — the exact deployed frontend origin allowed by the backend's CORS configuration. Do not include a trailing slash. When credentials are enabled, configure the origin explicitly rather than using `*`.

Redeploy the backend after changing its environment variables. The backend's CORS response must allow the deployed frontend origin.

If API requests fail in the browser, check that:

1. The frontend is using the correct `NEXT_PUBLIC_API_URL`.
2. The backend is available over HTTPS in production.
3. The backend's CORS response allows the deployed frontend origin and credentials.

## Project structure

- `app/` — application routes and layouts
- `components/` — reusable interface components
- `hooks/` — authentication and data-fetching hooks
- `lib/` — API client, API functions, and utilities
- `store/` — client-side state stores
- `types/` — shared TypeScript types
