DbSync = (function () {
    
    var loadFromServer = function (tx, user, pwd, authenticate, dbSyncFail, errorLog) {

		errorLog = errorLog || function(err) { 
			console.log(err); 
		};
		try 
		{
			tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (userName TEXT PRIMARY KEY, userPassword TEXT)',
				function () {errorLog('CREATED TABLE USERS !!!');});
			tx.executeSql('INSERT INTO USERS (userName, userPassword) VALUES (?, ?)', ['nikos', 'zigopis'],
				function () {errorLog('Added nzigopis');}
			);
				
			tx.executeSql('CREATE TABLE IF NOT EXISTS CLASSES (classId TEXT PRIMARY KEY, classDescription TEXT)');
			for (var i = 1; i <= 3; i++ ){
				var cls = 'Α' + i;
				tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', [cls, cls],
					(function (j) {
						return function (tx, results) {errorLog('Added ' + j)};
					})(i)
					);
			}
			
//			tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENTS (studentId INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, fatherName TEXT, motherName TEXT');
//			for (var i = 1; i <= 10; i++ ){
//				var student = 'Μαθητής ' + i;
//				tx.executeSql('INSERT INTO STUDENTS (studentId,firstName,lastName,fatherName,motherName) VALUES (?,?,?,?,?)', 
//					[i, student, student, null, null],
//					function () {errorLog('Added ' + student);});
//			}
			
			authenticate(user, pwd);
		}
		catch (e)
		{
			dbSyncFail = dbSyncFail || function(error) { alert(error); };
			dbSyncFail(JSON.stringify(e));
		}
	};
	
    var pull = function (tx, user, pwd, authenticate, dbSyncFail, errorLog) {
        loadFromServer(tx, user, pwd, authenticate);
    };

    var push = function (tx, user, pwd, dbSyncSuccess, dbSyncFail) {

    };

    var dbSyncPublicMethods = { pull: pull, push: push };
    
	return dbSyncPublicMethods;

})();


//			tx.executeSql('CREATE TABLE IF NOT EXISTS CLASS_STUDENTS \n\
//				(studentId INTEGER , classId TEXT, PRIMARY KEY (studentId, classId)');
//			tx.executeSql('CREATE TABLE IF NOT EXISTS ABSENCES \n\
//				(studentId INTEGER, absencesDate DATE,\n\
//				h1 INTEGER, h2 INTEGER, h3 INTEGER, h4 INTEGER, h5 INTEGER,\n\
//				h6 INTEGER, h7 INTEGER, PRIMARY KEY (studentId, absencesDate)');
