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
  emptyContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [dragInProgress, setDragInProgress] = React.useState(false);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(
        0,
        scrollContainerRef.current.scrollHeight
      );
    }
  };

  const handleAddToPalette = async () => {
    const result = await selectMultipleMusicTracksDialog(appState.audioContext);
    if (result && result.length) {
      appState.palette.tracks.push(...result);
      scrollToBottom();
    }
  };

  return (
    <div className={classnames.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Palette</Typography>
        </Toolbar>
      </AppBar>
      {appState.palette.tracks.length ? (
        <div className={classnames.scrolling} ref={scrollContainerRef}>
          <TrackList
            onDragStart={() => setDragInProgress(true)}
            onDragEnd={() => setDragInProgress(false)}
          />
        </div>
      ) : (
        <div className={classnames.emptyContainer}>
          <Typography variant="h6">Empty palette</Typography>
          <Typography variant="body1">
            Add some music to get started.
          </Typography>
        </div>
      )}

      {!dragInProgress && (
        <Fab
          color="primary"
          onClick={handleAddToPalette}
          className={classnames.fab}
          title="Add new tracks to palette"
        >
          <AddIcon />
        </Fab>
      )}
    </div>
  );
});

export default Palette;
