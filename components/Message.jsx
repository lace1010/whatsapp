import React from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import moment from "moment";

const Message = ({ user, message }) => {
  const { data: session } = useSession();

  // To determin who is the sender with messages. Check if the message user
  const TypeOfMessage = user == session?.user?.email ? Sender : Receiver;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}{" "}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
};

export default Message;

const Container = styled.div``;
const MessageElement = styled.p`
  width: fit-content;
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  min-width: 70px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
`;
