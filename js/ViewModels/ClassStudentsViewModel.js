ClassStudentsViewModel = function (selectedClass, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass;
	
	self.log = myLog || function(err) { 
			console.log(err); 
		};
		
    self.students = ko.observableArray();
    self.months = ko.observableArray(['Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος','Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος']);
        
    self.selectStudent = function(selectedStudent) {
        
        PageStateManager.changePage('student.html', new StudentViewModel(selectedStudent));
    };

	self.selectMonth = function(selectedMonth) {
        
        PageStateManager.changePage('month.html', new MonthViewModel(self.selectedClass, selectedMonth));
    };
	
	DbFuncs.loadClassStudents(self.selectedClass, function(data) { 
		try 
		{
			self.students(data); 
		} 
		catch (e)
		{
			self.log(JSON.stringify(e));
		}
	});
}
