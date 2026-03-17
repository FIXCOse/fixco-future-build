const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'heic'];

export function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split('.').pop()?.toLowerCase() || '';
    return ext;
  } catch {
    const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
    return ext;
  }
}

export function isImageUrl(url: string): boolean {
  return IMAGE_EXTENSIONS.includes(getFileExtension(url));
}

export function getFileName(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const name = decodeURIComponent(pathname.split('/').pop() || 'fil');
    // Remove UUID prefix if present (e.g. "a1b2c3d4-..._document.pdf" → "document.pdf")
    return name.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-.*?_/, '');
  } catch {
    return 'fil';
  }
}

export function getFileLabel(url: string): string {
  const ext = getFileExtension(url).toUpperCase();
  return ext || 'FIL';
}
