import React from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Player from './Player';
import Palette from './Palette/Palette';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: '100vh',
    background: theme.palette.background.default,
    // grid-template-areas: 'main sidebar' 'player player';
    // grid-template-columns: 1fr 250px;
    display: 'grid',
    gridTemplateAreas: "'main' 'player'",
    gridTemplateRows: '1fr auto',
  },
  mainContainer: {
    gridArea: 'main',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 0,
  },
  playerContainer: {
    gridArea: 'player',
    zIndex: 1,
  },
  // sidebarContainer: {
  //   gridArea: 'player',
  //   overflow: 'auto',
  // },
}));

const Layout = () => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={classes.mainContainer}>
        <Palette />
      </div>
      <div className={classes.playerContainer}>
        <Player />
      </div>
    </div>
  );
};

export default Layout;
