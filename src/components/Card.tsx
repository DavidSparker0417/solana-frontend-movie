import { Movie } from "@/models/Movie";
import { Box } from "@chakra-ui/react";
import { FC } from "react";

export interface CardProps {
  movie: Movie
}

export const Card:FC<CardProps> = (props) => {
  return(
    <Box>
    </Box>
  )
}
