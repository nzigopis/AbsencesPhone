DbSync = (function () {
    
    var loadFromServer = function (tx, user, pwd, authenticate, dbSyncFail) {

        tx.executeSql(
			'CREATE TABLE IF NOT EXISTS USERS (userName TEXT PRIMARY KEY, userPassword TEXT)');
        tx.executeSql(
			'CREATE TABLE IF NOT EXISTS CLASSES (classId TEXT PRIMARY KEY, classDescription TEXT)');
		
        tx.executeSql(
			'INSERT INTO USERS (userName, userPassword) VALUES (?, ?)', ['nikos', 'zigopis']);
		
		tx.executeSql('SELECT * FROM USERS', [], function (tx, results) {
			if (results.rows.length === 0)
				dbSyncFail('Δεν μεταφέρθηκαν δεδομένα από τον server !');
			else
				authenticate(results.rows, user, pwd);
		}, function (tx, e) {
			dbSyncFail('Δεν μεταφέρθηκαν δεδομένα από τον server !');
		});
	};
	
    var pull = function (tx, user, pwd, authenticate, dbSyncFail) {
        loadFromServer(tx, user, pwd, authenticate, dbSyncFail);
    };

    var push = function (tx, user, pwd, dbSyncSuccess, dbSyncFail) {

    };

    var dbSyncPublicMethods = { pull: pull, push: push };
    
	return dbSyncPublicMethods;

})();

