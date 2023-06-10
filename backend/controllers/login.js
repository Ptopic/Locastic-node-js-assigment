const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendResponse } = require('../utils/helper');

/*
Route - Login user
*/
exports.login = async (req, res) => {
	const { email, password } = req.body;

	// Check if data is passed
	if (!email.trim() || !password.trim()) {
		return sendResponse(400, 'Email/password missing!', res);
	} else {
		// Check if user with that email exists
		const findByEmailQuery = `SELECT * FROM users WHERE email='${email}'`;

		db.query(findByEmailQuery, async (err, result) => {
			if (err) {
				return sendResponse(400, err, res);
			}

			const user = result[0];

			// Check if user is found
			if (!user) {
				return sendResponse(400, 'User not found', res);
			}

			// Check if user is verified
			if (!user.isVerified) {
				return sendResponse(400, 'User is not verified', res);
			} else {
				// Compare given password to hashed password in database
				const userPassword = user.password;
				const isPasswordValid = await bcrypt.compareSync(
					password,
					userPassword
				);

				// Check if password is valid
				if (!isPasswordValid) {
					return sendResponse(400, 'Wrong password', res);
				}

				const accessToken = jwt.sign(
					{
						uid: user.uid,
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						role: user.role,
					},
					process.env.JWT_SECRET
				);

				console.log(accessToken);

				return res
					.status(200)
					.send({ success: true, data: { token: accessToken } });
			}
		});
	}
};
