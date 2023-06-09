const db = require('../db/db');
const crypto = require('crypto');

exports.sendResponse = (status, msg, res) => {
	if (status == 400) {
		return res.status(status).send({ success: false, error: msg });
	} else {
		return res.status(status).send({ success: true, data: msg });
	}
};

exports.createRandomBytes = () =>
	new Promise((resolve, reject) => {
		crypto.randomBytes(30, (err, buff) => {
			if (err) reject(err);

			const token = buff.toString('hex');
			resolve(token);
		});
	});

exports.getUserIdByEmail = async (email) => {
	const findUserByEmail = `SELECT uid FROM users WHERE email = '${email}'`;

	return new Promise((resolve, reject) => {
		db.query(findUserByEmail, (err, result) => {
			if (err) {
				reject(err);
			} else {
				if (result) {
					resolve(result[0]);
				}
			}
		});
	});
};

exports.getLoginTokenById = async (userId) => {
	const findUserByEmail = `SELECT token FROM loginTokens WHERE ownerId = '${userId}'`;

	return new Promise((resolve, reject) => {
		db.query(findUserByEmail, (err, result) => {
			if (err) {
				reject(err);
			} else {
				if (result) {
					resolve(result[0]);
				}
			}
		});
	});
};
