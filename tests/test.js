var venode = require("../venode-lib.js");

exports.exportTest = function (test) {
	"use strict";
	test.expect(2);

	// verify the results were returned
	var callback = function (err, results) {
		test.ok(results, "Results should be returned");
		test.ok(!err, "No error");
		test.done();
	};

	venode.executeQuery(
		"mongodb://localhost/testdb",
		"db.Sprocket.find({ name: /Handy/ }).sort({ price: -1 })",
		callback
	);
};
