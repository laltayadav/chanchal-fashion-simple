import fs from 'fs';
import path from 'path';

const imageDir = path.join(process.cwd(), 'data', 'images');

export function ensureImageDir() {
  fs.mkdirSync(imageDir, { recursive: true });
}

export function deleteProductImage(fileName?: string) {
  if (!fileName) return;
  const targetPath = path.join(imageDir, fileName);
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }
}
