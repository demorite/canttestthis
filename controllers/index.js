/**
 * GET /
 * Home page.
 */
exports.index = (req, res, next) => {

	res.json({ 
		welcome: 'Hello world!',
	});
}