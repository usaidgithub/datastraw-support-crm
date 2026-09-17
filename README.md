# Datastraw Support CRM

A lightweight Support CRM system built for the Datastraw Technologies internship assessment.

The application allows support teams to create, search, filter, view, and update customer support tickets, including status, priority, and internal notes.

## Live Demo

**Deployed Application:**
https://datastraw-support-crm-beryl.vercel.app/

**GitHub Repository:**
https://github.com/usaidgithub/datastraw-support-crm

---

## Features

### Ticket Management

* Create support tickets with:

  * Customer name
  * Customer email
  * Issue title
  * Issue description
* Automatically generated ticket IDs such as `TKT-001`
* Automatic creation and update timestamps
* View complete ticket details
* Update ticket status:

  * Open
  * In Progress
  * Closed
* Add internal notes and comments to tickets

### Search & Filtering

Tickets can be searched across:

* Ticket ID
* Customer name
* Customer email
* Issue title
* Issue description

Tickets can also be filtered by status.

### Dashboard

The dashboard provides an overview of:

* Total tickets
* Open tickets
* In Progress tickets
* Closed tickets
* Recently created tickets

### Standout Feature — Ticket Priority

Each ticket has a priority level:

* Low
* Medium
* High
* Urgent

Priority was added because support teams need to distinguish between tickets based not only on their workflow status, but also on how urgently an issue should be handled.

The priority is visible throughout the CRM and can be updated from the ticket detail page.

### Responsive UI

The interface is designed to work across:

* Desktop
* Tablet
* Mobile

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js Route Handlers
* JavaScript
* Mongoose

### Database

* MongoDB Atlas

### Deployment

* Vercel

---

## API

The application exposes the following REST APIs.

### Create Ticket

```http
POST /api/tickets
```

Example request:

```json
{
  "customer_name": "John Smith",
  "customer_email": "john@example.com",
  "subject": "Payment failed",
  "description": "My payment was deducted but the order was not created."
}
```

Example response:

```json
{
  "ticket_id": "TKT-001",
  "created_at": "2026-09-16T23:25:02.489Z"
}
```

---

### List Tickets

```http
GET /api/tickets
```

Optional query parameters:

```text
?status=Open
?search=john
```

They can also be combined:

```text
GET /api/tickets?status=Open&search=john
```

The search supports ticket ID, customer name, customer email, subject, and description.

---

### Get Ticket

```http
GET /api/tickets/{ticket_id}
```

Example:

```http
GET /api/tickets/TKT-001
```

The response includes the ticket information and associated notes.

---

### Update Ticket

```http
PUT /api/tickets/{ticket_id}
```

The endpoint supports updating status, priority, and adding a note.

Example:

```json
{
  "status": "In Progress",
  "priority": "High",
  "note": "Payment issue is being investigated."
}
```

---

## Data Model

### Tickets

The `tickets` collection contains:

| Field           | Description                  |
| --------------- | ---------------------------- |
| `ticketId`      | Unique ticket identifier     |
| `customerName`  | Customer name                |
| `customerEmail` | Customer email               |
| `subject`       | Issue title                  |
| `description`   | Issue description            |
| `status`        | Open, In Progress, or Closed |
| `priority`      | Low, Medium, High, or Urgent |
| `createdAt`     | Ticket creation timestamp    |
| `updatedAt`     | Last update timestamp        |

### Notes

The `notes` collection contains:

| Field       | Description             |
| ----------- | ----------------------- |
| `ticketId`  | Associated ticket ID    |
| `noteText`  | Internal note content   |
| `createdAt` | Note creation timestamp |
| `updatedAt` | Note update timestamp   |

---

## Project Structure

```text
datastraw/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/
│   │   │   │   └── route.js
│   │   │   └── tickets/
│   │   │       ├── route.js
│   │   │       └── [ticketId]/
│   │   │           └── route.js
│   │   ├── tickets/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [ticketId]/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── layout/
│   │       ├── AppShell.tsx
│   │       ├── Navbar.tsx
│   │       └── Sidebar.tsx
│   ├── lib/
│   │   └── mongodb.js
│   └── models/
│       ├── Note.js
│       └── Ticket.js
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/usaidgithub/datastraw-support-crm
cd datastraw
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI="your_mongodb_atlas_connection_string"
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

### 5. Create a production build

```bash
npm run build
```

---

## Deployment

The application is deployed using Vercel.

The GitHub repository is connected to Vercel, allowing new commits pushed to the main branch to trigger a new deployment.

The MongoDB connection string is configured as a Vercel environment variable and is not committed to the repository.

---

## Validation

The application was tested for:

* Ticket creation
* Required field validation
* Email validation
* Automatic ticket ID generation
* Ticket listing
* Search
* Status filtering
* Ticket detail retrieval
* Status updates
* Priority updates
* Internal notes
* Combined ticket updates
* Invalid ticket handling
* Responsive UI
* Production deployment
* MongoDB production connectivity

The production application was also verified after deployment.

---

## Notes

Authentication was intentionally omitted as allowed by the assessment requirements.

The implementation focuses on delivering a functional MVP with a clean responsive interface, working REST APIs, persistent MongoDB storage, and a practical support-oriented priority system.
