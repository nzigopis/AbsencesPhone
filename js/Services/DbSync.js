DbSync = (function () {
    
    var initialize = function (userName, userPassword) {

        var db = openDatabase('absences.db', '1.0', 'Test DB', 2 * 1024 * 1024);

        db.transaction(function (tx) {

            db.transaction(function (tx) {
               tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (userName unique, userPassword)');
            });
            // 
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM USERS', [], function (tx, results) {
                    var len = results.rows.length, i;
                    if (len === 0)
                    {
                        tx.executeSql('INSERT INTO USERS (userName, userPassword) VALUES (?, ?)', ['nikos', 'zigopis']);
                        return true;
                    }
                    for (i = 0; i < len; i++){
                        if (userName === results.rows.item(i).userName && 
                            userPassword === results.rows.item(i).userPassword) {
                            return true;
                        }
                        else
                        {
                            throw("Λάθος Στοιχεία !");
                        }
                    }
                }, null);
            });

        });
    };
	
    var pull = function (userName, userPassword, url) {
        return initialize(userName, userPassword);
    };

    var push = function (userName, userPassword, url) {

    };

    return 
    {
        pull: pull;
        push: push;
    };
    
})();

