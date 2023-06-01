// ==UserScript==
// @name             GameTracker Time Played with Switch Mode
// @namespace        http://www.tampermonkey.net/
// @homepage         https://greasyfork.org/ro/scripts/465218-gametracker-time-played
// @version          2.6
// @description      Displays the time played in different formats and provides a switch mode for a player on GameTracker.
// @match            https://www.gametracker.com/player/*
// @icon             https://www.gametracker.com/images/icons/icon16x16_gt.png
// @grant            none
// @require          https://code.jquery.com/jquery-3.6.0.min.js
// @require          https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js
// @source           https://raw.githubusercontent.com/ALeX400/UserScripts/main/GameTrackerTimePlayed.js
// @license          MIT
// ==/UserScript==


(function () {
	'use strict';

	function setCookie(cname, cvalue) {
		document.cookie = cname + "=" + cvalue + ";path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	var mode = getCookie("timeDisplayMode");
	if (!mode) {
		setCookie("timeDisplayMode", "days");
		mode = "days";
	}

	const sectionTitles = document.querySelectorAll('div.section_title');
	for (const sectionTitle of sectionTitles) {
		if (sectionTitle.textContent.includes("ALL TIME STATS")) {
			const itemColorTitles = sectionTitle.parentElement.querySelectorAll('span.item_color_title');
			for (const title of itemColorTitles) {
				if (title.textContent.includes("Minutes Played:")) {
					const minutesPlayedText = title.nextSibling;
					const minutesPlayed = parseInt(minutesPlayedText.textContent, 10);
					const timePlayedInDays = convertMinutesToDaysHoursMinutes(minutesPlayed);
					const timePlayedInYears = convertMinutesToYearsMonthsDaysHoursMinutes(minutesPlayed);
					const timePlayedStringInDays = formatTimePlayedString(timePlayedInDays);
					const timePlayedStringInYears = formatTimePlayedString(timePlayedInYears);

					const separator = "\n\t\t\t\t\t\t\t";

					const itemFloatRight = document.querySelector('.item_float_right.item_w300');

					const totalTimeDiv = document.createElement('div');
					totalTimeDiv.classList.add('item_float_left');
					const totalTimeTitleDiv = document.createElement('div');
					totalTimeTitleDiv.classList.add('section_title');
					totalTimeTitleDiv.textContent = 'TOTAL TIME';
					totalTimeDiv.appendChild(totalTimeTitleDiv);

					// Restul codului de creare a elementelor interioare ale div-ului "TOTAL TIME"
					const totalTimeTitleSpan = document.createElement('span');
					totalTimeTitleSpan.classList.add('item_color_title');
					const totalTimeText = document.createTextNode(`${separator}Total Time:${separator}`);
					totalTimeTitleSpan.appendChild(totalTimeText);

					const totalTimeNumInDays = document.createElement('span');
					totalTimeNumInDays.appendChild(document.createTextNode(`${separator}${timePlayedStringInDays}${separator}`));
					const totalTimeNumInYears = document.createElement('span');
					totalTimeNumInYears.appendChild(document.createTextNode(`${separator}${timePlayedStringInYears}${separator}`));

					const switchButton = document.createElement('button');
					switchButton.style.marginLeft = '10px';
					switchButton.style.background = 'none';
					switchButton.style.border = 'none';
					const switchIcon = document.createElement('i');
					switchIcon.className = 'fas fa-exchange-alt';
					switchIcon.style.color = '#808080';
					switchButton.appendChild(switchIcon);
					switchButton.onclick = function () {
						if (mode == "days") {
							setCookie("timeDisplayMode", "years");
							mode = "years";
							totalTimeNumInDays.style.display = 'none';
							totalTimeNumInYears.style.display = 'inline';
						} else {
							setCookie("timeDisplayMode", "days");
							mode = "days";
							totalTimeNumInYears.style.display = 'none';
							totalTimeNumInDays.style.display = 'inline';
						}
					};

					const copyButton = document.createElement('button');
					copyButton.style.marginLeft = '10px';
					copyButton.style.background = 'none';
					copyButton.style.border = 'none';
					const copyIcon = document.createElement('i');
					copyIcon.className = 'fas fa-copy';
					copyIcon.style.color = '#808080';
					copyButton.appendChild(copyIcon);
					copyButton.onclick = function () {
						const textToCopy = (mode == "days" ? timePlayedStringInDays : timePlayedStringInYears);
						navigator.clipboard.writeText(textToCopy).then(function () {
							console.log('Copying to clipboard was successful!');
						}, function (err) {
							console.error('Could not copy text: ', err);
						});
					};

					totalTimeDiv.appendChild(totalTimeTitleSpan);
					totalTimeDiv.appendChild(totalTimeNumInDays);
					totalTimeDiv.appendChild(totalTimeNumInYears);
					totalTimeDiv.appendChild(switchButton);
					totalTimeDiv.appendChild(copyButton);
					totalTimeNumInYears.style.display = 'none';

					const itemFloatClearDiv = document.createElement('div');
					itemFloatClearDiv.classList.add('item_float_clear');

					const itemH10Div = document.createElement('div');
					itemH10Div.classList.add('item_h10');
					

					itemFloatRight.parentElement.insertBefore(itemFloatClearDiv, itemFloatRight.nextSibling);
					itemFloatRight.parentElement.insertBefore(itemH10Div, itemFloatClearDiv.nextSibling);
					itemFloatRight.parentElement.insertBefore(totalTimeDiv, itemH10Div.nextSibling);					

					break;
				}
			}
			break;
		}
	}

	function convertMinutesToDaysHoursMinutes(minutes) {
		const minutesInHour = 60;
		const hoursInDay = 24;
		const minutesInDay = minutesInHour * hoursInDay;
		const days = Math.floor(minutes / minutesInDay);
		const hours = Math.floor((minutes % minutesInDay) / minutesInHour);
		const remainingMinutes = minutes % minutesInHour;
		return {
			days: days,
			hours: hours,
			minutes: remainingMinutes
		};
	}

	function convertMinutesToYearsMonthsDaysHoursMinutes(minutes) {
		const minutesInHour = 60;
		const hoursInDay = 24;
		const daysInMonth = 30;
		const monthsInYear = 12;
		const minutesInDay = minutesInHour * hoursInDay;
		const minutesInMonth = minutesInDay * daysInMonth;
		const minutesInYear = minutesInMonth * monthsInYear;
		const years = Math.floor(minutes / minutesInYear);
		const months = Math.floor((minutes % minutesInYear) / minutesInMonth);
		const days = Math.floor((minutes % minutesInMonth) / minutesInDay);
		const hours = Math.floor((minutes % minutesInDay) / minutesInHour);
		const remainingMinutes = minutes % minutesInHour;
		return {
			years: years,
			months: months,
			days: days,
			hours: hours,
			minutes: remainingMinutes
		};
	}

	function formatTimePlayedString(timePlayed) {
		let timePlayedString = "";
		let timeComponents = [];
		let units = ["years", "months", "days", "hours", "minutes"];
		for (let i = 0; i < units.length; i++) {
			const unit = units[i];
			if (timePlayed[unit] > 0) {
				timeComponents.push(`${timePlayed[unit]} ${timePlayed[unit] === 1 ? unit.slice(0, -1) : unit}`);
			}
		}
		if (timeComponents.length > 1) {
			const lastComponent = timeComponents.pop();
			timePlayedString = timeComponents.join(', ') + ' and ' + lastComponent;
		} else {
			timePlayedString = timeComponents[0];
		}
		return timePlayedString;
	}

})();