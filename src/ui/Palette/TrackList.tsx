import React, { EventHandler, SyntheticEvent } from 'react';
import { observer, Observer } from 'mobx-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DragDropContextProps,
} from 'react-beautiful-dnd';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  ListItemSecondaryAction,
  Theme,
} from '@material-ui/core';
import {
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { useAppStateContext } from '../../structure/AppStateContext';
import MusicTrack from '../../logic/MusicTrack';
import Player from '../../logic/Player';
import Palette from '../../logic/Palette';
import { makeStyles } from '@material-ui/styles';

const TrackList = observer(() => {
  const appState = useAppStateContext();

  const { palette, player } = appState;

  const handleDragEnd: DragDropContextProps['onDragEnd'] = result => {
    if (
      !result.destination ||
      result.destination.index === result.source.index ||
      result.destination.droppableId !== 'palette' ||
      result.source.droppableId !== 'palette'
    ) {
      // no drag has occurred
      return;
    }

    const newList = [...palette.tracks];
    newList.splice(result.source.index, 1);
    newList.splice(
      result.destination.index,
      0,
      palette.tracks[result.source.index]
    );

    palette.tracks = newList;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="palette">
        {provided => (
          <Observer>
            {() => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {palette.tracks.map((track, index) => {
                  return (
                    <TrackListItem
                      key={track.id}
                      track={track}
                      index={index}
                      player={player}
                      palette={palette}
                    />
                  );
                })}
                {provided.placeholder}
              </List>
            )}
          </Observer>
        )}
      </Droppable>
    </DragDropContext>
  );
});

const composeDomEventHandler = <T extends SyntheticEvent>(
  ...fns: (EventHandler<T> | undefined | null)[]
) => {
  return (e: any) => {
    fns.forEach(fn => {
      if (fn) {
        fn(e);
      }
    });
  };
};

type DivProps = React.DOMAttributes<HTMLDivElement>;

const useItemStyles = makeStyles((theme: Theme) => ({
  item: {
    background: theme.palette.background.default,
  },
}));

const TrackListItem = observer(
  ({
    track,
    index,
    player,
    palette,
  }: {
    track: MusicTrack;
    index: number;
    player: Player;
    palette: Palette;
  }) => {
    const classes = useItemStyles();
    const [isFocused, setFocused] = React.useState(false);
    const [isHovered, setHovered] = React.useState(false);
    const isActive = isFocused || isHovered;

    const isPlaying =
      player.currentSound && player.currentSound.track === track;

    const focusProps = {
      onPointerEnter: () => setHovered(true),
      onPointerLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    };

    return (
      <Draggable draggableId={track.id} index={index}>
        {provided => (
          <Observer>
            {() => {
              return (
                <ListItem
                  key={track.id}
                  className={classes.item}
                  dense={true}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  {...focusProps}
                  onFocus={composeDomEventHandler(
                    (provided.draggableProps as DivProps).onFocus,
                    (provided.dragHandleProps as DivProps).onFocus,
                    focusProps.onFocus
                  )}
                  onBlur={composeDomEventHandler(
                    (provided.draggableProps as DivProps).onBlur,
                    (provided.dragHandleProps as DivProps).onBlur,
                    focusProps.onBlur
                  )}
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
                  <ListItemText
                    primary={track.name}
                    secondary={track.dirname}
                  />
                  <ListItemSecondaryAction
                    style={{ opacity: isActive ? 1 : 0 }}
                  >
                    <IconButton
                      edge="end"
                      aria-label="Delete"
                      onClick={() => palette.removeTrack(track)}
                      {...focusProps}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            }}
          </Observer>
        )}
      </Draggable>
    );
  }
);

export default TrackList;
