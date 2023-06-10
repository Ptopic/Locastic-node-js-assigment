const db = require('../db/db');
const jwt = require('jsonwebtoken');

const { sendResponse } = require('../utils/helper');

exports.getAllUsers = async (req, res) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader;

		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return sendResponse(400, 'Token is invalid', res);
			}

			const getAllUsersQuery = `SELECT firstName, lastName, email, role FROM users`;
			db.query(getAllUsersQuery, (err, result) => {
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
