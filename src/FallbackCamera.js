import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image, RefreshCw } from 'lucide-react';

const FallbackCamera = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      setError(null);
      console.log("Starting camera...");
      
      const constraints = { 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera access granted");
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = "block";
        streamRef.current = stream;
        setIsCapturing(true);
        console.log("Video stream set");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access failed. Please check permissions.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCapturing(false);
    }
  };

  // Capture image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataURL = canvas.toDataURL('image/png');
      setCapturedImage(imageDataURL);
      
      stopCamera();
    }
  };

  // Reset everything
  const reset = () => {
    stopCamera();
    setCapturedImage(null);
  };

  // Clean up
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Simple Camera Test</h2>
      
      <div style={{ 
        border: "1px solid #ddd", 
        borderRadius: "8px", 
        overflow: "hidden",
        marginBottom: "20px",
        position: "relative",
        backgroundColor: "#f0f0f0",
        aspectRatio: "4/3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {!capturedImage ? (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                display: isCapturing ? "block" : "none" 
              }}
            />
            
            {!isCapturing && (
              <div style={{ textAlign: "center" }}>
                <Camera size={40} style={{ marginBottom: "10px" }} />
                <p>Camera feed will appear here</p>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            )}
          </>
        ) : (
          <img 
            src={capturedImage} 
            alt="Captured" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        )}
        
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {!capturedImage && !isCapturing && (
          <button 
            onClick={startCamera}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Camera size={18} />
            Start Camera
          </button>
        )}
        
        {isCapturing && (
          <button 
            onClick={captureImage}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Image size={18} />
            Take Photo
          </button>
        )}
        
        {capturedImage && (
          <button 
            onClick={reset}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <RefreshCw size={18} />
            Reset
          </button>
        )}
      </div>
      
      {isCapturing && (
        <div style={{ marginTop: "20px", textAlign: "center", color: "#4b5563" }}>
          <p><strong>Camera is active!</strong> Click "Take Photo" to capture.</p>
        </div>
      )}
    </div>
  );
};

export default FallbackCamera;