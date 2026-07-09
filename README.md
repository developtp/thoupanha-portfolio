# Project Title

Thou Panha Portfolio

# Project Overview

A personal portfolio website and admin dashboard for a software engineering student. It includes a public page to show my projects, skills, and background, and a secure admin dashboard to manage the content and view messages from the contact form.

# Main Features

- Public Portfolio: Shows my hero section, bio, skills, projects, and a contact form.
- Admin Dashboard: Secure login with a PIN.
- Content Management: Add, edit, or delete projects, skills, facts, and profile info.
- Messages: View contact messages submitted by visitors.

# Technologies Used

## Frontend
- React (v19)
- React Router DOM
- Vite
- Vanilla CSS

## Backend
- Node.js
- Express
- MongoDB (Mongoose)
- CORS
- dotenv

## Database
- MongoDB Atlas

## Deployment
- AWS Amplify (Frontend)
- AWS Elastic Beanstalk (Backend)
- AWS CloudFront (API Proxy)

# Application Architecture

- Frontend: Single Page Application built with React and Vite. Uses React Router for navigation.
- Backend: Node.js and Express REST API to handle database requests.
- Database: MongoDB Atlas stores projects, skills, facts, profile, social links, and messages.
- Authentication: Token-based authentication using a PIN to protect the admin dashboard.
- API communication: Frontend requests are proxied via Vite in development and AWS CloudFront in production.
- Deployment architecture: Frontend is hosted on AWS Amplify, and the backend is on AWS Elastic Beanstalk.

# Project Structure

```text
backend/
  models/
  server.js
  package.json
frontend/
  src/
  index.html
  vite.config.js
  package.json
```

# Prerequisites

- Node.js
- MongoDB database
- Git

# Installation

## Clone the repository

```bash
git clone <repository-url>
cd thoupanha-portfolio
```

## Install frontend dependencies

```bash
cd frontend
npm install
```

## Install backend dependencies

```bash
cd backend
npm install
```

# Environment Variables

## Frontend

Create `.env.local` in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```
This is the base URL for API requests. You can leave it empty for local development.

## Backend

Create `.env` in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_PIN=123456
ALLOWED_ORIGINS=http://localhost:5173
```
- `PORT`: The port the backend server runs on.
- `MONGO_URI`: Your MongoDB connection string.
- `ADMIN_PIN`: A 6-digit PIN for admin login.
- `ALLOWED_ORIGINS`: Allowed origins for CORS.

# Running the Frontend

```bash
cd frontend
npm run dev
```
Local URL: `http://localhost:5173`

# Running the Backend

```bash
cd backend
npm start
```
Local URL: `http://localhost:5000`

# API Endpoint Summary

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| GET | `/api/skills` | Get all skills |
| POST | `/api/skills` | Create a skill |
| PUT | `/api/skills/:id` | Update a skill |
| DELETE | `/api/skills/:id` | Delete a skill |
| GET | `/api/facts` | Get all facts |
| POST | `/api/facts` | Create a fact |
| PUT | `/api/facts/reorder` | Update fact order |
| PUT | `/api/facts/:id` | Update a fact |
| DELETE | `/api/facts/:id` | Delete a fact |
| POST | `/api/messages` | Submit a message |
| GET | `/api/messages` | View all messages |
| GET | `/api/profile` | Get profile info |
| PUT | `/api/profile` | Update profile info |
| GET | `/api/social` | Get social links |
| PUT | `/api/social` | Update social links |

# Screenshots

[Homepage Screenshot]

[Projects Section Screenshot]

[Admin Dashboard Screenshot]

[Contact Form Screenshot]

# Live Website

<live-website-url>

# GitHub Repository

<github-repository-url>

# Known Limitations

- The admin dashboard uses a shared PIN instead of user accounts with passwords.
- No direct image file upload support; images need to be base64 strings or external links.
- No pagination for lists.

# Future Improvements

- Add proper JWT authentication with hashed passwords.
- Add AWS S3 for image uploads.
- Add pagination for projects and messages.
- Add tests for the frontend and backend.

# Author

Name: <name>
GitHub: <github>
Email: <email>
