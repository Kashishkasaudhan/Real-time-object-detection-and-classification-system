import { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff } from 'lucide-react';

export default function LiveCamera() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const wsRef = useRef(null);
  const requestRef = useRef(null);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket('wss://real-time-object-detection-and-ve9l.onrender.com/ws/live');
    
    wsRef.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsStreaming(true);
      sendFrame();
    };

    wsRef.current.onmessage = (event) => {
      const boxes = JSON.parse(event.data);
      drawBoxes(boxes);
      // Once we process the response, schedule the next frame capture
      if (isStreaming) {
        requestRef.current = requestAnimationFrame(sendFrame);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsStreaming(false);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsStreaming(false);
    };
  }, [isStreaming]);

  // Capture frame and send to backend
  const sendFrame = useCallback(() => {
    if (!isStreaming || !webcamRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // Lowering quality slightly improves base64 conversion speed (reduces UI lag)
    const imageSrc = webcamRef.current.getScreenshot({width: 640, height: 480});
    if (imageSrc) {
      wsRef.current.send(imageSrc);
    } else {
      // If no screenshot available yet, retry shortly
      requestRef.current = requestAnimationFrame(sendFrame);
    }
  }, [isStreaming]);

  // Draw bounding boxes on canvas
  const drawBoxes = (boxes) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;
    
    if (!canvas || !video) return;

    // Match canvas size to actual video source dimensions (NOT css dimensions)
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxes.forEach(box => {
      const { x1, y1, x2, y2, label, confidence } = box;
      
      // Draw border
      ctx.strokeStyle = '#3b82f6'; // Blue-500
      ctx.lineWidth = 4;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      // Draw background for text
      ctx.fillStyle = '#3b82f6';
      const text = `${label} ${(confidence * 100).toFixed(0)}%`;
      ctx.font = 'bold 18px Inter, sans-serif';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(x1, y1 - 30, textWidth + 10, 30);

      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, x1 + 5, y1 - 8);
    });
  };

  const toggleStream = () => {
    if (isStreaming) {
      setIsStreaming(false);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    } else {
      connectWebSocket();
    }
  };

  useEffect(() => {
    return () => {
      setIsStreaming(false);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isStreaming && wsRef.current?.readyState === WebSocket.OPEN) {
      sendFrame();
    }
  }, [isStreaming, sendFrame]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 
        Tightly wrap the video and canvas so they have EXACTLY the same CSS dimensions. 
        This is critical for the bounding boxes to align correctly over the video feed!
      */}
      <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '720px', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.8}
          videoConstraints={{ facingMode: "user", width: 640, height: 480 }}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        />
      </div>

      <button 
        className={isStreaming ? "btn-secondary" : "btn-primary"} 
        onClick={toggleStream}
        style={{ borderColor: isStreaming ? '#ef4444' : '', color: isStreaming ? '#ef4444' : '' }}
      >
        {isStreaming ? (
          <>
            <CameraOff size={20} />
            STOP DETECTING
          </>
        ) : (
          <>
            <Camera size={20} />
            START DETECTING
          </>
        )}
      </button>
    </div>
  );
}
