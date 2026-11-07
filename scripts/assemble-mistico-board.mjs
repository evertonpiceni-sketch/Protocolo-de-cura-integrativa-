import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chunkDirectory = resolve(root, 'scripts/assets/mistico-moderno-board');
const chunkNames = [
  'part-01.b64',
  'part-02.b64',
  'part-03.b64',
  'part-04.b64',
  'part-04b.b64',
  'part-05.b64'
];

const base64 = (await Promise.all(
  chunkNames.map(async (name) => (await readFile(resolve(chunkDirectory, name), 'utf8')).trim())
)).join('');

if (!base64 || base64.length % 4 !== 0) {
  throw new Error('A prancha oficial do Místico Moderno está incompleta ou corrompida.');
}

const image = Buffer.from(base64, 'base64');
const isWebP =
  image.toString('ascii', 0, 4) === 'RIFF' &&
  image.toString('ascii', 8, 12) === 'WEBP' &&
  image.readUInt32LE(4) === image.length - 8;

if (!isWebP) {
  throw new Error('A prancha oficial do Místico Moderno não passou na validação WebP.');
}

const output = resolve(root, 'public/brand/mistico-moderno/prancha-oficial.webp');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, image);
console.log(`Prancha oficial Místico Moderno preparada: ${image.length} bytes.`);
