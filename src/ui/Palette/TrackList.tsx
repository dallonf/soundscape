import React from 'react';
import { observer } from 'mobx-react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
} from '@material-ui/core';
import { PlayArrow as PlayArrowIcon } from '@material-ui/icons';
import { useAppStateContext } from '../../structure/AppStateContext';

const TrackList = observer(() => {
  const appState = useAppStateContext();

  const { palette, player } = appState;

  if (palette.tracks.length) {
    return (
      <List>
        {palette.tracks.map(track => {
          const isPlaying =
            player.currentSound && player.currentSound.track === track;
          return (
            <ListItem key={track.filePath}>
              <ListItemIcon>
                <IconButton
                  edge="start"
                  onClick={() => player.play(track)}
                  color={isPlaying ? 'secondary' : undefined}
                >
                  <PlayArrowIcon />
                </IconButton>
              </ListItemIcon>
              <ListItemText primary={track.name} secondary={track.dirname} />
            </ListItem>
          );
        })}
      </List>
    );
  } else {
    return null;
  }
});

export default TrackList;