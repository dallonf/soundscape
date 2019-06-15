import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import TrackList from './TrackList';

const Palette = () => {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">Palette</Typography>
        </Toolbar>
      </AppBar>
      <TrackList />
    </>
  );
};

export default Palette;
