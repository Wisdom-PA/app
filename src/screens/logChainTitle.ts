/**
 * Short label for a behaviour-log chain row (contract chains are loosely typed until F8.T1.S4).
 */
export function logChainListTitle(chain: unknown, index: number): string {
  if (
    chain !== null &&
    typeof chain === 'object' &&
    'chain_id' in chain &&
    typeof (chain as { chain_id: unknown }).chain_id === 'string'
  ) {
    const id = (chain as { chain_id: string }).chain_id;
    const short = id.length > 12 ? `${id.slice(0, 8)}…` : id;
    return `Chain ${short}`;
  }
  return `Chain ${index + 1}`;
}
