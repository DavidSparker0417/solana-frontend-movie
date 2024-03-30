import { Movie } from "@/models/Movie";
import { FC, useEffect, useState } from "react";
import { Card } from "./Card";
import { useConnection } from "@solana/wallet-adapter-react";
import { MovieCoordinator } from "@/coordinators/MovieCoordinators";

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const { connection } = useConnection()

  useEffect(() => {
    MovieCoordinator.fetchPage(connection)
    .then(movies => {
      setMovies(movies)
    });
  }, [])
  return (
    <div>
      {
        movies.map((movie, i) => <Card key={i} movie={movie} />)
      }
    </div>
  )
}