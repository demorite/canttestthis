const express = require('express');
const app = express();
const PORT = process.env.PORT || 8083;

app.get('/', (req, res, next) => {
	res.send('Bonjour');
});

app.use((req, res, next) => {
	res.status(404);
	return res.send(`<body style="width: 100%;height: 100vh; background-size: contain;background: black url(https://http.cat/${res.statusCode}) no-repeat center;"></body>`)
});

app.listen(PORT, (err) => {
	if(err)
		throw err;
	console.log()
});

module.exports = app;