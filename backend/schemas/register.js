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
 */