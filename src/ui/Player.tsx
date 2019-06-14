import React from 'react';
import { observer } from 'mobx-react';
import { Paper, Theme, Box, Typography, IconButton } from '@material-ui/core';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
} from '@material-ui/icons';
import { Slider } from '@material-ui/lab';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useAppStateContext } from '../structure/AppStateContext';
import { formatTime } from './formatTime';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2, 2, 2, 2),
    overflow: 'hidden',
  },
  layout: {
    display: 'grid',
    gridTemplateAreas:
      "'nowplaying nowplaying time' 'controlbuttons progress progress'",
    gridTemplateColumns: 'auto 1fr auto',
  },
  nowplaying: {
    gridArea: 'nowplaying',
  },
  progress: {
    gridArea: 'progress',
    alignSelf: 'center',
  },
  time: {
    gridArea: 'time',
    fontVariantNumeric: 'tabular-nums',
  },
  controlButtons: {
    gridArea: 'controlbuttons',
  },
}));

const Player = observer(() => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const appState = useAppStateContext();

  const { player } = appState;
  const paused =
    player.state.type === 'PAUSED' || player.state.type === 'PAUSING';

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
        {player.currentSound && (
          <Box className={classes.time}>
            <Typography variant="overline">
              {formatTime(player.currentSoundProgress! * 1000)} /{' '}
              {formatTime(player.currentSoundDuration! * 1000)}
            </Typography>
          </Box>
        )}
        <Box className={classes.controlButtons}>
          {paused || !player.currentSound ? (
            <IconButton
              aria-label="Play"
              edge="start"
              disabled={!player.currentSound}
              onClick={() => player.resume()}
              size="small"
            >
              <PlayArrowIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="Pause"
              edge="start"
              onClick={() => player.pause()}
              size="small"
            >
              <PauseIcon />
            </IconButton>
          )}
          <IconButton
            aria-label="Stop"
            disabled={!player.currentSound}
            onClick={() => player.fadeOutAndStop()}
            size="small"
            style={{ marginRight: theme.spacing(2) }}
          >
            <StopIcon />
          </IconButton>
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
