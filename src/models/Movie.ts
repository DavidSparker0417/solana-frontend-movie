import { PROGRAM_ID } from "@/constants/web3";
import * as borsh from "@coral-xyz/borsh"
import { PublicKey } from "@solana/web3.js";

export class Movie {
  title: string;
  rating: number;
  description: string;
  reviewer: PublicKey;

  constructor(
    title: string,
    rating: number,
    description: string,
    reviewer: PublicKey) {
    this.title = title
    this.rating = rating
    this.description = description
    this.reviewer = reviewer;
  }

  publicKey(): PublicKey {
    console.log("reviewer: ", this.reviewer.toBase58());
    console.log("title: ", this.title);
    return(
      PublicKey.findProgramAddressSync(
        [this.reviewer.toBuffer(), Buffer.from(this.title)], 
        new PublicKey(PROGRAM_ID)
      )
    )[0]
  }

  borshInstructionSchema = borsh.struct([
    borsh.u8('variant'),
    borsh.str('title'),
    borsh.u8('rating'),
    borsh.str('description'),
  ])

  static borshAccountSchema = borsh.struct([
    borsh.str("discriminator"),
    borsh.bool('initialized'),
    borsh.publicKey("reviewer"),
    borsh.u8('rating'),
    borsh.str('title'),
    borsh.str('description'),
  ])

  serialize(v: number): Buffer {
    console.log(`[DAVID] variant = ${v}`)
    const buffer = Buffer.alloc(1000)
    this.borshInstructionSchema.encode({
      ...this, variant: v
    }, buffer)
    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
  }

  static deserialize(buffer?: Buffer): Movie | null {
    if (!buffer) return null
    try {
      const { rating, title, description, reviewer }
        = this.borshAccountSchema.decode(buffer)
      return new Movie(title, rating, description, reviewer);
    } catch (error) {
      console.log('Deserialization error:', error)
      return null
    }
  }
}