ClassesViewModel = function () {
	
	self = this;
	
    self.classes = ko.observableArray();
        
    self.selectClass = function(selectedClass) {
        
        PageStateManager.changePage('months-for-class.html', new MonthsForClassViewModel(selectedClass));
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
