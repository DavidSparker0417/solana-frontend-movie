
type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

export const ENDPOINT: Cluster = 'testnet'
export const PROGRAM_ID = "zAvTJ2fc8CeoqAiRZACb3W4SPCeEm3bG5LXm4ukTVVp"

export function explorer_url(signature:string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${ENDPOINT}`
}