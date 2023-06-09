const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
	sendResponse,
	getUserIdByEmail,
	getLoginTokenById,
} = require('../utils/helper');

exports.login = async (req, res) => {
	const { email, password } = req.body;

	// Check if data is passed

	if (!email.trim() || !password.trim())
		sendResponse(400, 'Email/password missing!', res);

	// Check if user with that email exists
	const findByEmailQuery = `SELECT * FROM users WHERE email='${email}'`;

	db.query(findByEmailQuery, async (err, result) => {
		if (err) {
			sendResponse(400, err, res);
		}

		// Check if password is correct
		const user = result[0];

		console.log(user);

		if (!user) {
			sendResponse(400, 'User not found', res);
		}

		if (!user.isVerified) {
			sendResponse(400, 'User is not verified', res);
		}

		const userPassword = user.password;
		const isPasswordValid = await bcrypt.compareSync(password, userPassword);

		if (!isPasswordValid) {
			sendResponse(400, 'Wrong password', res);
		}

		const uid = uuidv4();
		const dateNow = new Date();
		const stringDate = dateNow.toISOString();
		const isoDate = new Date(stringDate);
		const date = isoDate.toJSON().slice(0, 19).replace('T', ' ');
		console.log(date);
		const ownerId = user.uid;

		// // Check if token exists
		// const tokenExists = await getLoginTokenById(ownerId);

		// if (tokenExists) {
		// 	return res
		// 		.status(200)
		// 		.send({ success: true, data: { token: tokenExists.token } });
		// }
		// Generate auth token for logedin user
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

		res.status(200).send({ success: true, data: { token: accessToken } });
		// // Save token to db
		// const insertTokenQuery = `INSERT INTO loginTokens (uid, createdAt, ownerId,token) VALUES ('${uid}', '${date}', '${ownerId}', '${accessToken}')`;

		// db.query(insertTokenQuery, (err, result) => {
		// 	if (err) {
		// 		sendResponse(400, err, res);
		// 	} else {
		// 		res.status(200).send({ success: true, data: { token: accessToken } });
		// 	}
		// });
		// console.log(uid, date, ownerId, accessToken, isPasswordValid);
	});
};
