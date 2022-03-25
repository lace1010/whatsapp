import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 2s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Image = styled.img`
  max-height: 400px;
`;

const Loading = () => {
  return (
    <Container className="h-screen flex items-center justify-center animate-spin">
      <Image
        className=" max-h-52"
        src="/rottweiler.png"
        alt="rot spinning head"
      />
    </Container>
  );
};

export default Loading;
