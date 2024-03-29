import * as borsh from "@coral-xyz/borsh"

export class Movie {
  title: string;
  rating: number;
  description: string;

  constructor(title:string, rating: number, description: string) {
    this.title = title
    this.rating = rating
    this.description = description
  }

  borshInstructionSchema = borsh.struct([
    borsh.u8('variant'),
    borsh.str('title'),
    borsh.u8('rating'),
    borsh.str('description'),
  ])

  serialize(): Buffer {
    const buffer = Buffer.alloc(1000)
    this.borshInstructionSchema.encode({
      ...this, variant:0
    }, buffer)
    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
  }
}