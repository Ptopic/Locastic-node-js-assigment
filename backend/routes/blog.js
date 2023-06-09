const {
	checkEmail,
	createUser,
	createAuthToken,
	verifyUser,
} = require('../controllers/register');

const { login } = require('../controllers/login');
const { getAllUsers } = require('../controllers/users');
const {
	createPost,
	accessPostRequests,
	changePostStatus,
	getPosts,
} = require('../controllers/posts');

const { validateUser, validateFunc } = require('../middleware/validator');

const router = require('express').Router();

// Register user
router.post(
	'/register',
	validateUser,
	validateFunc,
	checkEmail,
	createUser,
	createAuthToken
);

// Verify user after register
router.post('/verify-user', verifyUser);

// Login
router.post('/login', login);

// Posts
// Todo - Validate title and content on post create
router.get('/users', getAllUsers);
router.post('/posts', createPost);
router.get('/post-request', accessPostRequests);
router.post('/post-request', changePostStatus);
router.get('/posts', getPosts);

module.exports = router;
