const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendResponse } = require('../utils/helper');

exports.createPost = async (req, res) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader;

		jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const { title, content } = req.body;

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

exports.changePostStatus = async (req, res) => {
	const { status, id } = req.body;

	// Check any posts exist

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
				console.log(postStatus);
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

exports.getPosts = async (req, res) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader;

		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			// Check role of user
			console.log(user.role);
			// If role is admin get all posts
			if (user.role == 'ADMIN') {
				const getAllPost = 'SELECT * FROM posts';
				db.query(getAllPost, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
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
					return res.status(200).send({ success: true, data: result });
				});
			} else {
				// View public posts
				const getPublicPosts = `SELECT * FROM posts WHERE allowed = 'allowed'`;
				db.query(getPublicPosts, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
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
			return res.status(200).send({ success: true, data: result });
		});
	}
};

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
						console.log(result);
						return res
							.status(200)
							.send({ success: true, msg: `Post with id ${id} deleted` });
					});
				});
			}
		});
	} else {
		return sendResponse(400, 'Please add token to header', res);
	}
};
