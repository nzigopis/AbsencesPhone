DayViewModel = function(selectedClass, selectedDate, loadStudentsAbsencesForClassAndDateFunc, myLog) {
	
	self = this;
	
	self.selectedClass = selectedClass || PageStateManager.currentClass;
	if (selectedClass) 
		PageStateManager.currentClass = selectedClass;
	
	self.selectedDate = selectedDate || PageStateManager.currentDate;
	if (selectedDate) 
		PageStateManager.currentDate = selectedDate;
	
	self.log = myLog || function(err) { console.log(err); };
	
    self.students = ko.observableArray();
	
	self.selectStudent = function(selectedStudent) {
        PageStateManager.changePage('student_absences_for_date.html', 
			new StudentAbsencesForDateViewModel(selectedDate, selectedStudent));
    };

	loadStudentsAbsencesForClassAndDateFunc = loadStudentsAbsencesForClassAndDateFunc || 
			DbFuncs.loadStudentsAbsencesForClassAndDate;
	loadStudentsAbsencesForClassAndDateFunc(self.selectedClass, self.selectedDate, 
		function(data) { 
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

