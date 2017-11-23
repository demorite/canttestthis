process.env.PORT = 8084;
const app = require('../app');
const chai = require('chai');
const request = require('supertest');
chai.should();

describe('app.js', () => {
	describe('#get /', () => {
		it('should return 200 and a body', () => {
			request(app).get('/')
				.then((res) => {
					res.statusCode.should.be.eql(200);
					res.text.should.be.a('string');
				});
		})
	});
	
	describe('#get not found', () => {
		it('should return 404 and a body', () => {
			request(app).get('/notfound')
				.then((res) => {
					res.statusCode.should.be.eql(404);
					res.text.should.be.a('string');
				});
		});
		
	})
});