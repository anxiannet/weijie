export type PreviewRenderPayload = {
  title: string;
  lines: string[];
  watermark: string;
  accent?: string;
  imageUrl?: string | null;
};

export async function buildPreviewDataUrl(payload: PreviewRenderPayload) {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1200;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const accent = payload.accent || '#10b981';

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#071412');
  gradient.addColorStop(1, '#000000');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (payload.imageUrl) {
    try {
      const image = await loadImage(payload.imageUrl);

      ctx.save();
      ctx.globalAlpha = 0.38;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height * 0.52);
      ctx.restore();

      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.52);
    } catch {
      // ignore image load errors
    }
  }

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.arc(canvas.width * 0.82, canvas.height * 0.18, 240, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 68px sans-serif';
  ctx.textBaseline = 'top';

  wrapText(ctx, payload.title, 70, 90, 760, 86);

  let y = payload.imageUrl ? 540 : 360;

  for (const line of payload.lines) {
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    roundRect(ctx, 70, y, 760, 110, 26, 'rgba(255,255,255,0.08)');

    ctx.font = '500 36px sans-serif';
    ctx.fillText(line, 110, y + 36);

    y += 145;
  }

  ctx.fillStyle = accent;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('PREVIEW', 70, canvas.height - 130);

  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.font = '500 24px sans-serif';
  ctx.fillText(payload.watermark, 70, canvas.height - 90);

  return canvas.toDataURL('image/png', 0.92);
}

async function loadImage(src: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const chars = text.split('');
  let line = '';

  for (let i = 0; i < chars.length; i += 1) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = chars[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string
) {
  ctx.fillStyle = fillStyle;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}
