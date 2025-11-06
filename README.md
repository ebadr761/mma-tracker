# MMA Athletic Disciplines Manager

A modern, full-stack web application for tracking Mixed Martial Arts training sessions across multiple disciplines. Built with React, Flask, and MongoDB Atlas, featuring secure authentication, real-time data visualization, and a sleek UI.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login with bcrypt password hashing and session-based authentication
- **Workout Logging**: Track training sessions with discipline, duration, intensity (1-10 scale), notes, and date
- **CRUD Operations**: Create, read, update, and delete workout records
- **Personal Dashboard**: User-specific workout data and statistics

### Analytics & Visualization
- **Real-time Statistics**: Total training hours, session count, average intensity, and active disciplines
- **Interactive Charts**:
  - Bar chart showing hours per discipline
  - Line chart displaying 7-day activity trends
  - Pie chart for discipline distribution
- **Powered by Recharts**: Beautiful, responsive data visualizations

### User Experience
- **Modern UI**: Sleek dark theme built with TailwindCSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Smooth transitions and feedback during API calls
- **Error Handling**: Clear error messages and user feedback
- **Smooth Animations**: Hover effects and transitions for polished UX

## Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful icon library

### Backend
- **Flask 3.0** - Lightweight Python web framework
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **PyMongo** - MongoDB driver for Python
- **bcrypt** - Secure password hashing
- **Flask-CORS** - Cross-Origin Resource Sharing support
- **python-dotenv** - Environment variable management

## Project Structure

```
mma-tracker/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration management
│   ├── database.py         # MongoDB connection handler
│   ├── models.py           # User and Workout data models
│   ├── auth.py             # Authentication routes
│   ├── workouts.py         # Workout CRUD routes
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment variables (create this)
│   └── .env.example        # Environment variables template
│
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx   # Main dashboard component
│   │   ├── Login.jsx       # Login form component
│   │   └── Register.jsx    # Registration form component
│   ├── contexts/
│   │   └── AuthContext.jsx # Authentication context provider
│   ├── services/
│   │   └── api.js          # Axios API service layer
│   ├── App.jsx             # Root application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
│
└── package.json            # Node.js dependencies
```

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **MongoDB Atlas Account** (free tier available)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mma-tracker.git
cd mma-tracker
```

### 2. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free M0 tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string (looks like `mongodb+srv://...`)

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your MongoDB URI and secret key
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mma_tracker?retryWrites=true&w=majority
# SECRET_KEY=your-secure-random-secret-key
```

Generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Frontend Setup

```bash
# From project root
npm install
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

### 6. Create Your Account

1. Navigate to `http://localhost:5173`
2. Click "Sign up" to create a new account
3. Fill in your username, email, and password
4. Start logging workouts!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check` - Check authentication status

### Workouts
- `GET /api/workouts` - Get all workouts for authenticated user
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats` - Get workout statistics

## Security Features

- **Password Hashing**: bcrypt with salt for secure password storage
- **Session Management**: HTTP-only cookies with secure flags
- **CORS Protection**: Configured origins for cross-origin requests
- **Input Validation**: Server-side validation for all user inputs
- **Authentication Required**: Protected routes require valid session
- **User Isolation**: Users can only access their own workout data

## Disciplines Supported

- Boxing
- Wrestling
- Brazilian Jiu-Jitsu (BJJ)
- Muay Thai
- Strength & Conditioning
- Cardio
- Mobility
- Sprints
- Squats
- Bench Press

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
python app.py
```

### Frontend Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Deployment

### Backend Deployment (Render, Railway, or Heroku)
1. Set environment variables in your hosting platform
2. Deploy from Git repository
3. Ensure MongoDB Atlas IP whitelist includes hosting provider

### Frontend Deployment (Vercel, Netlify, or Cloudflare Pages)
1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Update `src/services/api.js` with production backend URL

## Future Enhancements

- [ ] Exercise library with video demonstrations
- [ ] Goal setting and progress tracking
- [ ] Social features (follow friends, share workouts)
- [ ] Export workout data as CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Calendar view for workout scheduling
- [ ] Workout templates and programs
- [ ] Integration with fitness wearables
- [ ] Nutrition tracking
- [ ] Coach/trainer mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/mma-tracker](https://github.com/yourusername/mma-tracker)

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI inspiration from modern fitness applications
- Built as a portfolio project demonstrating full-stack development skills

---

**Made with passion for martial arts and clean code**
