ClassesViewModel = function () {
	
	self = this;
	
    self.classes = ko.observableArray();
        
    self.selectClass = function(selectedClass) {
        
        alert(selectedClass.classId + ':' + selectedClass.classDescription)    
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
