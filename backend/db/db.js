const mysql = require('mysql2');

/*
Database options
Needs to be passed into .env file for sql querys to work
*/

const db = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	multipleStatements: true,
});

module.exports = db;
