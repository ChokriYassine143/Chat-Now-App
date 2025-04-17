import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import Chatinput from './Chatinput';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import APIRoutes from '../utils/APIRoutes';

function ChatContain({ currentchat, currentUser, socket }) {
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // Fetch messages when chat changes
  useEffect(() => {
    if (currentchat && currentUser) {
      const fetchMessages = async () => {
        const { _id: from } = currentUser;
        const { _id: to } = currentchat;
        console.log('Fetching messages for:', { from, to });
        try {
          const response = await axios.get(APIRoutes.GET_MESSAGES, {
            params: { from, to },
          });
          console.log('Fetched messages:', response.data);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [currentchat, currentUser]);

  // Handle sending messages
  const handleSendMsg = async (msg) => {
    if (msg.trim().length > 0 && currentUser && currentchat) {
      const { _id: from } = currentUser;
      const { _id: to } = currentchat;
      const messageId = uuid();

      try {
        // Send to backend
        await axios.post(APIRoutes.SEND_MESSAGE, {
          from,
          to,
          message: msg,
        });

        // Emit through socket
        console.log('Emitting send-msg:', { to, from, message: msg, messageId });
        socket.current?.emit('send-msg', {
          to,
          from,
          message: msg,
          messageId,
        });

        // Update local messages
        setMessages((prev) => [
          ...prev,
          { _id: messageId, fromSelf: true, message: msg },
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Handle socket connection and messages
  useEffect(() => {
    if (socket.current && currentchat && currentUser) {
      // Log socket connection status
      console.log('Socket connected:', socket.current.connected);
      console.log('Current user ID:', currentUser._id);
      console.log('Current chat ID:', currentchat._id);

      // Ensure user joins their room
      socket.current.emit('join', currentUser._id);

      const handleMessageReceive = ({ message, from, messageId }) => {
        console.log('Received msg-receive:', { message, from, messageId });
        console.log('Current chat ID (recipient):', currentchat._id);

        // Only process messages from the current chat
        if (from === currentchat._id) {
          console.log('Message matches current chat, adding to state');
          setArrivalMessage({
            _id: messageId || uuid(),
            fromSelf: false,
            message,
          });
        } else {
          console.log('Message ignored: not from current chat');
        }
      };

      socket.current.on('msg-receive', handleMessageReceive);

      // Cleanup listener on unmount or socket change
      return () => {
        socket.current.off('msg-receive', handleMessageReceive);
      };
    }
  }, [socket, currentchat, currentUser]);

  // Append new messages
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((msg) => msg._id === arrivalMessage._id)) {
          console.log('Duplicate message detected, skipping:', arrivalMessage);
          return prev;
        }
        const newMessages = [...prev, arrivalMessage];
        console.log('Updated messages:', newMessages);
        return newMessages;
      });
    }
  }, [arrivalMessage]);

  // Scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {currentchat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={currentchat.avatarImage} alt="avatar" />
              </div>
              <div className="username">
                <h3>{currentchat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={message._id || uuid()}
                className={`message ${message.fromSelf ? 'sended' : 'recieved'}`}
                ref={index === messages.length - 1 ? scrollRef : null} // Attach ref only to the last message
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          <Chatinput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

// Styled components remain unchanged
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContain;