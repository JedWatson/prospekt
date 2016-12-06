module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}

	let body = req.body;

	if(req.user.role.key === 'contributor') {
		body = Object.assign({}, body, {
			isDraft: true,
		});
	}

	var item = new req.list.model();
	req.list.updateItem(item, body, {
		files: req.files,
		ignoreNoEdit: true,
		user: req.user,
	}, function (err) {
		if (err) {
			var status = err.error === 'validation errors' ? 400 : 500;
			var error = err.error === 'database error' ? err.detail : err;
			return res.apiError(status, error);
		}
		res.json(req.list.getData(item));
	});
};
