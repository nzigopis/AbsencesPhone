DateFuncs = (function () {

	var lastDayOfMonth = function(month) {
		switch(month)
		{
			case 1:
				return 28;
			case 8:
			case 10:
			case 3:
				return 30;
			default:
				return 31;
		}	
	};
	
	var endOfMonth = function(firstDateOfMonth) {
		var day = lastDayOfMonth(firstDateOfMonth.getMonth());
		
		var endDate = new Date(firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(), day);
		return new JsSimpleDateFormat("yyyy-MM-dd").format(endDate);
	};
	
	return { lastDayOfMonth:lastDayOfMonth, endOfMonth:endOfMonth };
})();	