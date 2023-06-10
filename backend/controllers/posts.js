const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendResponse } = require('../utils/helper');

/*
Create post
*/

exports.createPost = async (req, res) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader;

		jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const { title, content } = req.body;

			if (!title || !content) {
				return sendResponse(400, 'Title or content of post is missing', res);
			}

			// Generate author name based on first and last name
			const firstNameUpper =
				user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);

			const lastNameUpper =
				user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);

			const authorName = firstNameUpper + ' ' + lastNameUpper;
			// Create blog post
			const createPostQuery = `INSERT INTO posts (ownerId, title, content, author) VALUES ('${user.uid}','${title}','${content}','${authorName}')`;

			db.query(createPostQuery, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				} else {
					return sendResponse(200, 'Success', res);
				}
			});
		});
	} else {
		return sendResponse(400, 'Please set token in header', res);
	}
};

/*
Access post requests
*/

exports.accessPostRequests = async (req, res) => {
	// Check if user has role admin

	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader;

		jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			if (user.role != 'ADMIN') {
				return sendResponse(400, 'Admin role required for this action', res);
			}

			// Get all post requests (posts where status = "disabled")
			const getAllPostRequests = `SELECT * FROM posts WHERE allowed = 'denied'`;

			db.query(getAllPostRequests, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}
				return res.status(200).send({ success: true, data: result });
			});
		});
	} else {
		return sendResponse(400, 'Please set token in header', res);
	}
};

/*
Change status of post using id of post and wanted new status
*/

exports.changePostStatus = async (req, res) => {
	const { status, id } = req.body;

	// Check any posts exist

	if (status.toLowerCase() != 'allowed' && status.toLowerCase() != 'denied') {
		return sendResponse(
			400,
			'Status param is not valid only accepted options are allowed and denied',
			res
		);
	}

	const selectPosts = `SELECT * FROM posts WHERE id=${id}`;

	db.query(selectPosts, (err, result) => {
		if (err) {
			return sendResponse(400, rezult, res);
		}
		if (result.length < 1) {
			return sendResponse(400, 'No posts...', res);
		}

		const authHeader = req.headers.token;

		if (authHeader) {
			const token = authHeader;

			jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
				if (err) {
					return sendResponse(400, 'Token is invalid', res);
				}

				if (user.role != 'ADMIN') {
					return sendResponse(400, 'Admin role required for this action', res);
				}

				// If status of post is denied in req.body return post denied message
				const postStatus = status.toLowerCase();
				if (postStatus == 'denied') {
					return sendResponse(200, 'Post denied by admin :(', res);
				}
				// Set post to allowed or denied based on req.body param
				const changePostStatus = `UPDATE posts SET allowed = '${postStatus}' WHERE id = '${id}'`;
				const getOwnerIdOfPost = `SELECT ownerId FROM posts WHERE id='${id}'`;
				db.query(changePostStatus, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					// Get ownerId of sed post
					db.query(getOwnerIdOfPost, (err, result) => {
						if (err) {
							return sendResponse(400, err, res);
						}
						const changeUserRole = `UPDATE users SET role = 'BLOGGER' WHERE uid = '${result[0].ownerId}'`;
						// Change user role to blogger
						db.query(changeUserRole, (err, result) => {
							if (err) {
								return sendResponse(400, err, res);
							}
							return res
								.status(200)
								.send({ success: true, msg: 'Post status changed by admin' });
						});
					});
				});
			});
		} else {
			return sendResponse(400, 'Please set token in header', res);
		}
	});
};

/*
Get posts
*/

exports.getPosts = async (req, res) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader;

		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			// If role is admin get all posts
			if (user.role == 'ADMIN') {
				const getAllPost = 'SELECT * FROM posts';
				db.query(getAllPost, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					if (result.length < 1) {
						return sendResponse(400, 'No posts to view', res);
					}
					return res.status(200).send({ success: true, data: result });
				});
			} else if (user.role == 'BLOGGER') {
				// If role is blogger get posts based on ownerId
				const ownerId = user.uid;
				const getUserPosts = `SELECT * FROM posts WHERE ownerId = '${ownerId}'`;
				db.query(getUserPosts, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					if (result.length < 1) {
						return sendResponse(400, 'No posts to view', res);
					}
					return res.status(200).send({ success: true, data: result });
				});
			} else {
				// View public posts
				const getPublicPosts = `SELECT * FROM posts WHERE allowed = 'allowed'`;
				db.query(getPublicPosts, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					if (result.length < 1) {
						return sendResponse(400, 'No posts to view', res);
					}
					return res.status(200).send({ success: true, data: result });
				});
			}
		});
	} else {
		// User is not authenticated get all posts with flags of allowed
		const getPublicPosts = `SELECT * FROM posts WHERE allowed = 'allowed'`;
		db.query(getPublicPosts, (err, result) => {
			if (err) {
				return sendResponse(400, err, res);
			}
			if (result.length < 1) {
				return sendResponse(400, 'No posts to view', res);
			}
			return res.status(200).send({ success: true, data: result });
		});
	}
};

/*
Delete a post by given id
*/

exports.deletePosts = async (req, res) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader;

		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const { id } = req.body;
			// If role is admin get all posts
			if (user.role == 'ADMIN') {
				const getAllPost = `DELETE FROM posts WHERE id = ${id}`;
				db.query(getAllPost, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					return res.status(200).send({
						success: true,
						msg: `Post with id ${id} deleted by admin`,
					});
				});
			} else if (user.role == 'BLOGGER') {
				// If role is blogger get posts based on ownerId
				const ownerId = user.uid;
				const getUserPosts = `SELECT * FROM posts WHERE ownerId = '${user.uid}' AND id = ${id}`;
				db.query(getUserPosts, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}
					if (result.length < 1) {
						return sendResponse(400, 'You dont have any posts to delete', res);
					}

					const deletePost = `DELETE FROM posts WHERE ownerId = '${user.uid}' AND id = ${id}`;

					db.query(deletePost, (err, result) => {
						if (err) {
							return sendResponse(400, err, res);
						}
						return res
							.status(200)
							.send({ success: true, msg: `Post with id ${id} deleted` });
					});
				});
			} else {
				return sendResponse(
					400,
					'Requires role BLOGGER or ADMIN to delete a post',
					res
				);
			}
		});
	} else {
		return sendResponse(400, 'Please add token to header', res);
	}
};
