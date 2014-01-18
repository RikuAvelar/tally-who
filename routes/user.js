
/*
 * User listing.
 */
var asset = require('path').join.bind(null, __dirname, '..');
var _ = require('lodash');

var Tally = function Tally() {
	var data = {};
	this.get = function(key) {
		return data.key;
	};
	this.set = function(key, val) {
		data[key] = val;
	};
	this.clear = function() {
		data = {};
	};

	this.getAll = function() {
		return _.compact(data);
	};
};

var db = new Tally();

exports.list = function(req, res){
	res.send(200, db.getAll());
};

exports.push = function(req, res){
	var user = req.body.user;
	db.set(user.name, user.status);
};

exports.clearAll = function(){
	db.clear();
};