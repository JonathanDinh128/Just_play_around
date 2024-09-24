import React, { useRef, useState } from 'react';
import { generateImageWithOpenAI } from './OpenAIService';

function BasicCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  const resultImageRef = useRef(null);
  
  const [prompt, setPrompt] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  // Start camera with basic settings
  const startCamera = async () => {
    try {
      setErrorMessage('');
      document.getElementById('status').textContent = 'Requesting camera...';
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      document.getElementById('status').textContent = 'Camera active - ready to take photo';
      
      // Connect the camera to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video is visible
        videoRef.current.style.display = 'inline-block';
      } else {
        console.error("Video element reference not available");
      }
    } catch (err) {
      document.getElementById('status').textContent = 'Camera error: ' + err.message;
      console.error('Camera error:', err);
      setErrorMessage(`Camera error: ${err.message}`);
    }
  };

  // Take a photo
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const photo = photoRef.current;
    
    if (!video || !canvas || !photo) {
      setErrorMessage('Camera components not initialized properly');
      return;
    }
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image
    const imageUrl = canvas.toDataURL('image/png');
    photo.src = imageUrl;
    photo.style.display = 'block';
    
    // Get base64 data for API (remove data:image/png;base64, prefix)
    const base64Data = imageUrl.split(',')[1];
    setImageBase64(base64Data);
    
    // Update state
    setPhotoTaken(true);
    document.getElementById('status').textContent = 'Photo captured! Enter a prompt and generate an image.';
    
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  // Generate AI image based on prompt and photo
  const generateImage = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter a prompt first!');
      return;
    }
    
    if (!apiKey.trim()) {
      setErrorMessage('Please enter your OpenAI API key');
      return;
    }
    
    setErrorMessage('');
    setGenerating(true);
    document.getElementById('status').textContent = 'Generating image based on your face and prompt...';
    
    try {
      // Call the OpenAI API
      const generatedImageUrl = await generateImageWithOpenAI(
        imageBase64,
        prompt,
        apiKey
      );
      
      // Display the generated image
      resultImageRef.current.src = generatedImageUrl;
      resultImageRef.current.style.display = 'block';
      
      setGenerating(false);
      setGenerated(true);
      document.getElementById('status').textContent = 'Image generated! Prompt: "' + prompt + '"';
    } catch (error) {
      console.error('Failed to generate image:', error);
      setErrorMessage(`Generation failed: ${error.message}`);
      setGenerating(false);
      document.getElementById('status').textContent = 'Image generation failed. Please try again.';
    }
  };

  // Reset everything
  const resetApp = () => {
    setPhotoTaken(false);
    setGenerated(false);
    setPrompt('');
    setErrorMessage('');
    
    // Hide images
    if (photoRef.current) photoRef.current.style.display = 'none';
    if (resultImageRef.current) resultImageRef.current.style.display = 'none';
    
    document.getElementById('status').textContent = 'Click "Start Camera" to begin';
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>AI Face Prompt App</h2>
      
      {/* Status display */}
      <div id="status" style={{ margin: '10px 0', fontWeight: 'bold' }}>
        Click "Start Camera" to begin
      </div>
      
      {/* Error message display */}
      {errorMessage && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#e74c3c', 
          padding: '10px', 
          borderRadius: '5px',
          margin: '10px 0'
        }}>
          {errorMessage}
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Camera/Photo column */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Your Face</h3>
            {/* Video display (hidden when photo is taken) */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              style={{
                width: '100%',
                maxWidth: '320px',
                height: 'auto',
                minHeight: '240px',
                border: '3px solid #3498db',
                borderRadius: '8px',
                display: photoTaken ? 'none' : 'inline-block',
                backgroundColor: '#000' // Dark background to make the video feed more visible
              }}
            ></video>
            
            {/* Camera indicator */}
            {!photoTaken && videoRef.current && videoRef.current.srcObject && (
              <div style={{
                marginTop: '5px',
                padding: '5px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                Camera is active
              </div>
            )}
            
            {/* Captured photo display */}
            <img 
              ref={photoRef}
              alt="Captured" 
              style={{ 
                display: 'none',
                width: '100%',
                maxWidth: '320px',
                border: '3px solid #2ecc71',
                borderRadius: '8px'
              }}
            />
          </div>
          
          {/* Generated image column (only shown after generation) */}
          {photoTaken && (
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h3>Generated Result</h3>
              <img 
                ref={resultImageRef}
                alt="AI Generated" 
                style={{ 
                  display: 'none',
                  width: '100%',
                  maxWidth: '320px',
                  border: '3px solid #e74c3c',
                  borderRadius: '8px'
                }}
              />
              {!generated && !generating && (
                <div style={{
                  width: '100%',
                  maxWidth: '320px',
                  height: '240px',
                  border: '3px solid #95a5a6',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ecf0f1'
                }}>
                  Enter prompt and click generate
                </div>
              )}
              {generating && (
                <div style={{
                  width: '100%',
                  maxWidth: '320px',
                  height: '240px',
                  border: '3px solid #f39c12',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ecf0f1'
                }}>
                  <div>
                    <div style={{ 
                      border: '4px solid #3498db',
                      borderBottomColor: 'transparent',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 10px'
                    }}></div>
                    Generating...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Hidden canvas used for image capture */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
        ></canvas>
        
        {/* OpenAI API Key input */}
        {photoTaken && !generated && (
          <div style={{ margin: '20px auto', maxWidth: '500px' }}>
            <label htmlFor="apiKey" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Enter your OpenAI API Key:
            </label>
            <input 
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #3498db',
                borderRadius: '5px',
                fontSize: '16px',
                marginBottom: '15px'
              }}
            />
          </div>
        )}
        
        {/* Prompt input (shown after photo is taken) */}
        {photoTaken && !generated && (
          <div style={{ margin: '20px auto', maxWidth: '500px' }}>
            <label htmlFor="prompt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Enter your prompt:
            </label>
            <div style={{ display: 'flex' }}>
              <input 
                id="prompt"
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., astronaut in space, viking warrior, etc."
                style={{
                  flex: '1',
                  padding: '10px',
                  border: '2px solid #3498db',
                  borderRadius: '5px 0 0 5px',
                  fontSize: '16px'
                }}
              />
              <button 
                onClick={generateImage}
                disabled={generating || !prompt.trim() || !apiKey.trim()}
                style={{
                  padding: '10px 15px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0 5px 5px 0',
                  cursor: generating || !prompt.trim() || !apiKey.trim() ? 'not-allowed' : 'pointer',
                  opacity: generating || !prompt.trim() || !apiKey.trim() ? 0.7 : 1
                }}
              >
                Generate
              </button>
            </div>
          </div>
        )}
        
        {/* Control buttons */}
        <div>
          {!photoTaken && (
            <button 
              onClick={startCamera}
              style={{
                padding: '10px 20px',
                margin: '0 10px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Start Camera
            </button>
          )}
          
          {!photoTaken && (
            <button 
              onClick={takePhoto}
              style={{
                padding: '10px 20px',
                margin: '0 10px',
                background: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Take Photo
            </button>
          )}
          
          <button 
            onClick={resetApp}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h3>How it works:</h3>
        <ol style={{ textAlign: 'left' }}>
          <li>Click "Start Camera" to begin</li>
          <li>Take a photo of your face</li>
          <li>Enter your OpenAI API key</li>
          <li>Enter a text prompt describing the scene or style</li>
          <li>Click "Generate" to create an AI image incorporating your face</li>
        </ol>
        <p style={{ fontStyle: 'italic', color: '#7f8c8d' }}>
          Note: Your API key is only used in your browser and is never stored on any server.
        </p>
      </div>
      
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default BasicCamera;