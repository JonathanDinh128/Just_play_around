// OpenAI API service for face-based image generation

/**
 * Two-step process:
 * 1. Use GPT-4 Vision to analyze the face image
 * 2. Use DALL-E to generate an image based on the analysis and user prompt
 * 
 * @param {string} imageBase64 - Base64 encoded image data (without the prefix)
 * @param {string} userPrompt - User provided prompt
 * @param {string} apiKey - Your OpenAI API key
 * @returns {Promise<string>} - URL of the generated image
 */
export const generateImageWithOpenAI = async (imageBase64, userPrompt, apiKey) => {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
  
    try {
      // Step 1: Use GPT-4 Vision to analyze the face
      const faceAnalysis = await analyzeFaceWithGPT4Vision(imageBase64, apiKey);
      
      // Step 2: Generate image with DALL-E based on analysis and user prompt
      const generatedImageUrl = await generateImageWithDALLE(faceAnalysis, userPrompt, apiKey);
      
      return generatedImageUrl;
    } catch (error) {
      console.error('OpenAI image generation error:', error);
      throw error;
    }
  };
  
  /**
   * Use GPT-4 Vision to analyze the face in an image
   * 
   * @param {string} imageBase64 - Base64 encoded image data
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<string>} - Detailed face description
   */
  async function analyzeFaceWithGPT4Vision(imageBase64, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a facial analysis assistant that creates detailed descriptions of people's faces for image generation. Focus on physical characteristics: face shape, eye color, hair style/color, skin tone, and distinctive features. Describe objectively without subjective judgments. Format your response as a detailed paragraph that can be used for image generation."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this face and provide a detailed description that could be used to generate images featuring this person. Focus on physical attributes only."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Vision API error: ${errorData.error?.message || response.statusText}`);
    }
  
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  /**
   * Generate an image using DALL-E based on face description and user prompt
   * 
   * @param {string} faceDescription - Description of the face from GPT-4 Vision
   * @param {string} userPrompt - User provided prompt
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<string>} - URL of the generated image
   */
  async function generateImageWithDALLE(faceDescription, userPrompt, apiKey) {
    // System prompt to combine with face description and user prompt
    const systemPrompt = `Create a realistic image of a person with the following facial features: ${faceDescription}. 
    The person should be shown ${userPrompt}.
    Maintain facial details accurately while transforming the scene according to the prompt.
    The face should be clearly visible and recognizable based on the description. The image should be a combinenation between the user facial features then their requested prompt.`;
  
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: systemPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        response_format: "url"
      })
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DALL-E API error: ${errorData.error?.message || response.statusText}`);
    }
  
    const data = await response.json();
    return data.data[0].url;
  }