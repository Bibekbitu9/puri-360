export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator?.clipboard) {
    console.warn('Clipboard not supported');
    return false;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard', error);
    return false;
  }
};
