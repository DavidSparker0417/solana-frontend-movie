
type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

export const ENDPOINT: Cluster = 'devnet'
export const PROGRAM_ID = "9g91aiWW88r65zwEMa3dSMEbDfYF5Qhy5yT1YzenJwEv"

export function explorer_url(signature:string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${ENDPOINT}`
}