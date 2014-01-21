module.exports = function(getSecret){
	return function(req, res, next) {
		if(req.method == 'DELETE' || req.method == 'POST') {
			if(req.header('X-Auth-Token') == getSecret()) {
				next();
			} else {
				res.send(403, {error: 403, message: 'Invalid Secret'});
			}
		} else {
			next();
		}
	}
}