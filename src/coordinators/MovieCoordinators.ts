import { PROGRAM_ID } from "@/constants/web3"
import { Movie } from "@/models/Movie"
import * as web3 from "@solana/web3.js"
import bs58 from "bs58"

export class MovieCoordinator {
  static accounts: web3.PublicKey[] = []

  static async prefetchAccounts(connection: web3.Connection, search: string = '') {
    const offset = 4 + 6 + 1 + 32 + 1 + 4;
    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(PROGRAM_ID),
      {
        dataSlice: { offset: 2, length: 18 },
        filters: search === ''
          ?
          [
            {
              memcmp: {
                offset: 4,
                bytes: bs58.encode(Buffer.from("review")),
              },
            },
          ]
          : 
          [
            {
              memcmp: {
                offset: offset,
                bytes: bs58.encode(Buffer.from(search))
              }
            }
          ]
      }
    )
    const temp_accounts = [...accounts]

    // temp_accounts.sort((a:any, b:any) => {
    //   const lengthA = a.account.data.readUInt32LE(0)
    //   const lengthB = b.account.data.readUInt32LE(0)
    //   const dataA = a.account.data.slice(4, 4 + lengthA)
    //   const dataB = b.account.data.slice(4, 4 + lengthB)
    //   return dataA.compare(dataB)
    // })
    this.accounts = temp_accounts.map(account => account.pubkey)
  }

  static async fetchPage(
    connection: web3.Connection,
    page: number,
    perPage: number,
    search: string = '',
    reload: boolean = false): Promise<Movie[]> {
    if (this.accounts.length == 0 || reload) {
      await this.prefetchAccounts(connection, search)
    }
    const paginatedPublicKeys = this.accounts.slice(
      (page - 1) * perPage,
      page * perPage
    )
    if (paginatedPublicKeys.length == 0) {
      return []
    }
    const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)
    const movies = accounts.reduce((accum: Movie[], account) => {
      const movie = Movie.deserialize(account?.data)
      if (!movie) {
        return accum
      }
      return [...accum, movie]
    }, [])
    return movies
  }
}