# AI Face Prompt App

A web application that captures your face and generates AI images based on text prompts, transforming your likeness into various scenes and styles.

## Overview

This app combines webcam capture functionality with OpenAI's powerful image generation capabilities to create personalized AI-generated images featuring your face. Enter creative prompts to see yourself as an astronaut, superhero, historical figure, or anything you can imagine!

## Features

- **Webcam Integration**: Capture your face directly from your browser
- **OpenAI Powered**: Uses GPT-4 Vision and DALL-E 3 for high-quality image generation
- **Custom Prompts**: Transform your image with any descriptive prompt
- **Secure**: Your API key remains in your browser and is never stored
- **Responsive Design**: Works on various devices and screen sizes

## How It Works

1. **Capture**: Take a photo using your device's camera
2. **Analyze**: GPT-4 Vision analyzes your facial features
3. **Generate**: DALL-E 3 creates a new image incorporating your likeness based on your prompt
4. **Enjoy**: View and save your AI-generated images

## Technical Implementation

The application uses a two-step process to generate images:

1. First, your face photo is analyzed using GPT-4 Vision to create a detailed text description of your facial features
2. Then, the facial description is combined with your creative prompt and sent to DALL-E 3 to generate the final image

This approach ensures that your facial features are preserved while incorporating them into the generated scene.

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari)
- Webcam access
- OpenAI API key with access to GPT-4 Vision and DALL-E 3

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JonathanDinh128/Just_play_around.git
   cd ai-face-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser

## Usage

1. Click "Start Camera" to activate your webcam
2. Take a photo of your face
3. Enter your OpenAI API key
4. Enter a creative prompt (e.g., "as an astronaut on Mars" or "in a cyberpunk city")
5. Click "Generate" to create your AI image
6. Save the resulting image or reset to try a different prompt

## Privacy Considerations

- Your photos and API key never leave your browser except to communicate directly with OpenAI
- No image data is stored on any server
- Your API key is used only for the current session and is not saved

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for their powerful image generation APIs
- React.js for the frontend framework

---

Created by Jonathan Dinh - [GitHub Profile](https://github.com/JonathanDinh128)