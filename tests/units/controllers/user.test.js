const app = require('../../../app');
const request = require('supertest');

require('chai').should();

describe('controllers/user.js', () => {
	[
		{url: '/users'},
		{url: '/users/999', code: 404, message: 'should be NO CONTENT'},
	].map((route) => {
		describe(`get ${route.url}`, () => {
			it(route.message || 'should be OK', (done) => {
				request(app)
					.get(route.url)
					.then((res) => {
						res.statusCode.should.eql(route.code || 200);
						if (res.statusCode === 200)
							JSON.parse(res.text).should.be.an('object');
						done();
					})
					.catch(done)
			})
		});
	});
	
	xdescribe("POST /users", () => {
		it('should create a user', (done) => {
			request(app)
				.post('/users')
				.catch(done)
		})
	});
	
	xdescribe("PUT /users/:id", () => {
	
	});
	
	xdescribe("Delete /users/:id", () => {
	
	});
	
	
});