# Ticket Management System

A full-stack ticket management system built with Flask (Python) backend and React frontend.

## Features

### User Features
- User registration and authentication
- Create, view, update, and delete tickets
- Track ticket status (Open, In Progress, Closed, Reopened)
- Responsive design for mobile and desktop

### Admin Features
- View all tickets from all users
- Update ticket status
- View detailed activity logs for each ticket
- Admin-only access control

## Tech Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **Flask-Bcrypt** - Password hashing
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Database

### Frontend
- **React** - JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and development server

## Project Structure

```
Tickets/
├── main/                    # Flask backend
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── auth.py             # Authentication routes
│   ├── tickets.py          # Ticket management routes
│   ├── admin.py            # Admin routes
│   └── instance/           # Database files (auto-generated)
├── ticket-system/          # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── package.json
├── requirements.txt        # Python dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Tickets
   ```

2. **Set up Python virtual environment:**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows (PowerShell):
   venv\Scripts\Activate.ps1
   # On Windows (Command Prompt):
   venv\Scripts\activate.bat
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up frontend:**
   ```bash
   cd ticket-system
   npm install
   ```

### Running the Application

1. **Start the Flask backend:**
   ```bash
   # Make sure virtual environment is activated
   cd main
   python app.py
   ```
   The backend will be available at `http://localhost:5000`

2. **Start the React frontend (in a new terminal):**
   ```bash
   cd ticket-system
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Git Setup

### First Time Setup
```bash
# Initialize Git repository (if not already done)
git init

# Add all files (except those in .gitignore)
git add .

# Make initial commit
git commit -m "Initial commit: Ticket Management System"

# Add remote repository
git remote add origin <your-repo-url>

# Push to repository
git push -u origin main
```

### Regular Development Workflow
```bash
# Make changes to your code

# Check what files have changed
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to repository
git push
```

## Usage

### Getting Started

1. Open your browser and go to `http://localhost:5173`
2. Register a new account (you can choose to register as admin)
3. Login with your credentials
4. Start creating and managing tickets!

### User Workflow

1. **Login/Register**: Create an account or login with existing credentials
2. **Dashboard**: View all your tickets and their current status
3. **Create Ticket**: Click "Create New Ticket" to submit a new issue or request
4. **Manage Tickets**: Update status, edit details, or delete tickets as needed

### Admin Workflow

1. **Login**: Login with admin credentials
2. **Admin Panel**: View all tickets from all users
3. **Manage Tickets**: Update ticket status and view activity logs
4. **View Logs**: Click "View Logs" to see detailed activity history for any ticket

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Tickets (User)
- `GET /tickets` - Get user's tickets
- `POST /tickets` - Create new ticket
- `PUT /tickets/<id>` - Update ticket
- `DELETE /tickets/<id>` - Delete ticket

### Admin
- `GET /admin/tickets` - Get all tickets
- `PUT /admin/tickets/<id>` - Update ticket (admin)
- `GET /admin/tickets/<id>/logs` - Get ticket logs

## Database Schema

### Users
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `is_admin` - Admin flag

### Tickets
- `id` - Primary key
- `title` - Ticket title
- `description` - Ticket description
- `status` - Current status (Open, In Progress, Closed, Reopened)
- `user_id` - Foreign key to user

### Ticket Logs
- `id` - Primary key
- `ticket_id` - Foreign key to ticket
- `action` - Log message
- `timestamp` - When the action occurred

## Important Notes

- **Virtual Environment**: Always activate the virtual environment before running the backend
- **Database**: The SQLite database will be created automatically in `main/instance/` when you first run the app
- **CORS**: The backend is configured to accept requests from `http://localhost:5173`
- **Sessions**: The app uses Flask sessions for authentication (no JWT tokens)

## Troubleshooting

### Common Issues

1. **ModuleNotFoundError**: Make sure your virtual environment is activated
2. **Port already in use**: Change the port in `app.py` or kill the process using the port
3. **CORS errors**: Check that the frontend URL matches the CORS configuration in `app.py`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 