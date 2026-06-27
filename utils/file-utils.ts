import fs from 'fs';
import path from 'path';

export function ensureDirectoryExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

export function resolveFromRoot(...paths: string[]): string {
  return path.resolve(process.cwd(), ...paths);
}
