import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import nacl from 'tweetnacl';
import {
  clearEncryptedBackup,
  hasEncryptedBackup,
  loadEncryptedBackup,
  saveEncryptedBackup,
} from '../backupVault';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}));

const mockGetRandomBytesAsync = jest.fn();
jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: (n: number) => mockGetRandomBytesAsync(n),
}));

describe('backupVault', () => {
  const asyncSet = AsyncStorage.setItem as jest.Mock;
  const asyncGet = AsyncStorage.getItem as jest.Mock;
  const asyncRemove = AsyncStorage.removeItem as jest.Mock;
  const secureGet = SecureStore.getItemAsync as jest.Mock;
  const secureSet = SecureStore.setItemAsync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const key = new Uint8Array(32).fill(7);
    const fixedNonce = new Uint8Array(24).fill(3);
    mockGetRandomBytesAsync.mockImplementation((n: number) => {
      if (n === 32) {
        return Promise.resolve(key);
      }
      if (n === 24) {
        return Promise.resolve(fixedNonce);
      }
      return Promise.resolve(new Uint8Array(n).fill(1));
    });
    secureGet.mockImplementation((name: string) => {
      if (name.includes('backup_secretbox')) {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });
    asyncGet.mockResolvedValue(null);
  });

  it('saveEncryptedBackup reuses existing secure key on second save', async () => {
    const mem = { key: null as string | null };
    secureGet.mockImplementation((name: string) => {
      if (name.includes('backup_secretbox')) {
        return Promise.resolve(mem.key);
      }
      return Promise.resolve(null);
    });
    secureSet.mockImplementation(async (_n: string, v: string) => {
      mem.key = v;
    });
    asyncGet.mockResolvedValue(null);
    asyncSet.mockResolvedValue(undefined);
    mockGetRandomBytesAsync.mockImplementation((n: number) =>
      Promise.resolve(new Uint8Array(n).fill(4))
    );
    await saveEncryptedBackup(new ArrayBuffer(0));
    await saveEncryptedBackup(new ArrayBuffer(0));
    expect(secureSet).toHaveBeenCalledTimes(1);
  });

  it('saveEncryptedBackup writes ciphertext and creates key', async () => {
    secureSet.mockResolvedValue(undefined);
    asyncSet.mockResolvedValue(undefined);

    const plain = new TextEncoder().encode('hello-backup');
    await saveEncryptedBackup(plain.buffer.slice(plain.byteOffset, plain.byteOffset + plain.byteLength));

    expect(secureSet).toHaveBeenCalled();
    expect(asyncSet).toHaveBeenCalled();
    const [, stored] = asyncSet.mock.calls[0];
    expect(typeof stored).toBe('string');
    expect(stored.length).toBeGreaterThan(10);
  });

  it('loadEncryptedBackup returns original payload after save', async () => {
    const key = nacl.randomBytes(32);
    const nonce = nacl.randomBytes(24);
    mockGetRandomBytesAsync.mockImplementation((n: number) => {
      if (n === 32) {
        return Promise.resolve(key);
      }
      if (n === 24) {
        return Promise.resolve(nonce);
      }
      return Promise.resolve(new Uint8Array(n));
    });
    const mem = { key: null as string | null, blob: null as string | null };
    secureGet.mockImplementation((name: string) => {
      if (name.includes('backup_secretbox')) {
        return Promise.resolve(mem.key);
      }
      return Promise.resolve(null);
    });
    secureSet.mockImplementation(async (_k: string, v: string) => {
      mem.key = v;
    });
    asyncGet.mockImplementation(() => Promise.resolve(mem.blob));
    asyncSet.mockImplementation(async (_k: string, v: string) => {
      mem.blob = v;
    });
    asyncRemove.mockResolvedValue(undefined);

    const input = new TextEncoder().encode('round-trip-data');
    await saveEncryptedBackup(input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength));
    const out = await loadEncryptedBackup();
    expect(out).not.toBeNull();
    expect(new TextDecoder().decode(new Uint8Array(out!))).toBe('round-trip-data');
  });

  it('loadEncryptedBackup returns null when nothing stored', async () => {
    asyncGet.mockResolvedValue(null);
    const out = await loadEncryptedBackup();
    expect(out).toBeNull();
  });

  it('hasEncryptedBackup reflects AsyncStorage', async () => {
    asyncGet.mockResolvedValueOnce('x');
    expect(await hasEncryptedBackup()).toBe(true);
    asyncGet.mockResolvedValueOnce(null);
    expect(await hasEncryptedBackup()).toBe(false);
  });

  it('clearEncryptedBackup removes item', async () => {
    asyncRemove.mockResolvedValue(undefined);
    await clearEncryptedBackup();
    expect(asyncRemove).toHaveBeenCalled();
  });

  it('loadEncryptedBackup returns null when ciphertext exists but key is missing', async () => {
    asyncGet.mockResolvedValue('Ym9n'); // any non-empty
    secureGet.mockResolvedValue(null);
    const out = await loadEncryptedBackup();
    expect(out).toBeNull();
  });

  it('loadEncryptedBackup throws when blob is too short', async () => {
    const short = new Uint8Array(10);
    asyncGet.mockResolvedValue(bytesToBase64ForTest(short));
    secureGet.mockResolvedValue(bytesToBase64ForTest(new Uint8Array(32).fill(1)));
    await expect(loadEncryptedBackup()).rejects.toThrow(/too short/);
  });

  it('loadEncryptedBackup throws when ciphertext is not authentic', async () => {
    const key = new Uint8Array(32).fill(9);
    const garbage = new Uint8Array(24 + 16);
    garbage.fill(1);
    asyncGet.mockResolvedValue(bytesToBase64ForTest(garbage));
    secureGet.mockResolvedValue(bytesToBase64ForTest(key));
    await expect(loadEncryptedBackup()).rejects.toThrow(/could not be decrypted/);
  });
});

function bytesToBase64ForTest(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}
