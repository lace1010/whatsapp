import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import {
  MoreVert,
  AttachFile,
  InsertEmoticon,
  MicOutlined,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import Message from "./Message";
import moment from "moment";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import getOtherEmail from "../util/getOtherEmail";

const ChatScreen = ({ chat, messages }) => {
  const { data: session } = useSession();
  const endOfMessagesRef = useRef(null);
  const [input, setInput] = useState("");
  const router = useRouter();
  const recipientEmail = getOtherEmail(chat.users, session?.user.email);

  //query for messageSnapshot
  const q = query(
    collection(db, "chats", router.query.chat, "messages"),
    orderBy("timestamp", "asc")
  );
  const [messagesSnapshot] = useCollectionData(q);

  const [userSnap] = useCollection(collection(db, "users"));
  const users = userSnap?.docs.map((user) => ({
    id: user.id,
    ...user.data(),
  }));

  // if user in chat has logging in with gmail. then use their gmail info for picture
  const userSRC = users
    ?.filter((user) => user.email == recipientEmail)
    .map((passedUser) => passedUser.image);

  // if user in chat has logging in with gmail. then use their timestamp for last seen
  const recipientTimestamp = users
    ?.filter((user) => user.email == recipientEmail)
    .map((recipient) => recipient.lastSeen);

  const showMessages = () => {
    // set an if statement where if messagesSnapshot is updated... idk answer yet
    if (messagesSnapshot) {
      return messagesSnapshot.map((message) => (
        <Message
          key={message.id}
          user={message.user}
          message={{
            ...message,
            timestamp: message.timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
    // This works and shows serverSideRendering. But messageSnapshot is always there so it never gets called...
    else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  // Use this in invisble div to scroll to bottom of messages onLoad and when messageSnapshot updates
  useEffect(
    () =>
      setTimeout(
        endOfMessagesRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
        100
      ),
    [messagesSnapshot]
  );

  const sendMessage = async (e) => {
    e.preventDefault();
    // Create a query against the collection to bring back user who is in session
    const q = await getDocs(
      query(collection(db, "users"), where("email", "==", session.user.email))
    );

    // update the user in session's timestamp to when message button was clicked
    q.forEach(async (user) => {
      updateDoc(doc(db, "users", user.id), {
        lastSeen: serverTimestamp(),
      });
    });

    // Add messages as a subcollection to selected chat depending on router query chat/id
    const docRef = doc(db, "chats", router.query.chat);
    const colRef = collection(docRef, "messages");
    addDoc(colRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: session.user.email,
      image: session.user.image,
    });

    // Reset input
    setInput("");
  };

  return (
    <Container>
      <Header>
        {/* if userSRC has an image render it, if not render the first letter of email */}
        {userSRC?.length > 0 ? (
          <UserAvatar src={userSRC} alt="user" />
        ) : (
          <AvatarLetter>{recipientEmail[0].toUpperCase()}</AvatarLetter>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          <p>
            Last seen: {/* // recipient timestamp, not chat*/}
            {recipientTimestamp?.length > 0
              ? moment(recipientTimestamp?.seconds).format("LT")
              : "Unavailable, needs to login first"}
          </p>
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <MoreVert />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
        </HeaderIcons>
      </Header>

      {messagesSnapshot && (
        <MessageContainer>
          {showMessages()}
          {/* use this div as a reference so we can scroll to it  */}
          <EndOfMessage ref={endOfMessagesRef} />
        </MessageContainer>
      )}

      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" disabled={!input} hidden onClick={sendMessage}>
          Send Message
        </button>
        <MicOutlined />
      </InputContainer>
    </Container>
  );
};
const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 50;
  top: 0;
  display: flex;
  align-items: center;
  height: 80px;
  padding: 12px;
  border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 40px;
  border-radius: 50%;

  :hover {
    opacity: 0.8;
  }
`;
const AvatarLetter = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const HeaderInformation = styled.div`
  margin-left: 10px;
  flex: 1;
  > h3 {
    margin-bottom: -10px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  height: 80vh;
  min-height: 600px;
  padding: 30px;
  background-color: #e5ded8;
  overflow-y: scroll;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 50;
`;
const Input = styled.input`
  flex: 1;
  align-items: center;
  position: sticky;
  bottom: 0;
  padding: 20px;
  background-color: whitesmoke;
  border: none;
  outline: 0;
  border-radius: 10px;
  margin: 0px 15px;
`;
export default ChatScreen;
