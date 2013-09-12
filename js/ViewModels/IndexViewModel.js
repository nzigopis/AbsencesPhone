IndexViewModel = function () {

    this.userName = ko.observable("");
    this.userPassword = ko.observable("");
    this.loginMessage = ko.observable("");

    this.login = function () {
        var errorLabel = this.loginMessage;
        errorLabel("");

        var user = this.userName();
        var pwd = this.userPassword();

        try
        {
            $.mobile.loading('show');

            openDatabase('absences.db', '1.0', 'Test DB', 2 * 1024 * 1024, function (db) {
                db.transaction(function (tx) {
                    var select = 'SELECT * FROM USERS';
                    tx.executeSql(select, [], function (tx, results) {
                        var len = results.rows.length, i;
                        if (len === 0)
                        {
                            DbSync.pull(tx, user, pwd, errorCallback);
                            return true;
                        }
                        for (i = 0; i < len; i++){
                            if (user === results.rows.item(i).userName && 
                                pwd === results.rows.item(i).userPassword) {
                                return true;
                            }
                            else
                            {
                                throw("Λάθος Στοιχεία !");
                            }
                        }
                    }, function (tx, e) {
                        // Load from server
                        DbSync.pull(tx, user, pwd, errorCallback);
                    });
                });
            });
            LoggedOnUser.init('nikos', 'zigopis');
            PageStateManager.changePage('class.html', {});
        }
        catch(err)
        {
            this.loginMessage(JSON.stringify(err));
        }
        finally
        {
            $.mobile.loading('hide');
        }
    };

}
