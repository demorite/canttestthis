const app = require('../../../app');
const request = require('supertest');

require('chai').should();

describe('controllers/index.js', () => {
	describe('get /', () => {
		it('should be OK', (done) => {
			request(app)
				.get('/')
				.then((res) => {
					res.statusCode.should.eql(200);
					JSON.parse(res.text).should.be.an('object');
					done();
				})
				.catch(done)
		})
	});
});