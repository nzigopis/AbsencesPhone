IndexViewModel = function () {

    this.userName = ko.observable("");
    this.userPassword = ko.observable("");
    this.loginMessage = ko.observable("");
	
	var errorLabel = this.loginMessage;
        
    this.login = function () {
        errorLabel("");

        var user = this.userName();
        var pwd = this.userPassword();

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

	var authenticate = function(users, user, pwd) {
		var len = users.length, i;
                        
		for (i = 0; i < len; i++){
			if (user === users.item(i).userName && pwd === users.item(i).userPassword) {
				errorLabel("");
				LoggedOnUser.init('nikos', 'zigopis');
				PageStateManager.changePage('class.html', {});
				return;
			}
		}
		authenticationFail("Λάθος Στοιχεία !");
	}

	var authenticationFail = function(e) {
		errorLabel(JSON.stringify(e));
	}
}
