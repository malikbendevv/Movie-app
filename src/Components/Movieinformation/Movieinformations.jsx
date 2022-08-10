/* eslint-disable indent */
/* eslint-disable jsx-quotes */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Rating,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Removed,
  ArrowBack,
  Remove,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetListQuery,
} from '../../services/TMDB';
import useStyles from './styles';
import genreIcons from '../../assets/assets/genres';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import MovieList from '../MovieList/MovieList';
import { userSelector } from '../../features/auth';

const Movieinformation = () => {
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMoviewatchListed, setIsMovieWatchListed] = useState(false);
  const [open, setOpen] = useState(false);
  // getting user informations from state
  const { user } = useSelector(userSelector);

  const classes = useStyles();
  const { id } = useParams();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: recommendations, isFetching: isRecommendationsFetching } =
    useGetRecommendationsQuery({ list: '/recommendations', movie_id: id });
  const { data: favoriteMovies } = useGetListQuery({
    listName: 'favorite/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });
  const { data: watchListMovies } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });

  const dispatch = useDispatch();
  // useEffect for favorite
  useEffect(() => {
    setIsMovieFavorited(
      !!favoriteMovies?.results?.find((movie) => movie?.id === data?.id)
    );
  }, [favoriteMovies, data]);
  // useEffect for watchlist
  useEffect(() => {
    setIsMovieWatchListed(
      !!watchListMovies?.results?.find((movie) => movie?.id === data?.id)
    );
  }, [watchListMovies, data]);

  // add to favorite
  const addToFavorite = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      { media_type: 'movie', media_id: id, favorite: !isMovieFavorited }
    );
    setIsMovieFavorited((prev) => !prev);
  };

  //  add to watchList
  const addToWatchList = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      { media_type: 'movie', media_id: id, watchlist: !isMoviewatchListed }
    );
    setIsMovieWatchListed((prev) => !prev);
  };
  // checinf if data is fetching
  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <CircularProgress siez='8rem' />
      </Box>
    );
  }
  // checking for potential error
  if (error) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Link to='/'> Something has gone wrong , go back</Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid
        item
        sm={12}
        md={12}
        lg={4}
        className={classes.posterContainer}
        marginBottom='20px'
        // width='100%'
      >
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid item container direction='column' lg={7}>
        <Typography variant='h3' align='center' gutterBottom>
          {data?.title} {data.release_date.split('-')[0]}
        </Typography>
        <Typography variant='h5' align='center' gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display='flex' alignItems='center'>
            <Rating readOnly value={data.vote_average / 2} />
            <Typography
              variant='subtitle1'
              gutterBottom
              style={{ marginLeft: '10px' }}
            >
              {data?.vote_average} /10
            </Typography>
          </Box>
          <Typography variant='h6' align='center' gutterBottom>
            {data?.runtime}min{' '}
            {data?.spoken_languages.length > 0
              ? `/${data?.spoken_languages.map(
                  (LanguageName) => LanguageName.english_name
                )}`
              : ''}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre, i) => (
            <Link
              key={genre.name}
              className={classes.links}
              to='/'
              onClick={() => {
                dispatch(selectGenreOrCategory(genre.id));
              }}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                className={classes.genreImage}
                height={30}
              />
              <Typography
                color='textPrimary'
                variant='subtitle1'
                textDecoration='none'
              >
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant='h5' gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        <Grid item container spacing={2}>
          {data &&
            data.credits.cast
              .map(
                (character, i) =>
                  character.profile_path && (
                    <Grid
                      key={i}
                      item
                      xs={4}
                      md={2}
                      component={Link}
                      to={`/actors/${character.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <img
                        className={classes.castImage}
                        src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                        alt={character.name}
                      />
                      <Typography color='primary'>{character?.name}</Typography>
                      <Typography color='secondary'>
                        {character?.character.split('/')[0]}
                      </Typography>
                    </Grid>
                  )
              )
              .slice(0, 6)}
        </Grid>
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size='small' variant='outlined'>
                <Button
                  target='_blank'
                  rel='noopener noreferrer'
                  href={data?.homepage}
                  endIcon={<Language />}
                >
                  website
                </Button>
                <Button
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`https://www.imdb.com/title/${data?.imdb_id}`}
                  endIcon={<Language />}
                >
                  IMDB
                </Button>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                  href='#'
                  endIcon={<Theaters />}
                >
                  Trailer
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size='small' variant='outlined'>
                <Button
                  onClick={addToFavorite}
                  endIcon={
                    !isMovieFavorited ? (
                      <FavoriteBorderOutlined />
                    ) : (
                      <Favorite />
                    )
                  }
                >
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button
                  onClick={addToWatchList}
                  endIcon={!isMoviewatchListed ? <Remove /> : <PlusOne />}
                >
                  Watchlist
                </Button>
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: 'primary.main' }}
                >
                  <Typography
                    component={Link}
                    to='/'
                    color='inherit'
                    variant='subtitle1'
                    style={{ textDecoration: 'none' }}
                  >
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      {isRecommendationsFetching ? (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <CircularProgress siez='8rem' />
        </Box>
      ) : (
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
        </Box>
      )}

      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {data?.videos?.results?.length > 0 ? (
          <iframe
            autoPlay
            className={classes.videos}
            frameBorder='0'
            title='Trailer'
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow='autoplay'
          />
        ) : (
          <Box>
            <Typography variant='h3'>
              {' '}
              There is no trailer available for this movie
            </Typography>
          </Box>
        )}
      </Modal>
    </Grid>
  );
};

export default Movieinformation;
