var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
it('should remove and return item on delete', function(done){
    chai.request(app)
        .delete('/items/1')
        .end(function(err, res){
           should.equal(err, null); 
           res.should.have.status(201);
           res.should.be.json;
           res.body.should.be.a('array');
           storage.items.should.have.length(3);
           done();
        });
    });
it("should return item not found for non-existent id", function(done){
    chai.request(app)
        .delete('/items/5')
        .end(function(err, res){
            res.should.have.status(400);
            done();
        });
})
it('should change the name of the object on update', function(done){
    chai.request(app)
        .put('/items/0')
        .send({'name': 'Kale', 'id': 0})
        .end(function(err, res){
          should.equal(err, null);
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.name.should.equal('Kale');
          res.body.id.should.equal(0);
          done(); 
        });
})
it('should add an object when the id is non-existent on update', function(done){
    chai.request(app)
        .put('/items/5')
        .send({'name': 'blueberries', 'id': 5})
        .end(function(err, res){
           should.equal(err, null);
           res.should.have.status(201);
           res.body.should.be.a('object');
           res.body.name.should.equal('blueberries');
           res.body.id.should.equal(5);
           done();
        });
})
