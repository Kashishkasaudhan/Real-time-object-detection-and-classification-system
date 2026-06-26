import { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Play, RotateCcw } from 'lucide-react';

export default function UploadVideo() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessedVideoUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Using deployed Render backend
      const response = await axios.post('https://ai-object-detection-systems.onrender.com/api/detect/video', formData, {
        responseType: 'blob' // Important for video file download
      });
      
      const blob = new Blob([response.data], { type: 'video/webm' });
      const url = window.URL.createObjectURL(blob);
      setProcessedVideoUrl(url);
    } catch (error) {
      console.error("Error processing video:", error);
      alert("Failed to process video. Make sure the backend is running.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBrowseAnother = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedVideoUrl(null);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {!selectedFile && (
        <div className="upload-prompt">
          <UploadCloud className="upload-icon" size={64} />
          <h3 style={{ marginBottom: '1.5rem' }}>Upload a video for detection</h3>
          <input
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button className="btn-primary" onClick={() => fileInputRef.current.click()}>
            BROWSE VIDEO
          </button>
        </div>
      )}

      {selectedFile && !processedVideoUrl && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div className="media-container" style={{ marginBottom: '2rem' }}>
            <video src={previewUrl} controls style={{ maxHeight: '500px' }} />
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="loader" style={{ width: 20, height: 20, borderWidth: 3, marginBottom: 0 }}></div>
                PROCESSING...
              </>
            ) : (
              <>
                <Play size={20} />
                PROCESS VIDEO
              </>
            )}
          </button>
        </div>
      )}

      {processedVideoUrl && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div className="media-container" style={{ marginBottom: '2rem', border: '2px solid var(--accent)' }}>
            <video src={processedVideoUrl} controls autoPlay style={{ maxHeight: '500px' }} />
          </div>
          <button className="btn-secondary" onClick={handleBrowseAnother}>
            <RotateCcw size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            BROWSE ANOTHER VIDEO
          </button>
        </div>
      )}
    </div>
  );
}
