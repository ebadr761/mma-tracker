# Quick Setup Guide

This guide will get you up and running in 10 minutes! Even if this project isn't deployed to a website yet you can test it out yourself! Just use the free MongoDB cluster option!!!

## 1. Prerequisites Check

Make sure you have:
- [ ] Node.js installed (`node --version`)
- [ ] Python 3.9+ installed (`python --version`)
- [ ] Git installed (`git --version`)

## 2. MongoDB Atlas Setup (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Click "Build a Database" → Choose "FREE" M0 tier
3. Choose a cloud provider and region (default is fine)
4. Click "Create Cluster" (wait 3-5 minutes for provisioning)
5. Set up security:
   - Click "Database Access" → "Add New Database User"
   - Create a user (remember username/password)
   - Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (for development)
6. Get connection string:
   - Click "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `mma_tracker`

## 3. Backend Setup (3 minutes)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Now edit `backend/.env`:
```env
MONGODB_URI=<paste your MongoDB connection string here>
SECRET_KEY=<generate a random key - see below>
```

Generate a secret key:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## 4. Frontend Setup (1 minute)

```bash
# From project root
npm install
```

## 5. Run the Application (1 minute)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 6. Open the App

Go to `http://localhost:5173` in your browser!

1. Click "Sign up"
2. Create an account
3. Start logging workouts!

## Troubleshooting

### Backend won't start
- Check that MongoDB URI is correct in `.env`
- Make sure virtual environment is activated
- Try `pip install -r requirements.txt` again

### Frontend won't connect to backend
- Make sure backend is running on port 5000
- Check browser console for errors
- Try clearing browser cache

### MongoDB connection issues
- Double-check your connection string
- Verify IP whitelist includes your IP
- Make sure you replaced `<password>` with actual password

## Quick Test

After setup, you should be able to:
1. Register a new account
2. Log in with your credentials
3. Add a workout
4. See it appear in the History tab
5. View analytics in the Analytics tab

## Next Steps

- Customize disciplines in `src/components/Dashboard.jsx`
- Add your own features
- Deploy to production (see main README.md)

## Need Help?

Check the main [README.md](README.md) for detailed documentation or open an issue on GitHub.
