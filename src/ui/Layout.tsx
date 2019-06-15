import React from 'react';
import styled from 'styled-components/macro';
import App from '../App';
import Player from './Player';
import Palette from './Palette';

const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  grid-template-areas: 'main sidebar' 'player player';
  grid-template-columns: 1fr 250px;
  grid-template-rows: 1fr auto;
`;

const MainContainer = styled.div`
  grid-area: main;
  overflow: auto;
`;

const PlayerContainer = styled.div`
  grid-area: player;
`;

const SidebarContainer = styled.div`
  grid-area: sidebar;
`;

const Layout = () => {
  return (
    <Wrapper>
      <MainContainer>
        <Palette />
      </MainContainer>
      <SidebarContainer>
        <App />
      </SidebarContainer>
      <PlayerContainer>
        <Player />
      </PlayerContainer>
    </Wrapper>
  );
};

export default Layout;
