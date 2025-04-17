import React, { useState, useEffect,useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import APIRoutes from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import loader from '../assets/loader.gif';
import {io} from 'socket.io-client';

import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContain from '../components/ChatContain';

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const handleChatChange = (chat) => {
    setCurrentSelected(chat);
    // Add logic to handle chat change if needed
  }
 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Line 26
    if (!user) {
      navigate('/login');
    }
    if (user) {
      setCurrentUser(user);
      setLoading(true);
    }
    else if (user && !user.isAvatarImageSet) {
      navigate('/setAvatar');
    }
}, []);

useEffect (() => {
  if (currentUser) {
    socket.current = io(APIRoutes.HOST, {
      query: { userId: currentUser._id },
    });
  }
}, [currentUser]);



  useEffect(() => {
    if (currentUser) {
      const fetchContacts = async () => {
        try {
          const response = await axios.get(APIRoutes.GET_ALL_USERS + '/' + currentUser._id);
          console.log(response.data);
          setContacts(response.data);
        } catch (error) {
          console.error("Failed to fetch contacts", error);
          toast.error("Failed to fetch contacts");
        }
      };
  
      fetchContacts();
    }
  }, [currentUser]);
  

  return (
    <>
    <ChatContainer>
    <div className="container">
    <Contacts contacts={contacts} currentUser={currentUser} changechat={handleChatChange}></Contacts>
    
    {loading && currentSelected === undefined ? (
      <Welcome currentUser={currentUser} />
    ) : (
      <ChatContain  currentchat={currentSelected}
      currentUser={currentUser} handleChatChange={handleChatChange}
      socket={socket}
       />
    )}

    </div>
    
    </ChatContainer>
    </>
  )
}
const ChatContainer = styled.div`
 height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }


 
`
export default Chat