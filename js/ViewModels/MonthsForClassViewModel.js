MonthsForClassViewModel = function (selectedClass, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass || PageStateManager.currentClass;
	if (selectedClass) 
		PageStateManager.currentClass = selectedClass;
	
	self.log = myLog || function(err) { 
			console.log(err); 
		};
		
    self.students = ko.observableArray();
	
	var monthStartDates = [];
	for (var i = 8; i < 12; i++)
		monthStartDates.push(new Date(PageStateManager.yearStart, i, 1));
	for (var i = 0; i < 5; i++)
		monthStartDates.push(new Date(PageStateManager.yearEnd, i, 1));
	
    self.months = ko.observableArray(monthStartDates);
        
    self.selectStudent = function(selectedStudent) {
        
        PageStateManager.changePage('student.html', new StudentViewModel(selectedStudent));
    };

	self.selectMonth = function(selectedMonth) {
        
        PageStateManager.changePage('month.html', new MonthViewModel(self.selectedClass, selectedMonth));
    };
	
//	DbFuncs.loadClassStudents(self.selectedClass, function(data) { 
//		try 
//		{
//			self.students(data); 
//		} 
//		catch (e)
//		{
//			self.log(JSON.stringify(e));
//		}
//	});
}
