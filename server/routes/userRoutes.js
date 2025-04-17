const {registerUser, loginUser, setAvatar,getAllUsers} = require('../controllers/usersController');
const router = require('express').Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/set-avatar/:id',setAvatar)
router.get('/allusers/:id', getAllUsers);
module.exports = router;