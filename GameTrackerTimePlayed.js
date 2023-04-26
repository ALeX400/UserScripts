// ==UserScript==
// @name         GameTracker Time Played
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays the time played in days, hours, and minutes for a player on GameTracker.
// @author       @LeX
// @match        https://www.gametracker.com/player/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ALeX400/UserScripts/main/GameTrackerTimePlayed.js
// @downloadURL  https://raw.githubusercontent.com/ALeX400/UserScripts/main/GameTrackerTimePlayed.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

// Rest of the script


(function() {
    'use strict';

    const sectionTitles = document.querySelectorAll('div.section_title');

    for (const sectionTitle of sectionTitles) {
        if (sectionTitle.textContent.includes("ALL TIME STATS")) {
            const itemColorTitles = sectionTitle.parentElement.querySelectorAll('span.item_color_title');

            for (const title of itemColorTitles) {
                if (title.textContent.includes("Minutes Played:")) {
                    const minutesPlayedText = title.nextSibling;
                    const minutesPlayed = parseInt(minutesPlayedText.textContent.trim(), 10);
                    const timePlayed = convertMinutesToTimePlayed(minutesPlayed);
                    const timePlayedString = formatTimePlayedString(timePlayed);

                    const totalTimeTitle = document.createElement('span');
                    totalTimeTitle.className = 'item_color_title';
                    totalTimeTitle.textContent = 'Total Time:';

                    const totalTimeText = document.createElement('span');
                    totalTimeText.textContent = ` ${timePlayedString}`;

                    const lineBreak1 = document.createElement('br');

                    title.parentElement.insertBefore(lineBreak1, minutesPlayedText.nextSibling);
                    title.parentElement.insertBefore(totalTimeTitle, lineBreak1.nextSibling);
                    title.parentElement.insertBefore(totalTimeText, totalTimeTitle.nextSibling);
                    break;
                }
            }
            break;
        }
    }

    function convertMinutesToTimePlayed(minutes) {
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

    function formatTimePlayedString(timePlayed) {
        let timePlayedString = "";
        if (timePlayed.days > 0) {
            timePlayedString += `${timePlayed.days} ${timePlayed.days === 1 ? 'day' : 'days'}, `;
        }
        if (timePlayed.hours > 0) {
            timePlayedString += `${timePlayed.hours} ${timePlayed.hours === 1 ? 'hour' : 'hours'}, `;
        }
        timePlayedString += `${timePlayed.minutes} ${timePlayed.minutes === 1 ? 'minute' : 'minutes'}`;

        return timePlayedString;
    }
})();
