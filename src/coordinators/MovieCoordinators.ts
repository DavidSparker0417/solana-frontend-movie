import { Movie } from "@/models/Movie"
import * as web3 from "@solana/web3.js"

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'
export class MovieCoordinator {
  static accounts: web3.PublicKey[] = []

  static async prefetchAccounts(connection: web3.Connection) {
    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
      {
        dataSlice: { offset: 2, length: 18 },
        filters: []
      }
    )

    this.accounts = accounts.map(account => account.pubkey)
  }

  static async fetchPage(
    connection: web3.Connection,
    reload: boolean = false): Promise<Movie[]> {
    if (this.accounts.length == 0 || reload) {
      await this.prefetchAccounts(connection)
    }
    const paginatedPublicKeys = this.accounts.slice(0, 10)
    if (paginatedPublicKeys.length == 0){
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