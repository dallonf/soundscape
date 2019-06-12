import React from 'react';
import styled from 'styled-components/macro';
import App from '../App';

const Wrapper = styled.div`
  height: 100vh;
  display: grid;
  grid-template-areas: 'main' 'player';
  grid-template-rows: 1fr auto;
`;

const MainContainer = styled.div`
  grid-area: main;
  overflow: auto;
`;

const PlayerContainer = styled.div`
  grid-area: player;
`;

const Layout = () => {
  return (
    <Wrapper>
      <MainContainer>
        <App />
      </MainContainer>
      <PlayerContainer>TODO: player goes here</PlayerContainer>
    </Wrapper>
  );
};

export default Layout;
