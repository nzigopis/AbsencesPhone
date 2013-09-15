ClassesViewModel = function () {
	
	self = this;
	
    self.classes = ko.observableArray();
        
    self.selectClass = function(selectedClass) {
        
        PageStateManager.changePage('class_students.html', new ClassStudentsViewModel(selectedClass));
    };

	DbFuncs.loadClasses(function(data) { 
		try 
		{
			self.classes(data); 
		} 
		catch (e)
		{
			// Write to log
		}
	});
}
