const epxress = require('express');
const app = epxress();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const port = 3001;

require('dotenv').config();

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Blog api',
			description: 'API for blog website made with express',
		},
		servers: [
			{
				url: 'http://localhost:3001',
			},
		],
	},
	apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

const blogsRouter = require('./routes/blog');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(epxress.json());
app.use(cors());

app.use('/api/blog', blogsRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
