function analyzePwd(pwd) {
	var chars = {
		1: '0123456789',
		2: 'abcdefghijklmnopqrstuvwxyz',
		3: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		4: '^!"§$%&/()=?´`°{[]}\*+#-_.:,;<>|~üäöÜÄÖ'
	};
	var screeningChar = '';
	var length = pwd.length;
	var optLength = 12;
	var score = 0;
	var maxScore = 100; 
	var resultCharset = {
		1: false,
		2: false,
		3: false, 
		4: false
	};
	var counter = 0; 
	var maxPercentRepetitions = 0;
	var i = 0, j = 0;

	if (pwd == '') {
		return 0;
	}

	// Check Length of given Password
	if (length >= optLength) {
		score += 20;
	} else {
		score -= 20; 
	}

	// Check if the characters of the given password contain numbers, characters and special characters
	for (i = 0; i < length; i++) {
		if (chars[1].indexOf(pwd.substr(i, 1)) !== -1 && resultCharset[1] !== true) {
			resultCharset[1] = true; 
			score += 10;
		}
		if (chars[2].indexOf(pwd.substr(i, 1)) !== -1 && resultCharset[2] !== true) {
			resultCharset[2] = true; 
			score += 10;
		}
		if (chars[3].indexOf(pwd.substr(i, 1)) !== -1 && resultCharset[3] !== true) {
			resultCharset[3] = true; 
			score += 10;
		}
		if (chars[4].indexOf(pwd.substr(i, 1)) !== -1 && resultCharset[4] !== true) {
			resultCharset[4] = true; 
			score += 10;
		}
	}

	// search for repetitions
	for (j = 0; j < length; j++) {
		counter = 0;
		screeningChar = pwd.substr(j, 1);

		for (i = 0; i < length; i++) {
			if (screeningChar == pwd.substr(i, 1)) {
				counter++;
			}
		}
		/* we search for the highest percentage of repetitions 
		 *
		 * Example: 
		 *		Password is "abcdddabacde"
		 *			a	-	3 times		-	25.00 %
		 *			b	-	2 times		-	16.67 %
		 *			c	-	2 times		-	16.67 %
		 *			d	-	4 times		-	33.33 %
		 *			e	-	1 time		-	 8.34 %
		 */
		if (((counter*100)/length) >= maxPercentRepetitions) {
			maxPercentRepetitions = new Number((counter*100)/length);
			maxPercentRepetitions = maxPercentRepetitions.toPrecision(4);
		}
		
		if(pwd.substr(i+1, length-i-1).indexOf(pwd.substr(i, 1)) !== -1) {
			counter+=0.5;
		}
	}
	// repetitions have to be considered in relation to the given passwords length
	if (maxPercentRepetitions > 20) {
		score -= 10; 	
	} else if (maxPercentRepetitions > 35) {
		score -= 20;	
	} else if (maxPercentRepetitions > 50) {
		score -= 40;
	} else {
		score += 40;
	}

	if (score < 0) {
		score = 0;
	} else if (score > 100) {
		score = maxScore;
	}

	return score; 
}

function printAnalysis(score) {
	var selector = $('#container #output p');
	if (score >= 0 && score <= 20) {
		selector.text('very weak password');
	} else if (score > 20 && score <= 40) {
		selector.text('weak password');
	} else if (score > 40 && score <= 60) {
		selector.text('medium password');
	} else if (score > 60 && score <= 80) {
		selector.text('good password');
	} else if (score > 80 && score < 100) {
		selector.text('very good password');
	} else if (score >= maxScore) {
		selector.text('perfect password');
	} else { 
		selector.text('wrong input');
	} 
}

$(document).ready(function() {
	$('#pwdForm').submit(function(e) {
		e.preventDefault();
	});
	$('#pwdInput').on('change', function() {
		var score = 0;
		$('#output p').text('');
		score = analyzePwd($(this).val());
		printAnalysis(score);
	});
}); 
