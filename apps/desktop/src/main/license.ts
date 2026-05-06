import fs from 'fs';
import path from 'path';
import { app } from 'electron';

interface LicenseData {
  key: string;
  activatedAt: string;
  email?: string;
}

function getLicensePath(): string {
  return path.join(app.getPath('userData'), 'license.json');
}

function validateKeyFormat(key: string): boolean {
  const trimmed = key.trim().toUpperCase();
  return (trimmed.startsWith('NW-') || trimmed.startsWith('NVWR-')) && trimmed.length >= 16;
}

export function verifyLicense(key: string): { valid: boolean; message: string } {
  try {
    if (!validateKeyFormat(key)) {
      return { valid: false, message: 'License key format is invalid' };
    }
    return { valid: true, message: 'License verified' };
  } catch {
    return { valid: false, message: 'Verification failed' };
  }
}

export function saveLicense(key: string, email?: string): void {
  const data: LicenseData = {
    key: key.trim(),
    activatedAt: new Date().toISOString(),
    email,
  };
  fs.writeFileSync(getLicensePath(), JSON.stringify(data, null, 2));
}

export function loadLicense(): LicenseData | null {
  try {
    if (fs.existsSync(getLicensePath())) {
      return JSON.parse(fs.readFileSync(getLicensePath(), 'utf-8'));
    }
  } catch { /* ignore */ }
  return null;
}

export function isActivated(): boolean {
  const license = loadLicense();
  if (!license) return false;
  return verifyLicense(license.key).valid;
}

export function clearLicense(): void {
  try {
    if (fs.existsSync(getLicensePath())) {
      fs.unlinkSync(getLicensePath());
    }
  } catch { /* ignore */ }
}
