# MMA Tracker 🥊

> A modern, full-stack athletic performance tracking system featuring AI-powered training insights, real-time analytics, and injury prevention monitoring for combat sports athletes.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 🎯 Overview

FightMetrics is an intelligent training companion for martial artists (and athletes in general!). Unlike standard loggers, it uses Machine Learning (Scikit-Learn) to analyze your training patterns, identifying overlooked disciplines (Cluster Analysis) and predicting burnout risk (ACWR Regression). 

Use it like a simple workout tracker. You log workouts, add notes for each workout and choose a type of workout based on several disciplines (weightlifting, running, Muay Thai, BJJ, wrestling, etc.)

<img width="1263" height="787" alt="fightmetrics" src="https://github.com/user-attachments/assets/ea30ba0e-401d-4bb7-bf2e-c5076498067e" />
<img width="1530" height="931" alt="fightmetrics dashboard" src="https://github.com/user-attachments/assets/b811744e-ccb7-42fe-a206-3d9efb7d25d6" />


**Key Highlights:**
- 🧠 **AI-Powered Insights**: Get automatic recommendations on where to focus your training.
- � **Burnout Prediction**: Algorithmically monitors Acute vs. Chronic workload to lower injury risk.
- ⚡ **Modern Stack**: Built with Python 3.12, FastAPI, and React 18.
- 📊 **Interactive Analytics**: Visualise progress across 10+ combat disciplines (Boxing, BJJ, Muay Thai, etc.).
- 🚀 **High Performance**: Asynchronous Python backend using Motor driver.

---

## 🛠 Tech Stack

### Backend (Python/ML)
| Technology | Purpose |
|------------|---------|
| **Python 3.12** | Core language for backend and ML |
| **FastAPI** | High-performance async web framework |
| **Scikit-Learn** | Machine Learning algorithms (K-Means, Regression) |
| **Pandas/NumPy** | Data manipulation and analysis |
| **Motor** | Asynchronous MongoDB driver |
| **Pydantic** | Data validation and settings management |
| **JWT** | Secure stateless authentication |

### Frontend (React)
| Technology | Purpose |
|------------|---------|
| **React 18** | Modern UI library |
| **TypeScript** | Type safety and developer experience |
| **Vite** | Lightning-fast build tool |
| **TailwindCSS** | Utility-first styling |
| **Recharts** | Data visualization library |
| **Axios** | HTTP client for API requests |

---

## 🧠 Machine Learning Features

The application uses specific ML techniques to improve athlete performance:

### 1. Weakness Identification (Clustering)
- **Algorithm**: K-Means Clustering & Statistical Distribution
- **Function**: Analyzes your discipline breakdown (Striking vs. Grappling vs. Conditioning).
- **Goal**: Identifies "holes in your game" (e.g., strong striker but neglects wrestling).

### 2. Burnout Risk Prediction (ACWR)
- **Algorithm**: Rolling Average Regression (Acute:Chronic Workload Ratio)
- **Function**: Compares your last 7 days of load (Acute) vs. last 28 days (Chronic).
- **Goal**: Flags when you are training dangerously harder than your body is conditioned for, predicting injury risk.

#### 🧮 How it Works (The Math)
We calculate Load as `Duration (min) × Intensity (1-10)`.
1.  **Acute Load**: Average daily load over the last 7 days.
2.  **Chronic Load**: Average daily load over the last 28 days.
3.  **ACWR**: `Acute Load / Chronic Load`

> **The "Sweet Spot"**: Sports science suggests an ACWR between **0.8 and 1.3** is optimal for progress. A ratio **> 1.5** (the "Danger Zone") significantly increases injury risk because you are doing 50% more work than your body is conditioned for.


### 3. Focus Recommender
- **Algorithm**: Rule-based Classification
- **Function**: Suggests specific disciplines to train next based on recent neglect.

---

## � Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **MongoDB Atlas** account (Free tier is fine)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend-python
    ```
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure Environment:
    Create a `.env` file in `backend-python/` with the following:
    ```env
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mma-tracker
    SECRET_KEY=generate_a_secure_hex_key_here
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```
4.  Run the Server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    *Server runs on: http://localhost:8000*
    *API Docs available at: http://localhost:8000/docs*

### 2. Frontend Setup

1.  Navigate to the project root (or `src`):
    ```bash
    cd src
    # OR if running from root, just verify package.json is there
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
4.  Open your browser to `http://localhost:5173`.

### 🐳 Docker Deployment (Unified)

Deploy the entire full-stack application (Frontend + Backend + Database) with one command.

1.  **Build and Run**:
    ```bash
    docker-compose up --build
    ```
2.  **Access App**:
    - Frontend: http://localhost:8000 (Served via FastAPI static files)
    - API Docs: http://localhost:8000/docs


---

## 📂 Project Structure

```
mma-tracker/
├── backend-python/         # 🐍 Python Backend
│   ├── app/
│   │   ├── ml/             # 🧠 ML Engine (Scikit-Learn)
│   │   │   └── engine.py   # Analysis logic
│   │   ├── models/         # Pydantic Data Models
│   │   ├── routes/         # API Endpoints (Auth, Workouts, ML)
│   │   ├── auth/           # JWT Security Logic
│   │   └── main.py         # App Entry Point
│   ├── requirements.txt    # Python Dependencies
│   └── .env                # Config (ignored by git)
│
├── src/                    # ⚛️ React Frontend
│   ├── components/
│   │   └── Dashboard.tsx   # Main UI with ML Widgets
│   ├── services/
│   │   └── api.ts          # API Client (points to port 8000)
│   └── ...
└── ...
```

## � Contributors

- **Ebad ur Rehman** - Software Engineering Student @ UCalgary

## � License

MIT License. Open source for all martial artists.
