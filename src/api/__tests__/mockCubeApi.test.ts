import { mockCubeApi, resetMockCubeApiState } from '../mockCubeApi';

describe('mockCubeApi', () => {
  beforeEach(() => {
    resetMockCubeApiState();
  });

  it('getStatus returns status with version and ready', async () => {
    const status = await mockCubeApi.getStatus();
    expect(status.version).toBe('0.1.0');
    expect(status.ready).toBe(true);
    expect(status.privacy_mode).toBe('paranoid');
  });

  it('getConfig returns device config', async () => {
    const config = await mockCubeApi.getConfig();
    expect(config.device_name).toBeDefined();
    expect(config.default_privacy_mode).toBe('paranoid');
  });

  it('patchConfig updates config and getStatus privacy_mode', async () => {
    await mockCubeApi.patchConfig({ device_name: 'Patched', default_privacy_mode: 'normal' });
    const config = await mockCubeApi.getConfig();
    expect(config.device_name).toBe('Patched');
    expect(config.default_privacy_mode).toBe('normal');
    const status = await mockCubeApi.getStatus();
    expect(status.privacy_mode).toBe('normal');
  });

  it('getDevices returns device list with power and brightness', async () => {
    const list = await mockCubeApi.getDevices();
    expect(list.devices).toHaveLength(2);
    expect(list.devices[0].id).toBe('light-1');
    expect(list.devices[0].name).toContain('Living room');
    expect(list.devices[0].power).toBe(true);
    expect(list.devices[1].power).toBe(false);
  });

  it('patchConfig updates global_offline and getStatus reflects it', async () => {
    await mockCubeApi.patchConfig({ global_offline: true });
    const status = await mockCubeApi.getStatus();
    expect(status.global_offline).toBe(true);
    const config = await mockCubeApi.getConfig();
    expect(config.global_offline).toBe(true);
  });

  it('patchDevice updates device state', async () => {
    const updated = await mockCubeApi.patchDevice('light-2', { power: true, brightness: 0.5 });
    expect(updated.power).toBe(true);
    expect(updated.brightness).toBe(0.5);
    const list = await mockCubeApi.getDevices();
    expect(list.devices.find((d) => d.id === 'light-2')?.brightness).toBe(0.5);
  });

  it('patchDevice throws for unknown id', async () => {
    await expect(mockCubeApi.patchDevice('nope', { power: true })).rejects.toThrow(/DEVICE_NOT_FOUND/);
  });

  it('discoverDevices returns complete status and device list', async () => {
    const r = await mockCubeApi.discoverDevices();
    expect(r.status).toBe('complete');
    expect(r.added).toBe(0);
    expect(r.devices).toHaveLength(2);
  });

  it('sendChat returns stub reply', async () => {
    const r = await mockCubeApi.sendChat('hello');
    expect(r.reply).toContain('hello');
    expect(r.source).toBe('on_device');
  });

  it('getInternetActivity returns events', async () => {
    const r = await mockCubeApi.getInternetActivity();
    expect(r.events.length).toBeGreaterThan(0);
    expect(r.events[0].summary).toBeDefined();
  });

  it('getRoutines returns routine list', async () => {
    const list = await mockCubeApi.getRoutines();
    expect(list.routines.length).toBeGreaterThanOrEqual(0);
  });

  it('getProfiles returns profile list', async () => {
    const list = await mockCubeApi.getProfiles();
    expect(list.profiles.length).toBeGreaterThanOrEqual(0);
  });

  it('getLogs returns sample chains for UI drill-down', async () => {
    const result = await mockCubeApi.getLogs();
    expect(result.chains).toHaveLength(2);
    expect(result.chains[0]).toMatchObject({
      chain_id: '550e8400-e29b-41d4-a716-446655440000',
    });
  });

  it('createBackup returns octet-stream-sized buffer matching cube stub', async () => {
    const buf = await mockCubeApi.createBackup();
    const text = new TextDecoder().decode(buf);
    expect(text).toBe('WISDOM-BACKUP-v0\n');
  });

  it('restoreBackup resolves', async () => {
    const buf = new TextEncoder().encode('x').buffer;
    await expect(mockCubeApi.restoreBackup(buf)).resolves.toBeUndefined();
  });
});
