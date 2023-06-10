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

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - uid
 *              - isVerified
 *              - email
 *              - password
 *              - firstName
 *              - lastName
 *              - role
 *          properties:
 *              uid:
 *                  type: string
 *                  description: Auto-generated id for user
 *              isVerified:
 *                  type: integer
 *                  description: Verification status for user (1 is verified, 0 not verified)
 *              email:
 *                  type: string
 *                  description: Email associated to users account
 *              password:
 *                  type: string
 *                  description: Users password
 *              firstName:
 *                  type: string
 *                  description: Firstname of user
 *              lastName:
 *                  type: string
 *                  description: Lastname of user
 *              role:
 *                  type: string
 *                  description: Role of user (USER, BLOGGER, ADMIN)
 *          example:
 *              uid: 3213dwda231
 *              isVerified: 1
 *              email: email@gmail.com
 *              password: $2b$08$g.CFmLC0J1tjxwwVijvHUecxLIaC2RqjVVsoA9ueT1g
 *              firstName: first
 *              lastName: last
 *              role: BLOGGER
 *      Post:
 *          type: object
 *          required:
 *              - id
 *              - ownerId
 *              - title
 *              - content
 *              - timeStamp
 *              - author
 *              - allowed
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Auto-generated id for user
 *              ownerId:
 *                  type: string
 *                  description: ID of user which created that post
 *              title:
 *                  type: string
 *                  description: Title of post
 *              content:
 *                  type: string
 *                  description: Content of post
 *              timeStamp:
 *                  type: date
 *                  description: Date and time when post was created
 *              author:
 *                  type: string
 *                  description: First and last name of user which created a post
 *              allowed:
 *                  type: string
 *                  description: Is post allowed by admin ('allowed', 'denied')
 *          example:
 *              id: 1
 *              ownerId: 3213dwda231
 *              title: Awesome blog post
 *              content: Content of blog post.
 *              timeStamp: date
 *              author: Firstname Lastname
 *              allowed: denied
 *      registerSucess:
 *          type: object
 *          required:
 *              - sucess
 *              - data
 *          properties:
 *              sucess:
 *                  type: string
 *                  description: "true"
 *              data:
 *                  type: string
 *                  description: data
 *          example:
 *              sucess: "true"
 *              data: "data"
 */

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: Methods for registering, verifying and loging in a user
 */

/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: Methods for creating updating and getting blog posts
 */

// Register user

/**
 * @swagger
 * /api/blog/register:
 *  post:
 *      summary: Registers user to database
 *      tags: [Authentication]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          firstName:
 *                              type: string
 *                              default: firstname
 *                          lastName:
 *                              type: string
 *                              default: lastname
 *                          email:
 *                              type: string
 *                              default: test@gmail.com
 *                          password:
 *                              type: string
 *                              default: ""
 *     responses:
 *     	200:
 *     		description: Success
 *        	content:
 *          	application/json:
 *            		schema:
 *              		$ref: '#/components/schemas/registerSucess'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

router.post(
	'/register',
	validateUser,
	validateFunc,
	checkEmail,
	createUser,
	createAuthToken
);

/**
 * @swagger
 * /api/blog/verify-user:
 *  post:
 *      summary: Verify user with 4 digit OTP from email
 *      tags: [Authentication]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userId:
 *                              type: string
 *                              default: 312312dwad
 *                          otp:
 *                              type: string
 *                              default: 1234
 *      responses:
 *           200:
 *              description: The list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              message:
 *                                  type: string
 */

// Verify user after register

router.post('/verify-user', verifyUser);

/**
 * @swagger
 * /api/blog/admin-authenticate:
 *  post:
 *      summary: Authenticate user without 4 digit OTP code (Admin only)
 *      tags: [Authentication]
 *      parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            required: true
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          uid:
 *                              type: string
 *                              default: 404dcad6-e7d4-4a49-854a-aa2a3cc73b33
 *      responses:
 *          '200':
 *              description: The list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              message:
 *                                  type: string
 */

router.post('/admin-authenticate', adminAuthenticate);

// Login

/**
 * @swagger
 * /api/blog/login:
 *  post:
 *      summary: Loges in user with his email and password - Returns a JWT token used for later authentication
 *      tags: [Authentication]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              default: test@gmail.com
 *                          password:
 *                              type: string
 *                              default: password
 *      responses:
 *          '200':
 *              description: The list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              data:
 *                                  type: object
 *
 */

router.post('/login', login);

// Posts

/**
 * @swagger
 * /api/blog/users:
 *  get:
 *      summary: Returns all users from database
 *      tags: [Posts]
 *      parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            required: true
 *      responses:
 *          '200':
 *              description: The list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              data:
 *                                  type: object
 */
// Todo - Validate title and content on post create
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/blog/posts:
 *  post:
 *      summary: Creates a post
 *      tags: [Posts]
 *      parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            required: true
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          content:
 *                              type: string
 *                              default: Title of post
 *                          title:
 *                              type: string
 *                              default: Content of post
 *      responses:
 *          '200':
 *              description: The list of users
 *              content:
 *                  application/json:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              data:
 *                                  type: object
 */
router.post('/posts', createPost);

/**
 * @swagger
 * /api/blog/post-request:
 *  get:
 *      summary: Access post requests (Admin only) - If role changes needs relogin
 *      tags: [Posts]
 *      parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            required: true
 *      responses:
 *          '200':
 *              description: The list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              data:
 *                                  type: object
 */
router.get('/post-request', accessPostRequests);

/**
 * @swagger
 * /api/blog/post-request:
 *  post:
 *      summary: Update post status to allowed or denied by admin (Admin only)
 *      tags: [Posts]
 *      parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            required: true
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                              default: "allowed"
 *                          id:
 *                              type: integer
 *                              default: 1
 *      responses:
 *          '200':
 *              description: The list of users
 *              content:
 *                  application/json:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              data:
 *                                  msg: string
 */

router.post('/post-request', changePostStatus);

/**
 * @swagger
 * /api/blog/posts:
 *  get:
 *      summary: Get posts
 *      tags: [Posts]
 *      parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            required: true
 *      responses:
 *          '200':
 *              description: The list of users
 *              content:
 *                  application/json:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              data:
 *                                  msg: object
 */
router.get('/posts', getPosts);

/**
 * @swagger
 * /api/blog/posts:
 *  delete:
 *      summary: Delete post
 *      tags: [Posts]
 *      parameters:
 *          - in: header
 *            name: token
 *            type: string
 *            required: true
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              default: 1
 *      responses:
 *          '200':
 *              description: The list of users
 *              content:
 *                  application/json:
 *                          type: object
 *                          properties:
 *                              sucess:
 *                                  type: string
 *                              data:
 *                                  msg: string
 */

router.delete('/posts', deletePosts);

module.exports = router;
