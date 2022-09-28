const abbreviations = require('../abbreviations.json');

const duplicateAbbreviations = {}

function checkDuplication() {
	Object.entries(abbreviations.soccer).forEach(([id, { abbreviation }]) => {
		if (duplicateAbbreviations[abbreviation]) {
			duplicateAbbreviations[abbreviation] = duplicateAbbreviations[abbreviation] + 1;
		} else {
			duplicateAbbreviations[abbreviation] = 1;
		}
	})
}

checkDuplication();

Object.keys(duplicateAbbreviations).forEach((abr) => {
	if (duplicateAbbreviations[abr] === 1) {
		delete duplicateAbbreviations[abr];
	}
})

console.error('duplicate abbreviations', duplicateAbbreviations);

