/* eslint-disable jsx-quotes */
import React, { useRef } from 'react';
import { CssBaseline } from '@mui/material';
import { Route, Switch } from 'react-router-dom';
import useStyles from './Components/styles';
import useAlan from './Alan';
import {
  Actors,
  Movieinformation,
  Movies,
  Navbar,
  Profile,
} from './Components';

function App() {
  const classes = useStyles();
  const alanBtnContainer = useRef();
  useAlan();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar />
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Switch>
          <Route exact path='/movie/:id'>
            <Movieinformation />
          </Route>
          <Route exact path='/actors/:id'>
            <Actors />
          </Route>
          <Route exact path={['/', '/approved']}>
            <Movies />
          </Route>
          <Route exact path='/profile/:id'>
            <Profile />
          </Route>
        </Switch>
      </main>
      <div ref={alanBtnContainer} />
    </div>
  );
}

export default App;
