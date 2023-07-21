export async function generateUserProfileImage(username: string): Promise<File | null> {
  // Validate input
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    console.error('Invalid username input.');
    return null;
  }

  // Prepare canvas
  const canvas = document.createElement('canvas');
  canvas.width = 200; // Set canvas width (adjust as needed)
  canvas.height = 200; // Set canvas height (adjust as needed)
  const context = canvas.getContext('2d');

  if (!context) {
    console.error('Canvas context is not available.');
    return null;
  }

  // Generate random background color
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  // Draw background
  context.fillStyle = randomColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text (first letters of the words)
  const words = username.split(' ');
  let initials = '';
  words.forEach((word) => {
    if (word && word.trim().length > 0) {
      initials += word[0].toUpperCase();
    }
  });

  // Adjust font style (you can customize this based on your preference)
  const fontSize = 100;
  context.font = `${fontSize}px Arial`;
  context.fillStyle = '#FFFFFF'; // Font color (white)
  context.textBaseline = 'middle';
  context.textAlign = 'center';

  // Calculate text position to center it on the canvas
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  context.fillText(initials, centerX, centerY);

  // Convert canvas to data URL (base64)
  const dataURL = canvas.toDataURL();

  // Convert data URL to Blob
  const base64Response = await fetch(dataURL);
  const blob = await base64Response.blob();

  // Create a File from the Blob
  const file = new File([blob], 'profile_image.png', { type: 'image/png' });

  return file;
}
