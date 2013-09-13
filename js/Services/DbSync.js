DbSync = (function () {
    
    var loadFromServer = function (tx, user, pwd, authenticate, dbSyncFail, errorLog) {

		try 
		{
			tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (userName TEXT PRIMARY KEY, userPassword TEXT)',
				function () {errorLog('CREATED TABLE USERS !!!');});
			tx.executeSql('INSERT INTO USERS (userName, userPassword) VALUES (?, ?)', ['nikos', 'zigopis'],
				function () {errorLog('Added nzigopis');}
			);
				
			tx.executeSql('CREATE TABLE IF NOT EXISTS CLASSES (classId TEXT PRIMARY KEY, classDescription TEXT)');
			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Α1', 'Α1'],
				function () {errorLog('Added Α1');});
			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Α2', 'Α2'],
				function () {errorLog('Added Α2');});
			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Α3', 'Α3'],
				function () {errorLog('Added Α3');});
			
			authenticate(user, pwd);
//			tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENTS \n\
//				(studentId INTEGER PRIMARY KEY, \n\
//				firstName TEXT, lastName TEXT, fatherName TEXT, motherName TEXT');
//			tx.executeSql('CREATE TABLE IF NOT EXISTS CLASS_STUDENTS \n\
//				(studentId INTEGER , classId TEXT, PRIMARY KEY (studentId, classId)');
//			tx.executeSql('CREATE TABLE IF NOT EXISTS ABSENCES \n\
//				(studentId INTEGER, absencesDate DATE,\n\
//				h1 INTEGER, h2 INTEGER, h3 INTEGER, h4 INTEGER, h5 INTEGER,\n\
//				h6 INTEGER, h7 INTEGER, PRIMARY KEY (studentId, absencesDate)');

//			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Α1', 'Α1']);
//			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Α2', 'Α2']);
//			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Β1', 'Β1']);
//			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Β2', 'Β2']);
//			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Β3', 'Β3']);
//			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Γ1', 'Γ1']);
//			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Γ2', 'Γ2']);
//			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', ['Γ3', 'Γ3']);

			

//			tx.executeSql('SELECT * FROM USERS', [], function (tx, results) {
//				var len = results.rows.length ;
//				if (len === 0)
//					dbSyncFail('Δεν μεταφέρθηκαν δεδομένα από τον server !');
//				else
//					authenticate(results.rows, user, pwd);
//			}, function (tx, e) {
//				dbSyncFail('Δεν μεταφέρθηκαν δεδομένα από τον server !');
//			});
		}
		catch (e)
		{
			alert(JSON.stringify(e));
		}
	};
	
    var pull = function (tx, user, pwd, authenticate, dbSyncFail, errorLog) {
        loadFromServer(tx, user, pwd, authenticate, dbSyncFail, errorLog);
    };

    var push = function (tx, user, pwd, dbSyncSuccess, dbSyncFail) {

    };

    var dbSyncPublicMethods = { pull: pull, push: push };
    
	return dbSyncPublicMethods;

})();

