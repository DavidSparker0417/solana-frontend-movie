import { Movie } from "@/models/Movie";
import { FC, useEffect, useState } from "react";
import { Card } from "./Card";
import { useConnection } from "@solana/wallet-adapter-react";
import { MovieCoordinator } from "@/coordinators/MovieCoordinators";
import { Button, Center, HStack, Input, Spacer } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { getCount } from "@/redux/transactionSlice";

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const { connection } = useConnection()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const transactionCount = useSelector(getCount);

  useEffect(() => {
    MovieCoordinator.fetchPage(
      connection,
      page,
      10,
      search,
      search !== ''
    ).then(movies => {
      setMovies(movies)
    });
  }, [page, search, transactionCount])
  return (
    <div>
      <Center>
        <Input
          id = 'search'
          color="gray.400"
          onChange={event => setSearch(event.currentTarget.value)}
          placeholder="Search"
          w = "97%"
          my={2}
        />
      </Center>
      {
        movies.map((movie, i) => <Card key={i} movie={movie} />)
      }
      <Center>
        <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
          {
            page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>
          }
          <Spacer />
          {
            MovieCoordinator.accounts.length > page * 2 &&
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          }
        </HStack>
      </Center>
    </div>
  )
}