var chai = require('chai');
chai.Assertion.includeStack = true;
var should = chai.should();
var Users = require('../routes/user.js');
var app = require('../app');
var request = require('supertest');

app.set('secret', 'testMode');

describe('User Tally', function(){
	afterEach(function(done){
		request(app).del('/').send({secret: 'testMode'}).end(done);
	});

	beforeEach(function(done){
		request(app).post('/').send({secret: 'testMode', user: {'Rufus the First': true}}).end(done);
	});

	describe('GET /', function(){
		before(function(done){
			request(app).post('/').send({secret: 'testMode', user: {'Rufus the Second': false}}).end(done);
		});
		it('should respond with an array of online users', function(done){
			request(app).get('/')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function(err, res){
					if(err){
						done(err);
					} else {
						try{
							res.should.be.json;
							res.body.should.be.an.Array;
							res.body.should.have.length(1);
							res.body[0].should.equal('Rufus the First');
							done();
						} catch (e) {
							done(e);
						}
					}
				});
		});
	});

	describe('DELETE /', function(){
		it('should respond with 403 when an incorrect or no secret is sent', function(done){
			request(app).del('/').expect(403).end(function(){
				request(app).del('/', {secret: 'wrongSecret'}).expect(403, done);
			});
		});

		it('should clear the Tally when the correct secret is sent', function(done){
			request(app).del('/').send({secret: 'testMode'}).end(function(){
				request(app).get('/')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(err, res){
						if(err){
							done(err);
						} else {
							try{
								res.should.be.json;
								res.body.should.be.an.Array;
								res.body.should.have.length(0);
								done();
							} catch (e) {
								done(e);
							}
						}
					});
			});
		});
	});

	describe('POST /', function(){
		it('should respond with 403 when an incorrect of no secret is sent', function(done){
			request(app).post('/').send({user: {'Rufus the Second': true}}).expect(403).end(function(){
				request(app).post('/').send({secret: 'wrongSecret', user: {'Rufus the Second': true}}).expect(403, done);
			});
		});

		it('should push a new User to the Tally', function(done){
			request(app).post('/').send({secret: 'testMode', user: {'Rufus the Second': true}}).end(function(){
				request(app).get('/')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(err, res){
						if(err){
							done(err);
						} else {
							try{
								res.should.be.json;
								res.body.should.be.an.Array;
								res.body.should.have.length(2);
								res.body[0].should.equal('Rufus the First');
								res.body[1].should.equal('Rufus the Second');
								done();
							} catch (e) {
								done(e);
							}
						}
					});
			});
		});

		it('should be able to push multiple users to the Tally', function(done){
			request(app).post('/').send({secret: 'testMode', user: {
				'Rufus the Second': true,
				'Reginald Esquire': true,
				'Rufus the First Jr.': true
			}}).end(function(){
				request(app).get('/')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(err, res){
						if(err){
							done(err);
						} else {
							try{
								res.should.be.json;
								res.body.should.be.an.Array;
								res.body.should.have.length(4);
								res.body[0].should.equal('Rufus the First');
								res.body[1].should.equal('Rufus the Second');
								res.body[2].should.equal('Reginald Esquire');
								res.body[3].should.equal('Rufus the First Jr.');
								done();
							} catch (e) {
								done(e);
							}
						}
					});
			});
		});

		it('should update existing users', function(done){
			var firstRequest = function(callback) {
				request(app).post('/').send({secret: 'testMode', user: {'Rufus the First': true}}).expect(200).end(function(){
					request(app).get('/')
						.set('Accept', 'application/json')
						.expect(200)
						.end(function(err, res){
							if(err){
								callback(err);
							} else {
								try{
									res.should.be.json;
									res.body.should.be.an.Array;
									res.body.should.have.length(1);
									callback();
								} catch (e) {
									callback(e);
								}
							}
						});
				});
			};

			var secondRequest = function(err) {
				if(err) {
					done(err);
				} else {
					request(app).post('/').send({secret: 'testMode', user: {'Rufus the First': false}}).expect(200).end(function(){
						request(app).get('/')
							.set('Accept', 'application/json')
							.expect(200)
							.end(function(err, res){
								if(err){
									done(err);
								} else {
									try{
										res.should.be.json;
										res.body.should.be.an.Array;
										res.body.should.have.length(0);
										done();
									} catch (e) {
										done(e);
									}
								}
							});
					});
				}
			};

			firstRequest(secondRequest);
		});
	});
});