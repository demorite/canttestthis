const express = require('express');
const app = express();

const PORT = 8081;


app.get("*", (req, res, next) => {
	if(res.statusCode === 200)
		res.status(404);
	res.send('<body style="' +
		'background-image: url(https://http.cat/'+res.statusCode+');' +
		'width: 100%;' +
		'height: 100vh;' +
		'background-size: contain;' +
		'background-color: black;' +
		'background-position: center;' +
		'background-repeat: no-repeat;' +
		'"></body>')
});

app.listen(PORT, function (err) {
	if (err)
		throw err;
	console.log('Listening on http://localhost:' + PORT);
});