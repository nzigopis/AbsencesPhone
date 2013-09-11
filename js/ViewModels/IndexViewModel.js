IndexViewModel = function () {

    // Console.log('new LoginViewModel()');

    this.userName = ko.observable("");
    this.userPassword = ko.observable("");
    this.loginMessage = ko.observable("");

    this.login = function () {
        var errorLabel = this.loginMessage;
        errorLabel("");

        var user = this.userName();
        var pwd = this.userPassword();

        $.mobile.loading('show');
        
		var db = openDatabase('apousies.db', '1.0', 'Test DB', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			try
			{
				db.transaction(function (tx) {
				   tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (userName unique, userPassword)');
				});
				// 
				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM USERS', [], function (tx, results) {
						var len = results.rows.length, i;
						if (len == 0)
						{
							tx.executeSql('INSERT INTO USERS (userName, userPassword) VALUES (?, ?)', ['nikos', 'zigopis']);
							LoggedOnUser.init('nikos', 'zigopis');
							PageStateManager.changePage('class.html');
							$.mobile.loading('hide');
							return;
						}
						for (i = 0; i < len; i++){
							if (user === results.rows.item(i).userName && pwd === results.rows.item(i).userPassword) {
								LoggedOnUser.init(user, pwd);
								PageStateManager.changePage('class.html');
								$.mobile.loading('hide');
							}
							else
							{
								errorLabel("Λάθος Στοιχεία !");
								$.mobile.loading('hide');
							}
						}
					}, null);
				});
			}
			catch(err)
			{
				this.loginMessage(JSON.stringify(err));
			}
		});
    };

}
