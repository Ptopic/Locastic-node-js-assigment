const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
	generateOtp,
	mailTransport,
	generateEmailTemplate,
} = require('../utils/mail');

const { sendResponse } = require('../utils/helper');

exports.checkEmail = async (req, res, next) => {
	const { firstName, lastName, email, password } = req.body;
	const checkEmailQuery = `SELECT * FROM users WHERE email = '${email}'`;

	db.query(checkEmailQuery, (err, result) => {
		if (result) {
			if (result.length < 1) {
				next();
			} else {
				return sendResponse(400, 'Email is already taken', res);
			}
		}
	});
};

exports.createUser = async (req, res, next) => {
	const { firstName, lastName, email, password } = req.body;

	const hash = await bcrypt.hash(password, 8);
	const uid = uuidv4();
	const sqlInsertUser = `INSERT INTO users (uid, email, password, firstName, lastName) VALUES ('${uid}', '${email}', '${hash}', '${firstName}', '${lastName}')`;

	db.query(sqlInsertUser, (err, result) => {
		if (err) {
			return sendResponse(400, err, res);
		}
		res.locals.uid = uid;
		res.locals.email = email;
		next();
	});
};

exports.createAuthToken = async (req, res) => {
	const uid = uuidv4();
	const ownerId = res.locals.uid;
	const dateNow = new Date();
	const stringDate = dateNow.toISOString();
	const isoDate = new Date(stringDate);
	const date = isoDate.toJSON().slice(0, 19).replace('T', ' ');
	console.log(date);

	const OTP = generateOtp(res);
	console.log(OTP);
	const hashedOTP = await bcrypt.hash(OTP, 8);

	// Send auth email
	const mailOptions = {
		from: 'email@email.com',
		to: res.locals.email,
		subject: 'Verify your email',
		html: generateEmailTemplate(OTP),
	};
	mailTransport().sendMail(mailOptions, function (err, info) {
		if (err) {
			return sendResponse(400, err, res);
		}
	});

	const sqlInsert = `INSERT INTO authTokens
	    (uid, createdAt, ownerId, token)
	    VALUES ('${uid}', '${date}', '${ownerId}', '${hashedOTP}')`;

	db.query(sqlInsert, (err, result) => {
		if (err) {
			return sendResponse(400, err.code, res);
		}
		return res.status(200).json({
			success: true,
			user: {
				id: res.locals.uid,
				email: res.locals.email,
				name: res.locals.name,
			},
		});
	});
};

exports.verifyUser = async (req, res) => {
	const { userId, otp } = req.body;

	if (!userId || !otp.trim())
		return res.status(400).send({
			success: false,
			error: 'Invalid request, missing otp or userId',
		});

	// Find user and
	const findUserQuery = `SELECT * FROM users WHERE uid = "${userId}"`;
	const findQueryTokens = `SELECT * FROM authTokens WHERE ownerId = "${userId}"`;
	db.query(findUserQuery, async (err, result) => {
		if (err) {
			return res.status(400).send({ success: false, error: err.code });
		}

		if (result[0] == undefined) {
			return res
				.status(400)
				.send({ success: false, error: 'user or token not found' });
		}

		res.locals.user = result[0];
		db.query(findQueryTokens, async (err, result) => {
			if (err) {
				return res.status(400).send({ success: false, error: err.code });
			}

			if (result[0] == undefined) {
				return res
					.status(400)
					.send({ success: false, error: 'user or token not found' });
			}
			res.locals.token = result[0];

			if (res.locals.user.isVerified)
				return res
					.status(400)
					.send({ success: false, error: 'This user is already verified' });

			// Compare given otp to user otp
			const compareTokens = bcrypt.compareSync(otp, res.locals.token.token);

			if (!compareTokens)
				return res
					.status(400)
					.send({ success: false, error: 'Please provide a valid token' });

			// set user isVerified to true
			const verifyChangeQuery = `UPDATE users SET isVerified = 1 WHERE uid = "${userId}"`;

			db.query(verifyChangeQuery, (err, result) => {
				if (err) {
					return res.status(400).send({
						success: false,
						error: 'User verification status cant be changed',
					});
				}

				// Delete token row from authTokens db

				const deleteAuthTokenQuery = `DELETE FROM authTokens WHERE ownerId = "${userId}"`;

				db.query(deleteAuthTokenQuery, (err, result) => {
					if (err) {
						return res.status(400).send({
							success: false,
							error: 'Unable to delete auth token from db',
						});
					}
				});

				// Get user email to send verified notifcation to
				console.log(res.locals.user.email);
				// Send email verified email
				const mailOptions = {
					from: 'email@email.com',
					to: res.locals.user.email,
					subject: 'Email verified',
					html: '<h1>Verified</h1>',
				};
				mailTransport().sendMail(mailOptions, function (err, info) {
					if (err) {
						console.log(err);
					} else {
						res.json({ success: true, message: 'User verified successfully!' });
					}
				});
			});
		});
	});
};

exports.adminAuthenticate = async (req, res) => {
	const { uid } = req.body;

	// Check any posts exist

	const selectPosts = `SELECT * FROM users WHERE uid='${uid}'`;

	db.query(selectPosts, (err, result) => {
		if (err) {
			return sendResponse(400, err, res);
		}
		if (result.length < 1) {
			return sendResponse(400, 'No users with given id...', res);
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

				const authenticateUser = `UPDATE users SET isVerified = '1' WHERE uid = '${uid}'`;

				db.query(authenticateUser, (err, result) => {
					if (err) {
						return sendResponse(400, err, res);
					}

					return res
						.status(200)
						.send({ success: true, msg: 'User authenticated by admin' });
				});
			});
		} else {
			return sendResponse(400, 'Please set token in header', res);
		}
	});
};
