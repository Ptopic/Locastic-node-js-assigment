const {
	checkEmail,
	createUser,
	createAuthToken,
	verifyUser,
	adminAuthenticate,
} = require('../controllers/register');

const { login } = require('../controllers/login');
const { getAllUsers } = require('../controllers/users');
const {
	createPost,
	accessPostRequests,
	changePostStatus,
	getPosts,
	deletePosts,
} = require('../controllers/posts');

const { validateUser, validateFunc } = require('../middleware/validator');

const router = require('express').Router();

// Schemas

/**
 * A User
 * @typedef {object} User
 * @property {string} uid.required - uid of user
 * @property {number} isVerified.required - is user verified (1 is verified, 0 is not verified)
 * @property {string} email.required - Email of user
 * @property {string} password.required - Password of user
 * @property {string} firstName.required - First name of user
 * @property {string} lastName.required - Last name of user
 * @property {string} role.required - Role of user (USER, BLOGGER, ADMIN)
 */

/**
 * A Post
 * @typedef {object} Post
 * @property {number} id.required - id of post
 * @property {string} ownerId.required - id of user who created post
 * @property {string} title.required - title of post
 * @property {string} content.required - content of post
 * @property {string} timeStamp.required - time and date when post was created
 * @property {string} author.required - authors first and last name
 * @property {string} allowed.required - is post allowed by admin ('denied', 'allowed')
 */

// Register user

/**
 * POST /api/blog/register
 * @tags Authentication
 * @summary Registers a user account
 * @param {firstName} firstName.form.required - Users first name - application/x-www-form-urlencoded
 * @param {lastName} lastName.form.required - Users last name - application/x-www-form-urlencoded
 * @param {email} email.form.required - Users email - application/x-www-form-urlencoded
 * @param {password} password.form.required - Users password - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "user": {
 * 	   "id": "d73d47b8-f25c-4d95-9da2-877063435219",
 * 	   "email": "dwad@gmail.com"
 * 	 }
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Email is missing"
 * }
 */

router.post(
	'/register',
	validateUser,
	validateFunc,
	checkEmail,
	createUser,
	createAuthToken
);

// Verify user after register

/**
 * POST /api/blog/verify-user
 * @tags Authentication
 * @summary User verification using 4 digit OTP code from email and user id from registration success response
 * @param {string} userId.form.required - Users id, From regisration response - application/x-www-form-urlencoded
 * @param {string} otp.form.required - Users otp code, From email - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "message": "User verified successfully!"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "This user is already verified"
 * }
 */

router.post('/verify-user', verifyUser);

/**
 * POST /api/blog/admin-authenticate
 * @tags Authentication
 * @summary Authentication of user without 4 digit OTP code (Admin only)
 * @param {string} token.header.required - Users token, from login response
 * @param {string} userId.form.required - Users id, From regisration response - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "message": "User authenticated by admin"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Admin role required for this action"
 * }
 */

router.post('/admin-authenticate', adminAuthenticate);

// Login

/**
 * POST /api/blog/login
 * @tags Authentication
 * @summary Login user
 * @param {string} email.form.required - Users email - application/x-www-form-urlencoded
 * @param {string} password.form.required - Users password - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "user": {
 * 	   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI0MDRkY2FkNi1lN2Q0LTRhNDktODU0YS1hYTJhM2NjNzNiMzMiLCJlbWFpbCI6InBpbmdvMTUxMDIwMDJAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiZmlyc3RuYW1lZSIsImxhc3ROYW1lIjoibGFzdG5hbWVlIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjg2NDEyNzU1fQ"
 * 	 }
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "User is not verified"
 * }
 */

router.post('/login', login);

// Posts

// Todo - Validate title and content on post create

/**
 * GET /api/blog/users
 * @tags Posts
 * @summary Returns all users from database
 * @param {string} token.header.required - Users token, from login response
 * @return {array<User>} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "data": [
 *   {
 *     "firstName": "firstname",
 *     "lastName": "test",
 *     "email": "testuser@gmail.com",
 * 	   "role": "USER"
 *   },
 *   {
 *     "firstName": "test",
 *     "lastName": "test",
 *     "email": "test@gmail.com",
 * 	   "role": "ADMIN"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Admin role required for this action"
 * }
 */

router.get('/users', getAllUsers);

/**
 * POST /api/blog/posts
 * @tags Posts
 * @summary Create a post
 * @param {string} token.header.required - Users token, from login response
 * @param {string} title.form.required - Title of post - application/x-www-form-urlencoded
 * @param {string} content.form.required - Content of post - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "message": "Success"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Title or content of post is missing"
 * }
 */

router.post('/posts', createPost);

/**
 * GET /api/blog/post-request
 * @tags Posts
 * @summary Access post requests (Admin only) - If role changes needs relogin
 * @param {string} token.header.required - Users token, from login response
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *	 "data": [
 *   {
 *     "id": 1,
 *     "ownerId": "404dcad6-e7d4-4a49-854a-aa2a3cc73b33",
 *     "title": "title",
 *     "content": "content",
 *     "timeStamp": "2023-06-10T15:08:33.000Z",
 *     "author": "Firstnamee Lastnamee",
 *     "allowed": "denied"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Title or content of post is missing"
 * }
 */

router.get('/post-request', accessPostRequests);

/**
 * POST /api/blog/post-request
 * @tags Posts
 * @summary Update post status to allowed or denied by admin (Admin only)
 * @param {string} token.header.required - Token, From login response
 * @param {string} id.form.required - Id of post - application/x-www-form-urlencoded
 * @param {string} status.form.required - Status of post to be changed to, only allowed are 'allowed' and 'denied' others wont work - application/x-www-form-urlencoded
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "message": "Post status changed by admin"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "Title or content of post is missing"
 * }
 */

router.post('/post-request', changePostStatus);

/**
 * GET /api/blog/posts
 * @tags Posts
 * @summary Get posts
 * @param {string} token.header - Token, From login response, From regisration response
 * @param {string} id.form.required - Id of post - application/x-www-form-urlencoded
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *	 "data": [
 *   {
 *     "id": 1,
 *     "ownerId": "404dcad6-e7d4-4a49-854a-aa2a3cc73b33",
 *     "title": "title",
 *     "content": "content",
 *     "timeStamp": "2023-06-10T15:08:33.000Z",
 *     "author": "Firstnamee Lastnamee",
 *     "allowed": "denied"
 *   }
 * ]
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "You dont have any posts to delete"
 * }
 */

router.get('/posts', getPosts);

/**
 * DELETE /api/blog/posts
 * @tags Posts
 * @summary Delete post
 * @param {string} token.header - Users token, from login response
 * @param {string} id.form.required - Id of post - application/x-www-form-urlencoded
 * @example response - 200 - example success response
 * {
 *   "success": true,
 *   "message": "Post with id 1 deleted"
 * }
 * @example response - 400 - example error response
 * {
 *   "sucess": false,
 *   "error": "You dont have any posts to delete"
 * }
 */

router.delete('/posts', deletePosts);

module.exports = router;
