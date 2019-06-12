import React from 'react';
import { Paper, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

const Player = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={5}>
      TODO
    </Paper>
  );
};

export default Player;
