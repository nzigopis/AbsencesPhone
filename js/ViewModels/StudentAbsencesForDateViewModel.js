StudentAbsencesForDateViewModel = function(selectedDate, selectedStudent, loadStudentAbsencesForDateFunc, myLog) {
	
	self = this;
	
	self.selectedDate = selectedDate || PageStateManager.currentDate;
	if (selectedDate) 
		PageStateManager.currentDate = selectedDate;
	
	self.selectedStudent = selectedStudent || PageStateManager.currentStudent;
	if (selectedStudent) 
		PageStateManager.currentStudent = selectedStudent;

	self.absences = ko.observable();
	
	self.log = myLog || function(err) { console.log(err); };
	
	loadStudentAbsencesForDateFunc = loadStudentAbsencesForDateFunc || 
			DbFuncs.loadStudentAbsencesForDate;
	loadStudentAbsencesForDateFunc(self.selectedStudent, self.selectedDate, 
		function(a) { 
			try 
			{
				self.absences(a); 
			} 
			catch (e)
			{
				self.log(JSON.stringify(e));
			}
	});
};

