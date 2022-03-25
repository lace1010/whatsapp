import React, { useEffect } from "react";
import styled from "styled-components";
import { Chat, MoreVert, SearchRounded } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import * as EmailValidator from "email-validator";
import { signOut, useSession } from "next-auth/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import ChatComponent from "./ChatComponent";
import { useCollection } from "react-firebase-hooks/firestore";

const Sidebar = () => {
  const { data: session } = useSession();

  const [snapshot] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map((chat) => ({
    id: chat.id,
    ...chat.data(),
  }));

  const [userSnap] = useCollection(collection(db, "users"));
  const users = userSnap?.docs.map((user) => ({
    id: user.id,
    ...user.data(),
  }));

  // If session.user is not in database then add him as a user
  useEffect(async () => {
    const userArray = users?.filter(
      (user) => user.email == session?.user?.email
    );

    if (userArray == 0) {
      // push into db
      await addDoc(collection(db, "users"), {
        email: session?.user.email,
        image: session?.user.image,
        lastSeen: serverTimestamp(),
      });
    }
  }, [users]);

  const chatAlreadyExist = (recipientEmail) => {
    // We can use users1 because when we add chats, the input is always scond in the array
    const truthyChatsArray = chats.filter(
      (chat) => chat.users[1] == recipientEmail
    );
    return truthyChatsArray.length > 0 ? true : false;
  };

  const createChat = async (e) => {
    e.preventDefault();
    const input = prompt(
      "Please enter an email address for the user you wish to chat with."
    );

    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== session?.user.email
    ) {
      // push into db
      await addDoc(collection(db, "chats"), {
        users: [session?.user.email, input],
        timestamp: serverTimestamp(),
      });
    }
  };

  return (
    <Container>
      <Header>
        <UserAvatar
          onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}
          src={session?.user?.image}
          alt="user"
        />

        <IconsContainer onClick={chatAlreadyExist}>
          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchRounded />
        <SearchInput type="text" placeholder="Search in chats" />
      </Search>

      <SidebarButton onClick={createChat}>START A NEW CHAT</SidebarButton>

      <ChatsContainer>
        {chats
          ?.filter((chat) => chat.users.includes(session?.user.email))
          .map((chat) => (
            <ChatComponent
              key={chat.id}
              id={chat.id}
              chatUsers={chat.users}
              users={users}
            />
          ))}
      </ChatsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.45;
  height: 100vh;
  min-width: 200px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid bottom;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and edge */
  scrollbar-width: none; /* Firefox */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  padding: 12px;
  height: 80px;
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

const IconsContainer = styled.div`
  display: flex;
`;
const ChatIcon = styled(Chat)``;
const MoreVertIcon = styled(MoreVert)``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 5px;
`;
const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  color: rgba(0, 0, 0, 0.8) !important;
  :hover {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`;

const ChatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`;

export default Sidebar;
