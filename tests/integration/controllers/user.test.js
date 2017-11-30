const app = require('../../../app');
const User = require('../../../models/User');
const request = require('supertest');

require('chai').should();

describe('controllers/user.js', () => {
	let userid = null;
	
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
	
	describe("POST /users", () => {
		it('Should alert username is blank', (done) => {
			request(app)
				.post('/users')
				.then((res) => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
		
		it('should create a user', (done) => {
			User.remove({username: "Demorite"}, null).exec();
			
			request(app)
				.post('/users')
				.send({
					name: "Dylan",
					username: "Demorite"
				})
				.then((res) => {
					res.statusCode.should.eql(201);
					done();
				})
				.catch(done)
		});
		
		it('shouldn\'t create a user because it already exist', (done) => {
			request(app)
				.post('/users')
				.send({
					name: "Dylan",
					username: "Demorite"
				})
				.then((res) => {
					res.statusCode.should.eql(409);
					done();
				})
				.catch(done)
		});
		
		it('should find created user', (done) => {
			User.findOne({
				username: "Demorite"
			}).then(user => {
				userid = user._id;
				done()
			}).catch(done)
		});
	});
	
	describe("GET /users/:id", () => {
		it("Should find user", (done) => {
			request(app)
				.get(`/users/${userid}`)
				.then(res => {
					res.statusCode.should.eql(200);
					done();
				})
				.catch(done)
		})
	});
	
	describe("PUT /users/:id", () => {
		it('shouldn\'t update the User', (done) => {
			request(app)
				.put(`/users/${userid}`)
				.send({
					banana: "4ever"
				})
				.then(async res => {
					res.statusCode.should.eql(400);
					done()
				})
				.catch(done)
		});
		
		it('should update the name of the User', (done) => {
			request(app)
				.put(`/users/${userid}`)
				.send({
					name: "Florent"
				})
				.then(async res => {
					res.statusCode.should.eql(200);
					const user = await User.findOne(userid);
					user.name.should.eql('Florent');
					done()
				})
				.catch(done)
		})
	});
	
	describe("Delete /users/:id", () => {
		it(`Should delete created user`, (done) => {
			request(app)
				.delete(`/users/${userid}`)
				.then(async res => {
					res.statusCode.should.eql(200);
					const user = await User.findOne(userid);
					if(user)
						user.should.eql(null);
					done()
				})
				.catch(done)
		})
	});
	
	
});