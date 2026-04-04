import { createHttpCubeApi } from '../cubeApi';

describe('createHttpCubeApi', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('getStatus requests /status and parses JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ version: '0.1.0', ready: true, privacy_mode: 'paranoid' }),
    } as unknown as Response);

    const api = createHttpCubeApi('http://localhost:8080/');
    const status = await api.getStatus();

    expect(status.version).toBe('0.1.0');
    expect(status.ready).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/status');
  });

  it('patchConfig sends PATCH with JSON body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ device_name: 'X', default_privacy_mode: 'normal' }),
    } as unknown as Response);

    const api = createHttpCubeApi('http://h');
    await api.patchConfig({ device_name: 'X' });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://h/config',
      expect.objectContaining({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_name: 'X' }),
      }),
    );
  });

  it('getLogs appends query string when params provided', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ chains: [] }),
    } as unknown as Response);

    const api = createHttpCubeApi('http://h');
    await api.getLogs({ since: '2020-01-01T00:00:00Z', limit: 10 });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://h/logs?since=2020-01-01T00%3A00%3A00Z&limit=10',
    );
  });

  it('createBackup returns arrayBuffer on success', async () => {
    const buf = new ArrayBuffer(2);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => buf,
    } as unknown as Response);

    const api = createHttpCubeApi('http://h');
    const out = await api.createBackup();
    expect(out).toBe(buf);
    expect(global.fetch).toHaveBeenCalledWith('http://h/backup', { method: 'POST' });
  });

  it('throws when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      text: async () => 'busy',
    } as unknown as Response);

    const api = createHttpCubeApi('http://h');
    await expect(api.getStatus()).rejects.toThrow('503');
  });

  it('restoreBackup posts octet-stream body', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => '',
    } as unknown as Response);

    const api = createHttpCubeApi('http://h');
    const payload = new ArrayBuffer(1);
    await api.restoreBackup(payload);

    expect(global.fetch).toHaveBeenCalledWith('http://h/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: payload,
    });
  });
});
