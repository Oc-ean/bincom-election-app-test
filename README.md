
# Bincom Election Results

A full-stack web app for viewing, summing, and recording polling unit results from the 2011 Delta State elections.

## Live Demo

- **Frontend:** [https://bincom-election-app-test.vercel.app](<https://bincom-election-app-test.vercel.app>)
- **API:** [https://bincom-election-api.onrender.com](<https://bincom-election-api.onrender.com>)

> Note: The API uses Render's free tier and may take around 30 seconds to respond after inactivity.

## Tech Stack

- **Frontend:** Vue 3, Vite, Vue Router, Axios, Lucide
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Supabase)

## Features

- **Polling Unit Results:** View election results by LGA, ward, and polling unit.
- **LGA Results:** Calculate total votes across polling units and compare with official results.
- **Add Polling Unit:** Create a polling unit and record results for all parties.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/lgas` | List LGAs |
| GET | `/api/wards/:lga_id` | List wards |
| GET | `/api/polling-units/:ward_id` | List polling units |
| GET | `/api/parties` | List parties |
| GET | `/api/polling-unit-result/:id` | Get polling unit results |
| GET | `/api/lga-sum/:lga_id` | Get summed LGA results |
| POST | `/api/polling-unit` | Add a polling unit and its results |

## Getting Started

**Requirements:** Node.js 18+ and a Supabase project with the required database schema and data.

### Backend

```
cd server
npm install
```

Create a `.env` file:

```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-role-key
PORT=4000
ALLOWED_ORIGINS=http://localhost:5173
```

Start the server:

```
npm run dev
```

### Frontend

```
cd client
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:4000
```

Start the app:

```
npm run dev
```

Open [http://localhost:5173](<http://localhost:5173>) in your browser.

## Database

The original MySQL dump was converted to PostgreSQL and imported into Supabase.

## License

For interview assessment purposes only.
