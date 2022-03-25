import React from "react";
import { signIn } from "next-auth/react";
import styled from "styled-components";
import { Button } from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
  height: 100vh;
  min-height: 500px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 8px 4px 14px -3px rgba(0, 0, 0, 0.6);
`;
const Logo = styled.img`
  height: 300px;
  width: 300px;
  margin-bottom: 50px;
`;

const Login = () => {
  return (
    <Container>
      <LoginContainer>
        <Logo
          src="https://www.freepnglogos.com/uploads/whatsapp-logo-png-hd-2.png"
          alt="Whatsapp"
        />
        <Button onClick={signIn} variant="outlined">
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
};

export default Login;
