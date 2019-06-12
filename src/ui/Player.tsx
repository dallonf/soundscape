import React from 'react';
import { observer } from 'mobx-react';
import { Paper, Theme, Box, Typography } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { useAppStateContext } from '../structure/AppStateContext';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2, 2, 3, 2),
    overflow: 'hidden',
  },
  layout: {
    display: 'grid',
    gridTemplateAreas:
      "'nowplaying nowplaying time' 'controlbuttons progress progress'",
    gridTemplateColumns: 'auto 1fr auto',
    gridRowGap: theme.spacing(2),
  },
  nowplaying: {
    gridArea: 'nowplaying',
  },
  progress: {
    gridArea: 'progress',
  },
}));

const Player = observer(() => {
  const appState = useAppStateContext();
  const classes = useStyles();

  const { player } = appState;

  return (
    <Paper className={classes.root} elevation={5}>
      <Box className={classes.layout}>
        <Box className={classes.nowplaying}>
          <Typography variant="subtitle1">
            {player.currentSound ? (
              <>
                <span style={{ fontWeight: 'bold' }}>Now Playing:</span>&nbsp;
                {player.currentSound.track.name}
              </>
            ) : (
              <>&nbsp;</>
            )}
          </Typography>
        </Box>
        <Box className={classes.progress}>
          <Slider
            disabled={player.state.type !== 'PLAYING'}
            max={
              player.currentSoundDuration == null
                ? 100
                : player.currentSoundDuration
            }
            value={
              player.currentSoundProgress == null
                ? 0
                : player.currentSoundProgress
            }
            onChange={(e, value) => {
              player.currentSoundProgress = value;
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
});

export default Player;
