const db = require('../db/db');
const jwt = require('jsonwebtoken');

const { sendResponse } = require('../utils/helper');

/*
Get all users
No role restrictions
Needs only token of user
*/

exports.getAllUsers = async (req, res) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		// Save token from header
		const token = authHeader;

		// Verify jwt token from header
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			// Send response if token is invalid
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			// Get all users from database
			const getAllUsersQuery = `SELECT firstName, lastName, email, role FROM users`;
			db.query(getAllUsersQuery, (err, result) => {
				if (err) {
					return sendResponse(400, err, res);
				}
				// Send users as a response
				return res.status(200).send({ success: true, data: result });
			});
		});
	} else {
		// Send error response if no token is provided
		return sendResponse(400, 'Please set token in header', res);
	}
};
