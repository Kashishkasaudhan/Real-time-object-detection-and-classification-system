<div align="center">
  <h1>🚀 AI Object Detection System</h1>
  <p>A Full-Stack, Real-Time Computer Vision Application powered by YOLOv8, FastAPI, and React.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Python-3.10-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/YOLOv8-FF1493?style=for-the-badge&logo=ultralytics&logoColor=white" alt="YOLOv8" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>
</div>

---

## 🌟 Live Demo

- **Frontend (Vercel)**: [View Live App](https://your-vercel-app-url.vercel.app) *(Replace with your Vercel link)*
- **Backend API (Render)**: [API Health Check](https://ai-object-detection-systems.onrender.com/docs)

> [!WARNING]  
> **Note on Free Hosting**: The backend is deployed on Render's Free Tier (512MB RAM). Because the AI model (YOLOv8 + PyTorch) is highly resource-intensive, the backend may occasionally sleep or encounter out-of-memory errors. For a seamless experience, running the backend locally or upgrading the cloud instance is recommended.

---

## ✨ Features

- **🔴 Live Webcam Detection**: Ultra-fast, real-time object detection directly from your browser using WebSockets.
- **📁 Video File Processing**: Upload any MP4 video, let the AI process it, and instantly download the fully annotated result.
- **⚡ High Performance**: Aggressive confidence thresholds configured to detect even the most camouflaged objects in challenging lighting.
- **🎨 Modern Premium UI**: Glassmorphism design, sleek dark mode, and ultra-responsive React layout.
- **🐳 Docker Ready**: Instantly spin up both the frontend and backend anywhere using a single `docker-compose` command.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**: Lightning-fast development and build tooling.
- **Vanilla CSS**: Custom styling with CSS variables, flexbox layouts, and modern aesthetics.
- **Lucide React**: Beautiful, consistent iconography.
- **Axios & WebSockets**: For RESTful uploads and real-time bi-directional frame streaming.

### Backend
- **FastAPI**: Asynchronous, highly performant Python web framework.
- **Ultralytics YOLOv8**: State-of-the-art model for real-time object detection.
- **OpenCV (cv2)**: Used for frame encoding/decoding and rendering bounding boxes.
- **Uvicorn**: Lightning-fast ASGI server.

---

## 🚀 Installation & Local Setup

### Option 1: The Easy Way (Docker)
Ensure you have Docker and Docker Compose installed.

```bash
# Clone the repository
git clone https://github.com/thepeeyushyadav/AI-OBJECT-DETECTION-SYSTEM.git
cd AI-OBJECT-DETECTION-SYSTEM

# Build and start both containers
docker-compose up --build
```
- **Frontend** will be available at `http://localhost:3000`
- **Backend** will be available at `http://localhost:8000`

---

### Option 2: Manual Setup (For Development)

#### 1. Backend Setup
Open a terminal and navigate to the `backend` directory.

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

#### 2. Frontend Setup
Open a new terminal and navigate to the `frontend` directory.

```bash
cd frontend

# Install node modules
npm install

# Start the Vite development server
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```text
AI-OBJECT-DETECTION-SYSTEM/
│
├── backend/                  # FastAPI Application
│   ├── main.py               # Core API & WebSocket logic
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend container configuration
│
├── frontend/                 # React Application (Vite)
│   ├── src/
│   │   ├── components/       # LiveCamera & UploadVideo components
│   │   ├── App.jsx           # Main routing & layout
│   │   └── App.css           # Premium styling & glassmorphism
│   ├── package.json          # Node dependencies
│   └── Dockerfile            # Frontend container configuration
│
└── docker-compose.yml        # Orchestration for both services
```

---

<div align="center">
  <p>Built with ❤️ by Kashish </p>
</div>
