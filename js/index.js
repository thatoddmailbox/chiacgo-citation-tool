var fields = {
	author: {
		name: "Author",
		type: "person"
	},
	title: {
		name: "Title",
		type: "string"
	},
	place_of_publication: {
		name: "Place of publication",
		type: "string"
	},
	publisher: {
		name: "Publisher",
		type: "string"
	},
	publication_date: {
		name: "Publication date",
		type: "string"
	},
	pages: {
		name: "Pages cited",
		type: "string"
	},
	website_name: {
		name: "Website name",
		type: "string"
	},
	url: {
		name: "URL",
		type: "string"
	}
};

var formats = {
	book: {
		fields: [ "author", "title", "place_of_publication", "publisher", "publication_date", "pages" ],
		bibliography: "{author:lf} {i}{title}{/i}. {place_of_publication}: {publisher}, {publication_date}.",
		footnote: "{author:fl}, {i}{title}{/i} ({place_of_publication}: {publisher}, {publication_date}), {pages}.",
		more_footnotes: "{author:l}, {i}{title}{/i}, {pages}."
	},
	website: {
		fields: [ "author", "title", "website_name", "publication_date", "url" ],
		bibliography: "{author:lf}. \"{title}.\" {i}{website_name}{/i}. {publication_date}. {url}",
		footnote: "{author:fl}, \"{title},\" {i}{website_name}{/i}, {publication_date}, {url}.",
		more_footnotes: "{author:l}, \"{title}.\""
	}
}

function selectedFormat() {
	return formats[$("#formats").val()];
}

function calculateCitation() {
	var theseFields = {};
	$(".citation-field").each(function() {
		if ($(this).attr("data-fieldType") == "person") {
			var fname = $(this).children(".fname").val();
			var lname = $(this).children(".lname").val();
			theseFields[$(this).attr("data-field") + ":fl"] = fname + " " + lname;
			theseFields[$(this).attr("data-field") + ":lf"] = lname + ", " + fname;
			theseFields[$(this).attr("data-field") + ":f"] = fname;
			theseFields[$(this).attr("data-field") + ":l"] = lname;
		} else {
			theseFields[$(this).attr("data-field")] = $(this).val();
		}
	});
	var format = selectedFormat();
	var toProcess = {
		bibliography: format.bibliography,
		footnote: format.footnote,
		more_footnotes: format.more_footnotes
	};
	for (var processIndex in toProcess) {
		for (var fieldIndex in theseFields) {
			var field = theseFields[fieldIndex];
			toProcess[processIndex] = toProcess[processIndex].replace("{" + fieldIndex + "}", field);
		}
	}
	$("#result_bibliography").text(toProcess.bibliography);
	$("#result_footnote").text(toProcess.footnote);
	$("#result_more_footnotes").text(toProcess.more_footnotes);
}

function createFields() {
	var format = selectedFormat();
	$("#fields").html("");
	for (var fieldIndex in format.fields) {
		var field = fields[format.fields[fieldIndex]];

		var $input = $('');

		if (field.type == "string") {
			$input = $('<input type="text"></input>');
			$input.attr("placeholder", field.name);
			$input.change(calculateCitation).keyup(calculateCitation);
		} else if (field.type == "person") {
			$input = $('<span class="person-container"></span>');
			$input.text(field.name + ": ");
			var $fname = $('<input type="text" class="fname" placeholder="First name (and middle initial)"></input>');
				$fname.change(calculateCitation).keyup(calculateCitation);
			$input.append($fname);
			var $lname = $('<input type="text" class="lname" placeholder="Last name"></input>');
				$lname.change(calculateCitation).keyup(calculateCitation);
			$input.append($lname);

		}

		$input.addClass("citation-field");
		$input.attr("data-field", format.fields[fieldIndex]);
		$input.attr("data-fieldType", field.type);

		$("#fields").append($input);

		$("#fields").append("<br />");
	}
}

$(document).ready(function() {
	createFields();
	$("#formats").change(createFields);
});
