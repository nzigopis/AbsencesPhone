ClassStudentsViewModel = function (selectedClass, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass;
	
	self.log = myLog || function(err) { 
			console.log(err); 
		};
		
    self.students = ko.observableArray();
        
    self.selectStudent = function(selectedStudent) {
        
        PageStateManager.changePage('student.html', new StudentViewModel(selectedStudent));
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
