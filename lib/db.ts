import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export type ShopConfig = {
  shopName: string;
  whatsappNumber: string;
  adminPassword: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image?: string;
};

export type Order = {
  id: string;
  customerName: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
  status: string;
};

function ensureDataFile(fileName: string, defaultContent: string) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(filePath, defaultContent, 'utf8');
  }
}

ensureDataFile('products.json', '[]\n');
ensureDataFile('orders.json', '[]\n');
ensureDataFile('config.json', JSON.stringify({ shopName: 'Chanchal Fashion', whatsappNumber: '', adminPassword: 'changeme' }, null, 2) + '\n');

export function readJsonFile<T>(fileName: string): T {
  const filePath = path.join(dataDir, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

export function writeJsonFile<T>(fileName: string, data: T) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
