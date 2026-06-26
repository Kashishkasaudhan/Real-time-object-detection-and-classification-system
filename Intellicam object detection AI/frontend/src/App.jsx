import { useState } from 'react';
import './App.css';
import UploadVideo from './components/UploadVideo';
import LiveCamera from './components/LiveCamera';

function App() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'upload'

  return (
    <div className="app-container">
      <div className="main-card">
        <header className="header">
          <h1 className="title">AI Object Detection System</h1>
          <p className="subtitle">Detect objects from uploaded videos or live camera streams</p>
        </header>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            LIVE CAMERA DETECTION
          </button>
          <button 
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            UPLOAD VIDEO DETECTION
          </button>
        </div>

        <div className="content-area">
          {activeTab === 'live' ? <LiveCamera /> : <UploadVideo />}
        </div>
      </div>
    </div>
  );
}

export default App;
