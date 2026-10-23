# Civic Desk — Digital FIR workflow demonstration

A college project demonstrating a complaint submission, tracking, and administration workflow. **This is not an official government or police service. It does not submit legally registered FIRs, contact emergency services, or integrate with police systems.** Use fictional data only.

## Architecture

- React 19, React Router, and Axios frontend (`frontend/`)
- Express 5 REST API (`backend/`)
- JSON files in `backend/data/` for local persistence
- bcrypt password hashing and short lived JWTs

MongoDB/Mongoose is not part of the current project. JSON storage keeps setup self contained for the college demo, but is not suitable for concurrent or production use. Supporting document selection is currently metadata only; file contents are not uploaded or stored.

The reusable language context includes English and Hindi translations for primary navigation, the landing page, footer, authentication screens, complaint tracking, status badges, and notification controls. The selector lists all 22 Eighth Schedule languages by native name; the other 20 are visibly marked “Coming soon” and cannot be selected. Remaining complaint-form fields, dashboard copy, and informational pages are still English. Hindi wording for legal or emergency information needs review by a fluent Hindi speaker. Locale dictionaries live in `frontend/src/locales/`. A small React context is used instead of adding i18next dependencies to this small existing app; it falls back to English for missing keys.

## Run locally

1. Install Node.js 18 or newer.
2. Configure the API:

   ```sh
   cd backend
   npm install
   cp .env.example .env
   ```

   Set `JWT_SECRET` in `backend/.env` to a unique random secret of at least 32 characters. Do not commit `.env` or reuse a production secret. `CORS_ORIGINS` accepts a comma separated list of trusted frontend origins.

3. Start the API in `backend/`:

   ```sh
   npm start
   ```

   The API listens at `http://localhost:5001` by default.

4. In another terminal start the React app:

   ```sh
   cd frontend
   npm install
   npm start
   ```

   The app runs at `http://localhost:3000`. Set `REACT_APP_API_URL` if the API is hosted elsewhere; its default is `http://localhost:5001/api`.

The backend initializes `users.json` and `firs.json` with fictional seed records when those files are absent. The initial local demo admin account is `admin@digitalfir.gov` / `password`; change or remove it before sharing the app. The admin role is a demo role, not a verified authority. Citizen accounts are created through registration.

## API overview

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create citizen account |
| POST | `/api/auth/login` | Public | Sign in and receive a JWT |
| POST | `/api/auth/reset-password` | Public demo flow | Reset with email and registered mobile |
| POST | `/api/firs` | Citizen/admin JWT | Submit a demo complaint |
| GET | `/api/firs` | JWT | List own complaints; admins list all |
| GET | `/api/firs/:id` | JWT + ownership/admin | Read a complaint |
| GET | `/api/firs/track/:referenceNumber` | Owner/admin JWT | Read the owner's status metadata and timeline |
| PUT | `/api/firs/:id/status` | Admin JWT | Update status and append history |
| GET/PUT | `/api/users/profile` | JWT | Read or update own profile |
| PUT | `/api/users/change-password` | JWT | Change own password |
| GET | `/api/users/notifications` | JWT | Read in-app notification history |
| PATCH | `/api/users/notifications/:id/read` | JWT | Mark an own notification as read |

Complaints require a title, category, incident details, and demo privacy acknowledgement. Repeated submissions with the same idempotency key return the existing complaint. Status changes require a note and append timestamped history. They also create persisted in-app notifications. Tracking requires sign-in and checks ownership; it returns status metadata without the original narrative or complainant details.

The JSON user records contain an ID, contact/profile fields, bcrypt password hash, role, and notifications. Complaint records contain a unique ID and demo reference, owner ID, complainant details, title/category/subcategory, incident details, acknowledgement timestamp, status, assigned demo officer, update history, and submission/update timestamps. Files are not represented as stored attachments.

## Data and security notes

- Passwords are bcrypt hashed. API JWT signing requires a configured secret; tokens expire after two hours.
- Express limits JSON request bodies, sets basic security headers, restricts CORS by origin, and rate limits authentication requests.
- Complaints are written to local JSON files. Keep those files private, use only fictional data, and delete demo records when no longer needed. There is no automated retention or deletion schedule.
- The password reset route verifies only email and mobile stored in local data. It has no email/SMS challenge and must not be used for a real account service.
- The bundled demo admin password is intentionally convenient for local evaluation and is not suitable for deployment.
- The backend does not currently implement actual file upload, MongoDB persistence, email notifications, or real police/government integration.
- JWTs are stored in browser local storage in this demo, which is vulnerable to token theft if a cross-site scripting bug is introduced. A production deployment should use a reviewed session design, HTTPS, and a database with backups and retention controls.

## Main pages

`/` landing page · `/register` and `/login` authentication · `/file-fir` guided complaint form · `/track-fir` owner verified status · `/dashboard` citizen summary · `/admin` and `/admin/firs` demo administration.

## Tests

```sh
cd backend && npm test
cd frontend && CI=true npm test -- --watchAll=false
cd frontend && npm run build
```

The backend integration test uses a temporary data directory and covers registration/login, ownership checks, duplicate submission handling, private tracking, admin notes, persistence, and notification read state.

## Adding a language

Add a complete locale file matching the key structure in `frontend/src/locales/en.js`, then register its code in `frontend/src/context/LanguageContext.js` and enable its entry in `frontend/src/components/LanguageSelector.js`. Add a language-switch test and have a fluent speaker review translated legal, complaint, and emergency wording before enabling it.
