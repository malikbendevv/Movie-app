import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box, Button } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { userSelector } from '../../features/auth';
import { useGetListQuery } from '../../services/TMDB';
import { RatedCards } from '..';

const Profile = () => {
  const { user } = useSelector(userSelector);
  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };
  const { data: favoriteMovies, refetch: refetchFavorite } = useGetListQuery({
    listName: 'favorite/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });
  const { data: watchListMovies, refetch: refetchWatchList } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });
  useEffect(() => {
    refetchFavorite();
    refetchWatchList();
  }, []);
  return (
    <Box>
      <Box display='flex' justifyContent='space-between'>
        <Typography variant='h4' gutterBottom>
          My Profile
        </Typography>
        <Button color='inherit' onClick={logout}>
          Logout &nbsp;
          <ExitToApp />
        </Button>
      </Box>
      {!favoriteMovies?.results?.length && !watchListMovies?.results ? (
        <Typography variant='h5'>
          {' '}
          Add favorite or watchlist some movies to see the here
        </Typography>
      ) : (
        <Box>
          {' '}
          <RatedCards title='Favorite Movies' data={favoriteMovies} />
          <RatedCards title='watchlist ' data={watchListMovies} />
        </Box>
      )}
    </Box>
  );
};

export default Profile;
