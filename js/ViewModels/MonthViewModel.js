MonthViewModel = function (selectedClass, firstDateOfMonth, myLog) {
	
	self = this;
	
	self.selectedClass = PageStateManager.currentClass = selectedClass || PageStateManager.currentClass;
	
	self.firstDateOfMonth = PageStateManager.firstDayOfCurrentMonth = firstDateOfMonth || PageStateManager.firstDayOfCurrentMonth;
	
	self.log = myLog || function(err) { console.log(err); };
		
    self.daysWithAbsences = ko.observableArray();
    self.newDate = ko.observable(self.firstDateOfMonth);
	
	self.validDates = ko.observableArray();
	
    self.selectDay = function(selectedDate) {
        PageStateManager.changePage('day.html', new DayViewModel(self.selectedClass, selectedDate));
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
			$("#select-date").data('mobileDatebox').options.enableDates = allowedDates;
			$("#select-date").data('mobileDatebox').options.highDates = allowedDates;
			$('#select-date').datebox('refresh'); 
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
