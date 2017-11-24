const cart = require('../../../controllers/cart');
const request = require('supertest');
const app = require('../../../app');
const User = require('../../../models/User');
const Cart = require('../../../models/Cart');

describe('controllers/cart.js', () => {
	let cartId;
	
	beforeEach("Add user", async () => {
		await User.create({
			name: "Dylan",
			username: "Demorite"
		})
	});
	
	afterEach("Delete User", async () => {
		await User.remove({
			username: "Demorite"
		}).exec();
	});
	
	describe('GET /carts', () => {
		it("Should list carts", (done) => {
			request(app)
				.get('/carts')
				.then(res => {
					res.statusCode.should.eql(200);
					try {
						const carts = JSON.parse(res.text);
						carts.carts.should.be.an('Array')
					} catch (err) {
						throw err
					}
					done();
				})
				.catch(done)
		});
	});
	
	describe('GET /carts/999', () => {
		it("Should list carts", (done) => {
			request(app)
				.get('/carts/999')
				.then(res => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
	});
	
	describe('POST /carts', () => {
		beforeEach("delete carts", async () => {
			await Cart.remove({}).exec();
		});
		
		it("Should say something if articles is empty", done => {
			request(app)
				.post('/carts')
				.send({
					name: "Supermarket",
					username: "Demorite",
					articles: []
				})
				.then(res => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
		
		it("Should say user don\'t exist", done => {
			request(app)
				.post('/carts')
				.send({
					name: "Supermarket",
					username: "BananaMan",
					articles: ["banana"]
				})
				.then(res => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
		
		it("Should add cart", done => {
			request(app)
				.post('/carts')
				.send({
					name: "Supermarket",
					username: "Demorite",
					articles: ["Banana"]
				})
				.then(async res => {
					res.statusCode.should.eql(201);
					const cart = await Cart.findOne({
						owner: "Demorite"
					});
					cart.should.be.an("Object");
					cartId = cart._id;
					done();
				})
				.catch(done)
		});
	});
	
	describe('GET /carts/:id', () => {
		it("Should get cart", (done) => {
			request(app)
				.get(`/carts/${cartId}`)
				.then(res => {
					res.statusCode.should.eql(200);
					done();
				})
				.catch(done)
		});
		
		
		it("Shouldn\'t get cart", (done) => {
			request(app)
				.get(`/carts/5a183864ee5e2701c32811fb`)
				.then(res => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
	});
	
	describe('PUT /carts/:id/articles', () => {
		it("Should say articles field is blank", (done) => {
			request(app)
				.put(`/carts/${cartId}/articles`)
				.then(res => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
		it("Should add article", (done) => {
			request(app)
				.put(`/carts/${cartId}/articles`)
				.send({
					articles: ["banana", "cocoa"]
				})
				.then(res => {
					res.statusCode.should.eql(200);
					done();
				})
				.catch(done)
		});
		
		it("Should not find the cart", (done) => {
			request(app)
				.put(`/carts/5a183864ee5e2701c32811fb/articles`)
				.send({
					articles: ["banana", "cocoa"]
				})
				.then(res => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
	});
	
	describe('PUT /carts/:id/articles/:id_article/flag', () => {
		it("Should say flag field is blank", (done) => {
			request(app)
				.put(`/carts/${cartId}/articles/0/flag`)
				.then(res => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
		
		it("Should add article", (done) => {
			Cart.findOne(cartId).then(cart => {
				request(app)
					.put(`/carts/${cartId}/articles/${cart.articles[0]._id}/flag`)
					.send({
						flag: "Banana"
					})
					.then(res => {
						res.statusCode.should.eql(200);
						done();
					}).catch(done)
			}).catch(done)
		});
		
		it("Should not find the cart", (done) => {
			request(app)
				.put(`/carts/5a183864ee5e2701c32811fb/articles/0/flag`)
				.send({})
				.then(res => {
					res.statusCode.should.eql(404);
					done();
				})
				.catch(done)
		});
	});
	
	describe('DELETE /carts/:id', () => {
		it("Should delete cart", (done) => {
			request(app)
				.delete(`/carts/${cartId}`)
				.send({})
				.then(res => {
					res.statusCode.should.eql(200);
					done();
				})
				.catch(done)
		});
	});
	
});