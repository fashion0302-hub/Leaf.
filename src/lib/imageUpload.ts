export async function processUploadedImage(
  file: File,
  maxWidth = 1400,
  quality = 0.84
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일(JPG, PNG, WebP)만 업로드할 수 있습니다.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const targetW = Math.round(img.width * scale);
        const targetH = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Preserve PNG transparency only when source is PNG and reasonably small; otherwise JPEG keeps localStorage light
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
