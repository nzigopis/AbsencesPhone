DayViewModel = function(selectedClass, selectedDate, loadClassStudentsForDateFunc, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass || PageStateManager.currentClass;
	if (selectedClass) 
		PageStateManager.currentClass = selectedClass;
	
	self.log = myLog || function(err) { 
			console.log(err); 
		};
		
	self.selectedClass = selectedClass;
	self.selectedDate = selectedDate;
	
    self.students = ko.observableArray();
	
	self.selectStudent = function(selectedStudent) {
        
        PageStateManager.changePage('student.html', new StudentViewModel(selectedStudent));
    };

	self.selectMonth = function(selectedMonth) {
        
        PageStateManager.changePage('month.html', new MonthViewModel(self.selectedClass, selectedMonth));
    };
	
	loadClassStudentsForDateFunc = loadClassStudentsForDateFunc || DbFuncs.loadClassStudentsForDate;
	
	loadClassStudentsForDateFunc(self.selectedClass, self.selectedDate, function(data) { 
		try 
		{
			self.students(data); 
		} 
		catch (e)
		{
			self.log(JSON.stringify(e));
		}
	});
};

