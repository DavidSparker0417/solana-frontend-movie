
type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

export const ENDPOINT: Cluster = 'testnet'
export const PROGRAM_ID = "Groj1efoV2ow3LbYgLz8K1JJV7Kxw4oBT4H8r95GaBVn"

export function explorer_url(signature:string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${ENDPOINT}`
}