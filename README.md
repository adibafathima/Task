# Task Management Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing tasks.

## Features

- User authentication (register, login)
- Create, read, update, and delete tasks
- Filter tasks by category and completion status
- Responsive design for all devices
- Print task list functionality

## Tech Stack

### Frontend
- React.js with Hooks
- CSS for styling
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt.js for password encryption

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB account (Atlas or local installation)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/taskapp.git
cd taskapp
```

2. Install dependencies
```
npm run install-all
```

3. Set up environment variables
- Create a `.env` file in the backend directory with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the application
```
npm start
```

## Deployment

The application is deployed on Vercel:
- Frontend: [Task Management App](https://taskapp-frontend.vercel.app)
- Backend: [Task Management API](https://taskapp-backend.vercel.app)

## License

MIT