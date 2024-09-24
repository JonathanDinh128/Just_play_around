/**
 * Generate a placeholder image for local development
 * This replaces the /api/placeholder/{width}/{height} URL that would be used in production
 */
export const getPlaceholderImage = (width, height) => {
    return `https://via.placeholder.com/${width}x${height}`;
  };