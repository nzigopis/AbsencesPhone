MonthViewModel = function (selectedClass, firstDayOfMonth, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass || PageStateManager.currentClass;
	if (selectedClass) 
		PageStateManager.currentClass = selectedClass;
	
	self.firstDayOfMonth = firstDayOfMonth || PageStateManager.firstDayOfCurrentMonth;
	if (firstDayOfMonth) 
		PageStateManager.firstDayOfCurrentMonth = firstDayOfMonth;
	
	self.log = myLog || function(err) { 
			console.log(err); 
		};
		
    self.daysWithAbsences = ko.observableArray();
    self.newDate = ko.observable(new Date());
	
    self.selectDay = function(selectedDay) {
        PageStateManager.changePage('day.html', new DayViewModel(selectedClass, selectedDay));
    };
	
	self.addDay = function() {
		if (self.daysWithAbsences() && self.daysWithAbsences.indexOf(self.newDate()) >=0)
			return;
        self.daysWithAbsences.push(self.newDate());
		self.daysWithAbsences().sort(function(d1,d2) { return d1 > d2; });
        
		self.daysWithAbsences.valueHasMutated(); 
    };

	DbFuncs.loadDaysWithAbsences(self.selectedClass, self.firstDayOfMonth, function(data) { 
		try 
		{
			self.daysWithAbsences(data || []); 
		} 
		catch (e)
		{
			self.log(JSON.stringify(e));
		}
	});
}
