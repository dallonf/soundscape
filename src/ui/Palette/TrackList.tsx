import React from 'react';
import { observer } from 'mobx-react';
import { useAppStateContext } from '../../structure/AppStateContext';
import { List, ListItem, ListItemText } from '@material-ui/core';

const TrackList = observer(() => {
  const appState = useAppStateContext();

  const { palette } = appState;

  if (palette.tracks.length) {
    return (
      <List>
        {palette.tracks.map(track => (
          <ListItem key={track.filePath}>
            <ListItemText primary={track.name} secondary={track.dirname} />
          </ListItem>
        ))}
      </List>
    );
  } else {
    return null;
  }
});

export default TrackList;
