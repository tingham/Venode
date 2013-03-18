/*global process, console */
var mongodb = require("mongodb").MongoClient,
	dsn = "", // From cli
	query = ""; // From cli

process.argv.forEach(
	function (val, index, array) {
		"use strict";
		if (val.indexOf("--dsn") > -1) {
			dsn = val.split("=")[1];
		}
	}
);

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
	"use strict";
	query += chunk;
});

process.stdin.on('end', function () {
	"use strict";
	var commandUri = [],
		finalCollection = "",
		finalCommand = "",
		finalQuery = "",
		extractCollection = /^db\.(\w+)/,
		extractCommand = /\.(\w+)\(/,
		extractQuery = /\((.*)\)/;
	
	console.log("here");

	finalCollection = extractCollection.exec(query)[1];
	finalCommand = extractCommand.exec(query)[1];
	finalQuery = extractQuery.exec(query)[1];

	mongodb.connect(dsn, function (err, db) {

		if (err) {
			console.log("Fail");
			return;
		}

		db.collection(finalCollection, function (err, collection) {
			if (err) {
				console.log("Fail");
				return;
			}

			// convert query to object
			finalQuery = JSON.parse(finalQuery);
			console.log("finalQuery", finalQuery);
			console.log("Executing", finalQuery, "on", finalCollection, finalCommand);

			collection[finalCommand](finalQuery, function (err, result) {
				var r;

				result.each(function (err, doc) {
					if (err) {
						console.log("Fail");
						return;
					}

					console.log(doc);

					// exit if doc is null
					// cursor has been exhausted
					if (!doc) {
						process.exit();
					}
				});

				return;
			});
		});
	});
});
