export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  ratio: number;
  formattedInfo: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function compressAndValidateImage(
  file: File,
  maxSizeMB: number = 10,
  maxWidthOrHeight: number = 1200,
  quality: number = 0.82
): Promise<CompressionResult> {
  // 1. Validate Max File Size (10 MB)
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(
      `Image size (${formatFileSize(file.size)}) exceeds the maximum allowed limit of ${maxSizeMB} MB. Please choose a smaller photo.`
    );
  }

  const originalSize = file.size;

  // If file is already tiny (< 80 KB) and image/jpeg or image/png, skip canvas resize
  if (file.size < 80 * 1024) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      ratio: 0,
      formattedInfo: `${formatFileSize(originalSize)} (Already Storage Efficient)`,
    };
  }

  // 2. Compress via Canvas API
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = Math.round((height * maxWidthOrHeight) / width);
            width = maxWidthOrHeight;
          } else {
            width = Math.round((width * maxWidthOrHeight) / height);
            height = maxWidthOrHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get 2D canvas context for compression.'));
        }

        // Draw and apply smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob (JPEG with 0.82 quality)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Image compression blob generation failed.'));
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            const compressedSize = compressedFile.size;
            const savedBytes = Math.max(0, originalSize - compressedSize);
            const ratio = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

            const formattedInfo =
              ratio > 0
                ? `${formatFileSize(originalSize)} ➔ ${formatFileSize(compressedSize)} (${ratio}% smaller)`
                : `${formatFileSize(compressedSize)} (Optimal Size)`;

            resolve({
              file: compressedFile,
              originalSize,
              compressedSize,
              ratio,
              formattedInfo,
            });
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(new Error('Failed to load image for compression.'));
    };
    reader.onerror = (err) => reject(new Error('Failed to read image file.'));
  });
}
