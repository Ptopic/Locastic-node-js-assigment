const db = require('../db/db');
const crypto = require('crypto');

/* 
Method for sending error or success responses in a easyer way
Accepts status paramether for error codes or success codes (200, 400 ect.)
Msg paramether for response message ex. "Admin role required"
Res paramether for sendering response using express res 
*/
exports.sendResponse = (status, msg, res) => {
	if (status == 400) {
		return res.status(status).send({ success: false, error: msg });
	} else {
		return res.status(status).send({ success: true, data: msg });
	}
};

/*
Creates random hash for authentication token
*/

exports.createRandomBytes = () =>
	new Promise((resolve, reject) => {
		crypto.randomBytes(30, (err, buff) => {
			if (err) reject(err);

			const token = buff.toString('hex');
			resolve(token);
		});
	});
