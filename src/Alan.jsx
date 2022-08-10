import React, { useEffect, useContext } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ColorModeContext } from './utils/ToggleColorMode';
import { fetchToken } from './utils';
import {
  selectGenreOrCategory,
  searchMovie,
} from './features/currentGenreOrCategory';

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    alanBtn({
      key: '716a3774e14129ccdf4d56562a245ed02e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, mode, genres, genreOrCategory, query }) => {
        if (command === 'chooseGenre') {
          const foundGenre = genres.find(
            (g) => g.name.toLowerCase() === genreOrCategory.toLowerCase()
          );
          if (foundGenre) {
            history.push('/');
            dispatch(selectGenreOrCategory(foundGenre.id));
          } else {
            // top rated upcoming popular
            const category = genreOrCategory.startsWith('top')
              ? 'top_rated'
              : genreOrCategory;
            history.push('/');

            dispatch(selectGenreOrCategory(category));
          }
        } else if (command === 'changeMode') {
          if (mode === 'light') {
            setMode('light');
          } else if (mode === 'dark') {
            setMode('dark');
          }
        } else if (command === 'login') {
          fetchToken();
        } else if (command === 'logout') {
          localStorage.clear();
          window.location.href = '/';
        } else if (command === 'search') {
          dispatch(searchMovie(query));
        }
      },
    });
  }, []);
  return <div>Alan</div>;
};

export default useAlan;
