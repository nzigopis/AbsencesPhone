MonthViewModel = function (selectedClass, monthName, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass;
	self.monthName = monthName;
	
	self.log = myLog || function(err) { 
			console.log(err); 
		};
		
    self.daysWithAbsences = ko.observableArray();
        
    self.selectDay = function(selectedDay) {
        
        PageStateManager.changePage('day.html', new DayViewModel(selectedDay));
    };
	
	DbFuncs.loadDaysWithAbsences(self.selectedClass, self.monthName, function(data) { 
		try 
		{
			self.daysWithAbsences(data); 
		} 
		catch (e)
		{
			self.log(JSON.stringify(e));
		}
	});
}
