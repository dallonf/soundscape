import React from 'react';
import { observer } from 'mobx-react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';
import {
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { useAppStateContext } from '../../structure/AppStateContext';
import MusicTrack from '../../logic/MusicTrack';
import Player from '../../logic/Player';
import Palette from '../../logic/Palette';

const TrackList = observer(() => {
  const appState = useAppStateContext();

  const { palette, player } = appState;

  return (
    <List>
      {palette.tracks.map(track => {
        return (
          <TrackListItem
            key={track.id}
            track={track}
            player={player}
            palette={palette}
          />
        );
      })}
    </List>
  );
});

const TrackListItem = ({
  track,
  player,
  palette,
}: {
  track: MusicTrack;
  player: Player;
  palette: Palette;
}) => {
  const [isFocused, setFocused] = React.useState(false);
  const [isHovered, setHovered] = React.useState(false);
  const isActive = isFocused || isHovered;

  const isPlaying = player.currentSound && player.currentSound.track === track;

  return (
    <ListItem
      key={track.id}
      dense={true}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
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
      <ListItemSecondaryAction
        style={{ visibility: isActive ? 'visible' : 'hidden' }}
      >
        <IconButton
          edge="end"
          aria-label="Delete"
          onClick={() => palette.removeTrack(track)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TrackList;
