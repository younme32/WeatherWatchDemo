function toClockTime(hours) {
	if (hours == 0) {
		return "12 AM";
	} else if (hours == 12) {
		return "12 PM";
	} else if (hours > 12) {
		return (hours - 12) + " PM";
	} else {
		return hours + " AM";
	}

}