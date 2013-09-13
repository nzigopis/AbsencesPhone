IndexViewModel = function () {

	self = this;
	
    self.userName = ko.observable("");
    self.userPassword = ko.observable("");
    self.loginMessage = ko.observable("");
	self.log = ko.observable("");
	
	var errorLabel = self.loginMessage;
        
    self.login = function () {
        errorLabel("");

        var user = self.userName();
        var pwd = self.userPassword();

		$.mobile.loading('show');

		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM USERS', [], function (tx, results) {
				if (results.rows.length === 0)
					DbSync.pull(tx, user, pwd, authenticate, authenticationFail, errorLog);
				else
					authenticate(user, pwd);
			}, function (tx, e) {
				DbSync.pull(tx, user, pwd, authenticate, authenticationFail, errorLog);
			});
		});
            
    };

	var authenticate = function(user, pwd) {
	
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.readTransaction(function (tx) {
			tx.executeSql('SELECT * FROM USERS WHERE userName=?', [user], 
				function (tx, results) {
					if (results.rows.length === 0 || results.rows.item(0).userPassword !== pwd)
						authenticationFail("Λάθος Στοιχεία !");
					else {
						errorLabel("");
						LoggedOnUser.init('nikos', 'zigopis');
						PageStateManager.changePage('classes.html', new ClassesViewModel());
					}
				},
				function (e) { authenticationFail('Λάθος Στοιχεία !');}
			);
		});
	}

	var authenticationFail = function(e) {
		errorLabel(JSON.stringify(e));
		$.mobile.loading('hide');
	}
	
	var errorLog = function (error) {
		var current = self.log(); 
		self.log(current + "\n" + error); 
	}
}
