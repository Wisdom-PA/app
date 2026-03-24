import { mockCubeApi } from '../mockCubeApi';

describe('mockCubeApi', () => {
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

  it('getDevices returns device list', async () => {
    const list = await mockCubeApi.getDevices();
    expect(list.devices).toHaveLength(2);
    expect(list.devices[0].id).toBe('light-1');
    expect(list.devices[0].name).toContain('Living room');
  });

  it('getRoutines returns routine list', async () => {
    const list = await mockCubeApi.getRoutines();
    expect(list.routines.length).toBeGreaterThanOrEqual(0);
  });

  it('getProfiles returns profile list', async () => {
    const list = await mockCubeApi.getProfiles();
    expect(list.profiles.length).toBeGreaterThanOrEqual(0);
  });

  it('getLogs returns log result', async () => {
    const result = await mockCubeApi.getLogs();
    expect(result.chains).toEqual([]);
  });
});
