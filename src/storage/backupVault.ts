import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import nacl from 'tweetnacl';

const SECURE_KEY_NAME = 'wisdom.backup_secretbox_key_v1';
const ASYNC_BLOB_KEY = 'wisdom.encrypted_backup_blob_v1';

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

async function getOrCreateSecretBoxKey(): Promise<Uint8Array> {
  const existing = await SecureStore.getItemAsync(SECURE_KEY_NAME);
  if (existing != null && existing.length > 0) {
    return base64ToBytes(existing);
  }
  const raw = await Crypto.getRandomBytesAsync(32);
  const key = new Uint8Array(raw);
  await SecureStore.setItemAsync(SECURE_KEY_NAME, bytesToBase64(key), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return key;
}

/**
 * Persist backup bytes encrypted at rest (F9.T9.S2). Key in SecureStore; ciphertext in AsyncStorage (NaCl secretbox).
 */
export async function saveEncryptedBackup(payload: ArrayBuffer): Promise<void> {
  const key = await getOrCreateSecretBoxKey();
  const plain = new Uint8Array(payload);
  const nonceRaw = await Crypto.getRandomBytesAsync(24);
  const nonce = new Uint8Array(nonceRaw);
  const boxed = nacl.secretbox(plain, nonce, key);
  const combined = new Uint8Array(24 + boxed.length);
  combined.set(nonce, 0);
  combined.set(boxed, 24);
  await AsyncStorage.setItem(ASYNC_BLOB_KEY, bytesToBase64(combined));
}

export async function loadEncryptedBackup(): Promise<ArrayBuffer | null> {
  const b64 = await AsyncStorage.getItem(ASYNC_BLOB_KEY);
  if (b64 == null || b64 === '') {
    return null;
  }
  const keyB64 = await SecureStore.getItemAsync(SECURE_KEY_NAME);
  if (keyB64 == null || keyB64 === '') {
    return null;
  }
  const combined = base64ToBytes(b64);
  if (combined.length < 24 + 16) {
    throw new Error('Stored backup data is too short or corrupted.');
  }
  const nonce = combined.subarray(0, 24);
  const boxed = combined.subarray(24);
  const key = base64ToBytes(keyB64);
  const opened = nacl.secretbox.open(boxed, nonce, key);
  if (opened == null) {
    throw new Error('Stored backup could not be decrypted.');
  }
  const copy = new ArrayBuffer(opened.byteLength);
  new Uint8Array(copy).set(opened);
  return copy;
}

export async function clearEncryptedBackup(): Promise<void> {
  await AsyncStorage.removeItem(ASYNC_BLOB_KEY);
}

export async function hasEncryptedBackup(): Promise<boolean> {
  const v = await AsyncStorage.getItem(ASYNC_BLOB_KEY);
  return v != null && v.length > 0;
}
