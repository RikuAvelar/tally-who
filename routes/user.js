
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
		data[key] = (val == 'Start' ? true : false);
	};
	this.clear = function() {
		data = {};
	};

	this.getAll = function() {
		return _(data).omit(function(val){
			return !val;
		}).keys().value();
	};
};

var db = new Tally();

exports.list = function(req, res){
	res.send(200, db.getAll());
};

exports.push = function(req, res){
	var user = req.body;
	if (!user.name) {
		res.send(412, {error: 412, message: 'No user was found in request body'});
	} else {
		db.set(user.name, user.status);
		res.send(200);
	}
};

exports.clearAll = function(req, res){
	db.clear();
	res.send(200);
};