import Head from "next/head";
import styles from "../styles/Home.module.css"
import { AppBar } from "@/components/AppBar";
import { Box, Center, Heading } from "@chakra-ui/react";
import { Form } from "@/components/Form";
import { MovieList } from "@/components/MovieList";
import {wrapper} from "../redux/store"

function Home() {
  return (
    <div className={styles.App}>
      <Head>
        <title>Movie Review</title>
      </Head>
      <AppBar />
      <Center>
        <Box>
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            Add a review
          </Heading>
          <Form />
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            Movie reviews
          </Heading>
          <MovieList />
        </Box>
      </Center>
    </div>
  );
}

export default wrapper.withRedux(Home)