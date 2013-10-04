MonthsForClassViewModel = function (selectedClass, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass || PageStateManager.currentClass;
	if (selectedClass) 
		PageStateManager.currentClass = selectedClass;
	
	self.log = myLog || function(err) { 
			console.log(err); 
		};
		
    var monthStartDates = [];
	for (var i = 8; i < 12; i++)
		monthStartDates.push(new Date(PageStateManager.yearStart, i, 1));
	for (var i = 0; i < 5; i++)
		monthStartDates.push(new Date(PageStateManager.yearEnd, i, 1));
	
    self.months = ko.observableArray(monthStartDates);
        
    self.selectMonth = function(selectedMonth) {
        
        PageStateManager.changePage('month.html', new MonthViewModel(self.selectedClass, selectedMonth));
    };
}
