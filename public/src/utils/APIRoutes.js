const HOST = 'http://localhost:5000'; // Replace with your actual host

const APIRoutes = {
    HOST: `${HOST}`,
    LOGIN: `${HOST}/api/auth/login`,
    REGISTER: `${HOST}/api/auth/register`,
    LOGOUT: `${HOST}/api/auth/logout`,
    GET_ALL_USERS: `${HOST}/api/auth/allusers`,
    SEND_MESSAGE: `${HOST}/api/messages/addmsg`,
    GET_MESSAGES: `${HOST}/api/messages/getmsg`,
    SET_AVATAR: `${HOST}/api/auth/set-avatar`,
};

export default APIRoutes;