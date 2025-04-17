import React, { useState, useEffect, use } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import APIRoutes from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import multiavatar from '@multiavatar/multiavatar/esm'; // Import the Multiavatar library

function SetAvatar() {
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user  ) {
            navigate('/login');
        }
        if (user && user.isAvatarImageSet) {
            navigate('/chat');
        }
        


    }, []);
    useEffect(() => {
        const fetchAvatars = async () => {
            const data = [];
            setIsLoading(true);
            try {
                for (let i = 0; i < 4; i++) {
                    // Generate a random key for the avatar
                    const randomKey = Math.random().toString(36).substring(2, 10);
                    // Use the multiavatar library to generate the SVG
                    const svgCode = multiavatar(randomKey);
                    // Convert SVG to base64 for use in <img> tag
                    const base64String = btoa(svgCode);
                    const imageSrc = `data:image/svg+xml;base64,${base64String}`;
                    data.push(imageSrc);
                }
                setAvatars(data);
            } catch (error) {
                console.error('Error generating avatars:', error);
                toast.error('Failed to load avatars. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAvatars();
    }, []);

    const setProfilePicture = async () => {
        console.log('Selected Avatar:', selectedAvatar);
        if (selectedAvatar === undefined) {
            toast.error('Please select an avatar');
        } else {
            const user = await JSON.parse(localStorage.getItem('user'));
            const { data } = await axios.post(`${APIRoutes.SET_AVATAR}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/chat');
            } else {
                toast.error('Error setting avatar. Please try again.');
            }
        }
    };

    return (
        <>
            <Container>
                <div className="title-container">

                    <h1 className="subtitle">Pick an avatar as your profile picture</h1>
                </div>
                <div className="avatars">
                    {isLoading ? (
                        <img src={loader} alt="loader" className="loader" />
                    ) : (
                        avatars.map((avatar, index) => (
                            <div
                                key={index}
                                className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}
                            >
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    onClick={() => setSelectedAvatar(index)}
                                />
                            </div>
                        ))
                    )}
                </div>
                <button className='submit-btn' onClick={()=>setProfilePicture()}>Set as Profile Picture</button>
            </Container>
              <ToastContainer
                          position="top-center"
                          autoClose={5000}
                          hideProgressBar={false}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          pauseOnHover
                          theme="dark"
                      />
        </>
    );
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }

      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #3c0edc;
    }
  }
`;

export default SetAvatar;