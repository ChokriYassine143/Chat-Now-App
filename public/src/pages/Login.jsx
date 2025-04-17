import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS for proper styling
import APIRoutes from '../utils/APIRoutes';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
     
        password: '',
      
    });
    const [isLoading, setIsLoading] = useState(false); // Add loading state for better UX

    const handleValidation = () => {
        const { username, password } = values;

        if (username.length === 0) {
            toast.error('Username is required');
           
            return false;
        }
    
      
        if (!password || password=== '') {
            toast.error('Password is required');
            return false;
        }
        
       
        return true;
    };
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.isAvatarImageSet) {
            navigate('/chat');
        }
        else if (user && !user.isAvatarImageSet) {
            navigate('/setAvatar');
        }
      
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!handleValidation()) return;

        setIsLoading(true);
        try {
            const { username, password } = values;
            const response = await axios.post(APIRoutes.LOGIN, {
                username,
            
                password,
            });

            if (!response.data.success) {
                toast.error(response.data.msg || 'Login failed');
                return;
            }

            toast.success(response.data.msg || ' Login Successful!');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setTimeout(() => {

                if (response.data.user.isAvatarImageSet) {
                    navigate('/chat');
                }
                else {
                    navigate('/setAvatar');
                }
              
            }, 1000); // Reload the page after a short delay
            
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'An error occurred during registration';
            toast.error(errorMsg);
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    return (
        <>
            <FormContainer>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="brand">
                        <img src={Logo} alt="Chat Now Logo" />
                        <h1>Chat Now</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                   
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                  
                    <button type="submit" disabled={isLoading}>
                       Log In
                    </button>
                    <span>
                       Don't have an account <Link to="/register">Register</Link>
                    </span>
                </form>
            </FormContainer>
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

const FormContainer = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100vw;
    flex-direction: column;
    background-color: #131324;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
    }
    img {
        height: 5rem;
    }
    h1 {
        color: white;
        text-transform: uppercase;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        padding: 3rem 5rem;
        border-radius: 2rem;
    }
    input {
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        border-radius: 0.4rem;
        color: white;
        width: 100%;
        font-size: 1rem;
        &:focus {
            border: 0.1rem solid #997af0;
            outline: none;
        }
    }
    button {
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.4rem;
        font-size: 1rem;
        cursor: pointer;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;
        &:hover {
            background-color: #4e0eff;
        }
    }
    span {
        color: white;
        text-transform: uppercase;
        a {
            color: #4e0eff;
            text-decoration: none;
            font-weight: bold;
        }
    }
`;

export default Login;