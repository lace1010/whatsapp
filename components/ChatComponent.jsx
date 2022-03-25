import { useRouter } from "next/router";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import getOtherEmail from "../util/getOtherEmail.js";

const Chat = ({ id, chatUsers, users }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const recipientEmail = getOtherEmail(chatUsers, session?.user.email);

  // if user in chat has logging in with gmail. then use their gmail info for picture
  const userSRC = users
    ?.filter((user) => user.email == recipientEmail)
    .map((passedUser) => passedUser.image);

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {userSRC?.length > 0 ? (
        <AvatarImage src={userSRC} alt="user" />
      ) : (
        <AvatarLetter>{recipientEmail[0].toUpperCase()}</AvatarLetter>
      )}

      <Email>{recipientEmail}</Email>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  word-break: break-word;
  padding: 10px 15px 10px 15px;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const AvatarImage = styled.img`
  height: 30px;
  border-radius: 50%;
`;

const AvatarLetter = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Email = styled.p`
  margin-left: 10px;
`;

export default Chat;
