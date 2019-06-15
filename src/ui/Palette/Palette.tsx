import React from 'react';
import { observer } from 'mobx-react';
import { AppBar, Toolbar, Typography, Fab, Theme } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import TrackList from './TrackList';
import { useAppStateContext } from '../../structure/AppStateContext';
import { selectMultipleMusicTracksDialog } from '../../logic/MusicTrack';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  scrolling: {
    flex: '1 1 0',
    overflowY: 'auto',
    paddingBottom: 50 + theme.spacing(2),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const Palette = observer(() => {
  const classnames = useStyles();
  const appState = useAppStateContext();

  const handleAddToPalette = async () => {
    const result = await selectMultipleMusicTracksDialog(appState.audioContext);
    if (result && result.length) {
      appState.palette.tracks.push(...result);
    }
  };

  return (
    <div className={classnames.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Palette</Typography>
        </Toolbar>
      </AppBar>
      <div className={classnames.scrolling}>
        <TrackList />
      </div>
      <Fab
        color="primary"
        onClick={handleAddToPalette}
        className={classnames.fab}
        title="Add new tracks to palette"
      >
        <AddIcon />
      </Fab>
    </div>
  );
});

export default Palette;
