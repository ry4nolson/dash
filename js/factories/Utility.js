angular.module("mobileDash")
	.factory("Utility", function Utility() {
		return {
			getOrdinal: function getOrdinal(n) {
				var s = ["th", "st", "nd", "rd"],
					v = n % 100;
				return n + (s[(v - 20) % 10] || s[v] || s[0]);
			},
			setDateTime: function setDateTime(date, hours, minutes, seconds, milliseconds) {
				var newDate = new Date();
				newDate.setTime(date.getTime());
				newDate.setHours(hours);
				newDate.setMinutes(minutes);
				newDate.setSeconds(seconds);
				newDate.setMilliseconds(milliseconds);
				return new Date(newDate.getTime());
			}
		}
	})