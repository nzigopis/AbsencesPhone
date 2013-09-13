ClassesViewModel = function () {
	
	self = this;
	
    self.classes = ko.observableArray();
        
    self.selectClass = function () {
        
        var user = self.userName();
        var pwd = self.userPassword();

		$.mobile.loading('show');

		var db = openDatabase('absences.db', '1.0', 'Test DB', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM USERS', [], function (tx, results) {
				if (results.rows.length === 0)
					DbSync.pull(tx, user, pwd, authenticate, authenticationFail);
				else
					authenticate(results.rows, user, pwd);
			}, function (tx, e) {
				DbSync.pull(tx, user, pwd, authenticate, authenticationFail);
			});
		});
            
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
