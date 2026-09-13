export const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,30}$/;
export const INDIAN_PHONE_PATTERN = /^[6-9]\d{9}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isStrongPassword(password: string): boolean {
  return password.length >= 8
    && /[A-Za-z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z\d]/.test(password);
}

export function isValidDateOfBirth(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date <= new Date();
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function serializePublicUser(user: {
  id: string;
  mobileNumber: string;
  name: string | null;
  fullName: string | null;
  dateOfBirth: Date | null;
  email: string | null;
  username: string | null;
  avatar: string | null;
  storageUsed: bigint;
  storageLimit: bigint;
}) {
  return {
    id: user.id,
    mobileNumber: user.mobileNumber,
    name: user.name || user.fullName || "User",
    fullName: user.fullName,
    dateOfBirth: user.dateOfBirth?.toISOString().slice(0, 10) ?? null,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    storageUsed: Number(user.storageUsed),
    storageLimit: Number(user.storageLimit),
  };
}