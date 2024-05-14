/**
 * Removes query and hash from a URL string
 * @param {string} url URL to be cleaned
 */
export const cleanUrl = (url: string): string => {
  return url.replace(/[?#].*$/u, '');
};
