import os
import cv2
import json
import base64
import numpy as np
import tempfile
from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from ultralytics import YOLO

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model
model = YOLO("yolov8n.pt")

@app.post("/api/detect/video")
async def detect_video(file: UploadFile = File(...)):
    # Create temporary files for input and output videos
    input_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    output_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
    
    # Save uploaded file
    with open(input_tmp.name, "wb") as f:
        f.write(await file.read())

    # Open video using OpenCV
    cap = cv2.VideoCapture(input_tmp.name)
    if not cap.isOpened():
        return {"error": "Could not open video file"}

    # Get video properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Output video writer. vp80 codec in a .webm container works well in browsers
    fourcc = cv2.VideoWriter_fourcc(*'vp80')
    out = cv2.VideoWriter(output_tmp.name, fourcc, fps, (width, height))

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Run YOLO inference
            results = model(frame, verbose=False)
            
            # Draw results on the frame
            annotated_frame = results[0].plot()
            
            # Write to output video
            out.write(annotated_frame)
    finally:
        cap.release()
        out.release()
        # Clean up input temp file
        if os.path.exists(input_tmp.name):
            os.remove(input_tmp.name)

    # Return the processed video file
    return FileResponse(output_tmp.name, media_type="video/webm", filename="processed_video.webm")


@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive frame as base64 from client
            data = await websocket.receive_text()
            
            # Parse the base64 string
            if data.startswith('data:image/jpeg;base64,'):
                data = data.split(',')[1]
                
            img_bytes = base64.b64decode(data)
            np_arr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if frame is None:
                continue

            # Run YOLO inference
            results = model(frame, conf=0.15, verbose=False)
            
            # Extract bounding boxes
            boxes_data = []
            for box in results[0].boxes:
                # box format: [x1, y1, x2, y2]
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                label = model.names[cls]
                boxes_data.append({
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2,
                    "label": label,
                    "confidence": conf
                })

            await websocket.send_text(json.dumps(boxes_data))
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error in websocket: {e}")
        try:
            await websocket.close()
        except:
            pass
