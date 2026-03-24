# JobPortal Website

JobPortal is a full-stack web application for job seekers and employers. It allows users to browse, apply for jobs, and manage their profiles, while companies can post jobs and manage applicants. The project is divided into a backend (Node.js/Express/MongoDB) and a frontend (React/Vite/Tailwind CSS).

## Features

### For Job Seekers
- Browse and filter jobs by category
- View detailed job descriptions
- Apply for jobs
- View applied jobs
- Manage user profile
- Authentication (Signup/Login)

### For Employers/Companies
- Register and manage company profile
- Post new jobs
- View and manage applicants for posted jobs
- Admin dashboard for managing jobs and companies

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT
- **File Uploads:** Multer, Cloudinary

## Project Structure

```
jobportal-main/
├── backend/
│   ├── controllers/         # Route controllers for business logic
│   ├── middlewares/         # Express middlewares (auth, file upload)
│   ├── models/              # Mongoose models (User, Job, Company, Application)
│   ├── routes/              # Express route definitions
│   ├── utils/               # Utility functions (Cloudinary, DB connection)
│   ├── index.js             # Entry point for backend server
│   └── package.json         # Backend dependencies and scripts
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (UI, pages, admin, auth)
│   │   ├── hooks/           # Custom React hooks for data fetching
│   │   ├── redux/           # Redux slices and store
│   │   ├── utils/           # Frontend utility functions/constants
│   │   └── ...
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies and scripts
│   └── ...
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/NiGoCodes/jobportal.git
   cd jobportal-main
   ```

2. **Install backend dependencies:**
   ```sh
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```sh
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**
    - Create a `.env` file in the `backend/` directory with the following variables (example values from the project):
       ```env
       PORT=8000
       MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
       SECRET_KEY=your_secret_key
       CLOUD_NAME=your_cloudinary_cloud_name
       API_KEY=your_cloudinary_api_key
       API_SECRET=your_cloudinary_api_secret
       ```
    - Replace the example values with your own credentials. Do not share your real credentials publicly.

5. **Start the backend server:**
   ```sh
   cd backend
   npm start
   ```

6. **Start the frontend development server:**
   ```sh
   cd frontend
   npm run dev
   ```


## Scripts

### Backend (`backend/package.json`)
- `npm start` — Start the Express server
- `npm run dev` — Start server with nodemon (if configured)
- `npm run build` — Install all dependencies and build frontend (if needed)

### Frontend (`frontend/package.json`)
- `npm run dev` — Start Vite development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## Folder Details

### Backend
- **controllers/**: Handles business logic for applications, companies, jobs, and users
- **middlewares/**: Authentication, file upload, and other middleware
- **models/**: Mongoose schemas for all entities
- **routes/**: API endpoints for all resources
- **utils/**: Cloudinary integration, DB connection, data URI helpers

### Frontend
- **components/**: UI components, pages, admin and auth modules
- **hooks/**: Custom hooks for API calls
- **redux/**: State management using Redux Toolkit
- **utils/**: Constants and utility functions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

