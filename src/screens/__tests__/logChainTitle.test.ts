import { logChainListTitle } from '../logChainTitle';

describe('logChainListTitle', () => {
  it('uses shortened chain_id when long', () => {
    expect(
      logChainListTitle({ chain_id: '550e8400-e29b-41d4-a716-446655440000' }, 0)
    ).toBe('Chain 550e8400…');
  });

  it('uses full chain_id when short', () => {
    expect(logChainListTitle({ chain_id: 'abc' }, 0)).toBe('Chain abc');
  });

  it('falls back to index when no chain_id', () => {
    expect(logChainListTitle({ foo: 1 }, 2)).toBe('Chain 3');
  });
});
