import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React from "react";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase";

import "firebase/compat/firestore";
import { getDoc, doc } from "firebase/firestore";

const personalChat = ({ chat, messages }) => {
  return (
    <Container>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
};

export default personalChat;

export async function getServerSideProps(context) {
  const docRef = doc(db, "chats", context.query.chat);
  const chatRef = await getDoc(docRef);

  const colRef = collection(docRef, "messages");
  const messageRef = await getDocs(query(colRef, orderBy("timestamp", "asc")));

  const messages = await messageRef.docs
    .map((message) => ({
      id: message.id,
      ...message.data(),
    }))
    ?.map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const chat = {
    id: chatRef.id,
    ...chatRef.data(),
    timestamp: new Date().toLocaleString(), // serverTimeStamp() not working so I just used local time
  };

  return {
    props: {
      messages: JSON.stringify(messages ? messages : null),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and edge */
  scrollbar-width: none; /* Firefox */
`;
