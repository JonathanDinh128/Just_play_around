import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image, Send, Loader, RefreshCw } from 'lucide-react';
import { getPlaceholderImage } from './utils';
import './AIFacePromptApp.css';

const AIFacePromptApp = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      console.log("Requesting camera access...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      console.log("Camera access granted");
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        console.log("Video element updated with stream");
      } else {
        console.error("Video ref is not available");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please ensure camera permissions are enabled.");
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

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataURL = canvas.toDataURL('image/png');
      setCapturedImage(imageDataURL);
      
      // Stop camera after capture
      stopCamera();
    }
  };

  // Generate AI image based on prompt and captured face
  const generateImage = () => {
    if (!capturedImage || !prompt.trim()) return;
    
    setIsGenerating(true);
    
    // This is a simulation - in a real app, you would make an API call to an AI image generation service
    setTimeout(() => {
      // For demo purposes, we're using a placeholder image
      // In a real implementation, this would be the result from the AI service
      setGeneratedImage(getPlaceholderImage(400, 400));
      setIsGenerating(false);
    }, 2000);
  };

  // Reset the app state
  const resetApp = () => {
    stopCamera();
    setCapturedImage(null);
    setGeneratedImage(null);
    setPrompt('');
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="app-container">
      <div className="app-card">
        <h1 className="app-title">AI Face Prompt App</h1>
        
        {/* Camera View / Captured Image */}
        <div className="media-container">
          {!capturedImage && !generatedImage ? (
            <>
              {isCapturing ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="video-display"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="camera-status">Camera active</div>
                </>
              ) : (
                <div className="placeholder-container">
                  <Camera size={48} className="camera-icon" />
                  <p>Camera feed will appear here</p>
                  {cameraError && <p className="error-message">{cameraError}</p>}
                </div>
              )}
            </>
          ) : generatedImage ? (
            <img 
              src={generatedImage} 
              alt="AI Generated" 
              className="image-display" 
            />
          ) : (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="image-display" 
            />
          )}
          
          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden-canvas" />
        </div>
        
        {/* Prompt Input */}
        {capturedImage && !generatedImage && (
          <div className="prompt-container">
            <label className="prompt-label">
              Enter your prompt:
            </label>
            <div className="input-group">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., astronaut in space, viking warrior, etc."
                className="prompt-input"
              />
              <button
                onClick={generateImage}
                disabled={!prompt.trim() || isGenerating}
                className={`generate-button ${isGenerating ? 'disabled' : ''}`}
              >
                {isGenerating ? <Loader className="spinner" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="button-container">
          {!capturedImage && (
            <>
              {!isCapturing ? (
                <button
                  onClick={startCamera}
                  className="start-button"
                >
                  <Camera size={20} className="button-icon" />
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={captureImage}
                  className="capture-button"
                >
                  <Image size={20} className="button-icon" />
                  Take Photo
                </button>
              )}
            </>
          )}
          
          {(capturedImage || generatedImage) && (
            <button
              onClick={resetApp}
              className="reset-button"
            >
              <RefreshCw size={20} className="button-icon" />
              Reset
            </button>
          )}
        </div>
        
        {/* Instructions */}
        <div className="instructions">
          {!capturedImage ? (
            <p>Click "Start Camera" to begin. Once your face is visible, click "Take Photo".</p>
          ) : !generatedImage ? (
            <p>Enter a prompt describing the scene or style you want, then click the send button.</p>
          ) : (
            <p>Your AI-generated image is ready! Click "Reset" to start over.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFacePromptApp;