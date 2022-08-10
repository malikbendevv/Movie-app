import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  Rating,
} from '@mui/material';
import { Movie as MovieIcon, ArrowBack } from '@mui/icons-material';
import {
  useGetActorsQuery,
  useGetMoviesByActorIdQuery,
} from '../../services/TMDB';
import MovieList from '../MovieList/MovieList';

import useStyles from './styles';
import Pagination from '../Pagination/Paginationn';

const Actors = () => {
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const { data: actor, isFetching, error } = useGetActorsQuery(id);
  const { data: recommendations, isFetching: isRecommendationsFetching } =
    useGetMoviesByActorIdQuery({ id, page });
  const classes = useStyles();
  console.log('Actors', id, recommendations);

  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center'>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Grid container display='flex' className={classes.actorsContainer}>
      <Grid item md={6} className={classes.imageContainer}>
        <img
          className={classes.image}
          src={`https://image.tmdb.org/t/p/w500${actor?.profile_path}`}
          alt={actor?.name}
        />
      </Grid>
      <Grid
        item
        container
        direction='column'
        sm={12}
        md={6}
        className={classes.actorText}
      >
        <Typography variant='h2' align='left' gutterBottom>
          {actor.name}
        </Typography>
        <Typography variant='h6' align='left' gutterBottom>
          {' '}
          Born:{new Date(actor?.birthday).toDateString()}
        </Typography>
        <Typography variant='body3' gutterBottom>
          {actor.biography}
        </Typography>
        <Grid
          item
          container
          display='flex'
          justifyContent='space-around'
          className={classes.buttonsGrid}
        >
          <Button
            href={`https://www.imdb.com/name/${actor?.imdb_id}`}
            variant='contained'
          >
            IMDB
          </Button>
          <Button
            href='/'
            endIcon={<ArrowBack />}
            sx={{ borderColor: 'primary.main' }}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Box marginTop='5rem' width='100%'>
        <Typography variant='h3' gutterBottom align='center'>
          You might also like
        </Typography>
        {/* Loop through the recommanded movie ... */}
        {recommendations ? (
          <MovieList movies={recommendations} numberOfMovies={12} />
        ) : (
          <Box> Sorry nothing was found</Box>
        )}
        <Pagination
          currentPage={page}
          setPage={setPage}
          totalPages={recommendations?.total_pages}
        />
      </Box>
    </Grid>
  );
};

export default Actors;
