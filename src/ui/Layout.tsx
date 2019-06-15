import React from 'react';
import styled from 'styled-components/macro';
import Player from './Player';
import Palette from './Palette/Palette';

const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  // grid-template-areas: 'main sidebar' 'player player';
  // grid-template-columns: 1fr 250px;
  grid-template-areas: 'main' 'player';
  grid-template-rows: 1fr auto;
`;

const MainContainer = styled.div`
  grid-area: main;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const PlayerContainer = styled.div`
  grid-area: player;
`;

// const SidebarContainer = styled.div`
//   grid-area: sidebar;
//   overflow: auto;
// `;

const Layout = () => {
  return (
    <Wrapper>
      <MainContainer>
        <Palette />
      </MainContainer>
      <PlayerContainer>
        <Player />
      </PlayerContainer>
    </Wrapper>
  );
};

export default Layout;
