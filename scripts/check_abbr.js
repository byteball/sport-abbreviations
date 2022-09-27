const fs = require('fs');
const request = require('request');
const dotenv = require('dotenv');
const PATH = require('path');

const { soccerCompetitions } = require("../soccerCompetitions");
const abbreviations = require('../abbreviations.json');

dotenv.config();

checkSoccerCompetitionsSequentially(soccerCompetitions);

async function checkSoccerCompetitionsSequentially(array) {
	var arrMissingAbbreviations = [];
	console.error('key', process.env.footballDataApiKey);
	request({
		url: "https://api.football-data.org/v2/competitions/" + array[0] + "/teams",
		headers: {
			'X-Auth-Token': process.env.footballDataApiKey
		}
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("\nParsing football-data.org for competition id :" + array[0]);
			var parsedBody = JSON.parse(body);
			parsedBody.teams.forEach(function (team) {
				if (!abbreviations.soccer[team.id]) {
					abbreviations.soccer[team.id] = {
						abbreviation: "",
						name: team.name
					};
					arrMissingAbbreviations.push(team.name);
				} else {
					if (!abbreviations.soccer[team.id].abbreviation || abbreviations.soccer[team.id].abbreviation.length == 0)
						arrMissingAbbreviations.push(team.name);
				}
			});

			array.shift();
			if (array[0]) {
				setTimeout(function () {
					checkSoccerCompetitionsSequentially(array)
				}, 500);

			} else {
				fs.writeFile(PATH.resolve(__dirname + "../../abbreviations.json"), JSON.stringify(abbreviations, null, '\t'), (err) => {
					if (err)
						throw Error("Could'nt write ../config/abbreviations.json" + err);
					if (arrMissingAbbreviations.length > 0) {
						console.log("Missing abbreviations:")
						arrMissingAbbreviations.forEach(function (teamName) {
							console.log(teamName);
						});
						console.log("modify 'config/abbreviations.json' to add them");
					} else {
						console.log("'config/abbreviations.json' is complete");
					}
				});
			}
		} else {
			throw Error("couldn t get competition id " + array[0] + "\n" + " " + error);
		}
	});

}
