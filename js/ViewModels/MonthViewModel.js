MonthViewModel = function (selectedClass, firstDateOfMonth, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass || PageStateManager.currentClass;
	if (selectedClass) 
		PageStateManager.currentClass = selectedClass;
	
	self.firstDateOfMonth = firstDateOfMonth || PageStateManager.firstDayOfCurrentMonth;
	if (firstDateOfMonth) 
		PageStateManager.firstDayOfCurrentMonth = firstDateOfMonth;
	
	self.log = myLog || function(err) { 
			console.log(err); 
		};
		
    self.daysWithAbsences = ko.observableArray();
    self.newDate = ko.observable(firstDateOfMonth);
	
	self.validDates = ko.observableArray();
	
    self.selectDay = function(selectedDay) {
        PageStateManager.changePage('day.html', new DayViewModel(selectedClass, selectedDay));
    };
	
	self.addDay = function() {
		var newDate = new Date(self.newDate().getFullYear(), self.newDate().getMonth(), self.newDate().getDate());
		if (containsDate(self.daysWithAbsences, newDate) || newDate.getDay() === 0 || newDate.getDay() === 6)
			return;

		self.daysWithAbsences.push(newDate);
		self.daysWithAbsences().sort(function(d1,d2) { return d1 > d2; });
        self.daysWithAbsences.valueHasMutated(); 
		
		setAllowedDates();
    };
	
	var containsDate = function(daysWithAbsences, aDate) {
		if (!daysWithAbsences || !daysWithAbsences())
			return false;
		
		var match = ko.utils.arrayFirst(daysWithAbsences(), function(d) {
			return aDate.valueOf() === d.valueOf();
		});
		return match;
	};
	
	var validDaysInMonth = function(daysWithAbsences, firstDateOfMonth){
		var fmt = new JsSimpleDateFormat("yyyy-MM-dd")
		var year = firstDateOfMonth.getFullYear();
		var month = firstDateOfMonth.getMonth();
		var days = _.range(1, DateFuncs.lastDayOfMonth(firstDateOfMonth));
		var monthDates = _.map(days, function(num){ return new Date(year, month, num); });
		var allowedDates = _.filter(monthDates, function (d) { 
			return d.getDay() > 0 && d.getDay() < 6 && !containsDate(daysWithAbsences, d); });
		
		return _.map(allowedDates, function(d){ return fmt.format(d) });
	};
	
	var setAllowedDates = function() {
		var allowedDates = validDaysInMonth(self.daysWithAbsences, self.firstDateOfMonth);
			
		setTimeout(function() { 
			$("#add-date").data('mobileDatebox').options.enableDates = allowedDates;
			$("#add-date").data('mobileDatebox').options.highDates = allowedDates;
			$('#add-date').datebox('refresh'); 
		}, 500);
	};
	
	DbFuncs.loadDaysWithAbsences(self.selectedClass, self.firstDateOfMonth, function(data) { 
		try 
		{
			var validDays = data || [];
			self.daysWithAbsences(validDays); 
			
			setAllowedDates();
		} 
		catch (e)
		{
			self.log(JSON.stringify(e));
		}
	});
}
