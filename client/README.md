# DevOrbit – Developer Hiring Platform

A full-stack MERN application for connecting **developers** and **recruiters**.  
Developers can showcase their profiles, and recruiters can post jobs, manage applications, and hire talent easily.

---

## 🚀 Features

### 👩‍💻 Developer
- Create and manage profile
- Browse and apply to jobs
- Filter jobs by category, location, and skills

### 🧑‍💼 Recruiter
- Post, edit, and delete jobs
- View applicants for each job
- Manage hiring pipeline

### 🌟 Common
- JWT Authentication (Login / Signup)
- Role-based access control
- Responsive UI with Tailwind CSS
- Form validations
- Pagination and filtering
- Date formatting utilities

---

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- React Router DOM
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt

**Other:**
- Axios for API requests
- ESLint + Prettier for code quality

---

## 📦 Folder Structure (Frontend)

src/
├── components/ # Reusable UI components
├── constants/ # App constants (API base URL, roles, etc.)
├── contexts/ # Auth and Job contexts
├── hooks/ # Custom hooks
├── pages/ # Page components (Home, Profile, etc.)
├── routes/ # App routing
├── services/ # API service calls
├── utils/ # Utility functions
├── App.jsx
└── main.jsx


---

## ⚙️ Installation & Setup

### 1️⃣ Clone repository
```bash
git clone https://github.com/yourusername/devorbit.git
cd devorbit

npm install

VITE_API_BASE_URL=http://localhost:5000/api

npm run dev
