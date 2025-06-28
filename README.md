# 🎫 Ticket Management System

A modern, full-stack ticket management system built with **Flask** (Python) backend and **React** frontend. Perfect for customer support, bug tracking, and project management.

![Ticket System](https://img.shields.io/badge/React-19.1.0-blue)
![Flask](https://img.shields.io/badge/Flask-3.1.0-green)
![Python](https://img.shields.io/badge/Python-3.8+-yellow)

## ✨ Features

### 👤 User Features
- 🔐 **Secure Authentication** - User registration and login with role-based access
- 📝 **Ticket Creation** - Create detailed tickets with title and description
- 📊 **Status Tracking** - Monitor ticket progress (Open, In Progress, Closed, Reopened)
- ✏️ **Ticket Management** - Edit, update status, and delete tickets
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices

### 👨‍💼 Admin Features
- 🌐 **Global View** - See all tickets from all users in one dashboard
- 🔧 **Status Management** - Update any ticket status from admin panel
- 📋 **Activity Logs** - View detailed history of all ticket changes
- 🛡️ **Access Control** - Admin-only features with secure authentication

## 🛠️ Tech Stack

### Backend
- **Flask** - Lightweight Python web framework
- **SQLAlchemy** - Database ORM for data management
- **Flask-Bcrypt** - Secure password hashing
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Lightweight database (can be upgraded to PostgreSQL/MySQL)

### Frontend
- **React 19** - Modern JavaScript library for UI
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server

## 📁 Project Structure

```
Tickets/
├── 📁 main/                    # Flask Backend
│   ├── 🐍 app.py              # Main Flask application
│   ├── 🗄️ models.py           # Database models (User, Ticket, TicketLog)
│   ├── 🔐 auth.py             # Authentication routes (login, register, logout)
│   ├── 🎫 tickets.py          # Ticket management routes (CRUD operations)
│   ├── 👨‍💼 admin.py            # Admin-specific routes
│   └── 📁 instance/           # Database files (auto-generated)
├── 📁 ticket-system/          # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 pages/          # Page components (Login, Register, Dashboard, Admin)
│   │   ├── 📁 components/     # Reusable components (TicketForm, TicketList, etc.)
│   │   ├── 📁 services/       # API services
│   │   └── 🎨 App.jsx         # Main application component
│   └── 📄 package.json
├── 📄 requirements.txt        # Python dependencies
├── 📄 .gitignore             # Git ignore rules
└── 📄 README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ticket-system.git
cd ticket-system
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
venv\Scripts\Activate.ps1
# Windows (Command Prompt):
venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Start Backend Server
```bash
cd main
python app.py
```

✅ **Backend running at:** `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ticket-system
npm install
```

#### Start Development Server
```bash
npm run dev
```

✅ **Frontend running at:** `http://localhost:5173`

## 🎯 Usage Guide

### Getting Started

1. **Open your browser** and navigate to `http://localhost:5173`
2. **Register a new account** - Choose between regular user or admin
3. **Login** with your credentials
4. **Start managing tickets!**

### User Workflow

1. **🔐 Authentication**
   - Register with username, email, and password
   - Login to access your dashboard

2. **📝 Create Tickets**
   - Click "Create New Ticket" button
   - Fill in title and description
   - Submit to create your first ticket

3. **📊 Manage Tickets**
   - View all your tickets in the dashboard
   - Update ticket status as work progresses
   - Edit or delete tickets as needed

### Admin Workflow

1. **👨‍💼 Admin Access**
   - Register with admin privileges or login as admin
   - Access the admin panel automatically

2. **🌐 Global Management**
   - View all tickets from all users
   - Update any ticket status
   - Monitor system activity

3. **📋 Activity Logs**
   - Click "View Logs" on any ticket
   - See detailed history of all changes
   - Track when and what was modified

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register new user |
| `POST` | `/login` | User login |
| `POST` | `/logout` | User logout |

### User Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tickets` | Get user's tickets |
| `POST` | `/tickets` | Create new ticket |
| `PUT` | `/tickets/<id>` | Update ticket |
| `DELETE` | `/tickets/<id>` | Delete ticket |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/tickets` | Get all tickets |
| `PUT` | `/admin/tickets/<id>` | Update ticket (admin) |
| `GET` | `/admin/tickets/<id>/logs` | Get ticket logs |

## 🗄️ Database Schema

### Users Table
```sql
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- is_admin (Boolean)
```

### Tickets Table
```sql
- id (Primary Key)
- title (String)
- description (Text)
- status (Enum: Open, In Progress, Closed, Reopened)
- user_id (Foreign Key to Users)
```

### Ticket Logs Table
```sql
- id (Primary Key)
- ticket_id (Foreign Key to Tickets)
- action (String - Description of change)
- timestamp (DateTime)
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `main/` directory:
```env
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///site.db
FLASK_ENV=development
```

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:5173` (Development)
- `http://127.0.0.1:5173` (Alternative localhost)

## 🐛 Troubleshooting

### Common Issues

#### 1. ModuleNotFoundError
```bash
# Solution: Activate virtual environment
venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate   # macOS/Linux
```

#### 2. Port Already in Use
```bash
# Solution: Change port in app.py
app.run(debug=True, port=5001)
```

#### 3. CORS Errors
```bash
# Solution: Check CORS configuration in app.py
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])
```

#### 4. Database Issues
```bash
# Solution: Delete instance/site.db and restart
# The database will be recreated automatically
```

### PowerShell Issues
If you encounter PowerShell execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create `Procfile` in root:
   ```
   web: cd main && python app.py
   ```
2. Set environment variables in Heroku dashboard
3. Deploy using Heroku CLI or GitHub integration

### Frontend Deployment (Vercel/Netlify)
1. Build the project:
   ```bash
   cd ticket-system
   npm run build
   ```
2. Deploy the `dist/` folder to your hosting service

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Flask** community for the excellent web framework
- **React** team for the amazing frontend library
- **Vite** for the fast development experience

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the troubleshooting section above
2. **Search** existing issues in the repository
3. **Create** a new issue with detailed information

---

**Made with ❤️ by [Your Name]**

*Happy ticket managing! 🎫*
