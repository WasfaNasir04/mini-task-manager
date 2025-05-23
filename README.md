# Mini-Task Manager

A lightweight task management tool for teams to organize, assign, and track tasks using a Kanban-style board. Built with **React.js (Frontend)** and **Django REST Framework (Backend)**.

## Features
- **Task Management**: Create, assign, and track tasks with deadlines and priorities.
- **Kanban Board**: Visualize tasks in columns (To Do, In Progress, Done).
- **Role-Based Access**: Admins can create teams/projects; Members can update tasks.
- **Notifications**: Alerts for task assignments and status changes.
- **Responsive UI**: Built with Material-UI for a clean, modern interface.

---

## Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- pip (Python package manager)
- SQLite (for development)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd mini-task-manager
```

---

### 2. Backend Setup
Navigate to the `backend` directory and follow these steps:

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt  # If you have a requirements file
# Or manually install:
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
```

#### Database Migrations
```bash
python manage.py migrate
```

#### Create Superuser (Admin)
```bash
python manage.py createsuperuser
```
Follow the prompts to create an admin account.

#### Run the Backend Server
```bash
python manage.py runserver
```
The backend will run at `http://localhost:8000`.

---

### 3. Frontend Setup
Navigate to the `frontend` directory:

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Create a `.env` file in `frontend` with the following:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

#### Run the Frontend
```bash
npm start
```
The frontend will open at `http://localhost:3000`.

---

## Project Structure
