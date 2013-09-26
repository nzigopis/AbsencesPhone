DbSync = (function () {
    
    var loadFromServer = function (tx, user, pwd, authenticate, successCallback, errorCallback) {
        successCallback = successCallback || function(data) {};
        errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};

        try 
        {
            tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (userName TEXT PRIMARY KEY, userPassword TEXT)');
            tx.executeSql('INSERT INTO USERS (userName, userPassword) VALUES (?, ?)', ['nikos', 'zigopis'],
                    function () {errorLog('Added nzigopis');}
            );

            tx.executeSql('CREATE TABLE IF NOT EXISTS CLASSES (classId TEXT PRIMARY KEY, classDescription TEXT)');
            for (var i = 1; i <= 3; i++ ){
                    var cls = 'Α' + i;
                    tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', [cls, cls],
                            (function (j) {
                                    return function () {errorLog('Added Α' + j)};
                            })(i)
                            );
            }

            tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENTS (studentId INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, fatherName TEXT, motherName TEXT)');
            for (var i = 1; i <= 10; i++ ){
                    var student = 'Μαθητής ' + i;
                    tx.executeSql('INSERT INTO STUDENTS (studentId,firstName,lastName,fatherName,motherName) VALUES (?,?,?,?,?)', 
                            [i, student, student, null, null],
                            (function (j) {
                                    return function () {errorLog('Added ' + j)};
                            })(student)
                    );
            }

            tx.executeSql('CREATE TABLE IF NOT EXISTS CLASS_STUDENTS (studentId INTEGER , classId TEXT, PRIMARY KEY (studentId, classId))');
            for (var i = 1; i <= 10; i++ ){
                    var student = 'Μαθητής ' + i;
                    tx.executeSql('INSERT INTO CLASS_STUDENTS (studentId,classId) VALUES (?,?)', [i, 'Α1'],
                            (function (j) {
                                    return function () {errorLog('Added Α1 <->' + j)};
                            })(student)
                    );
            }

            tx.executeSql('CREATE TABLE IF NOT EXISTS ABSENCES (studentId INTEGER, absencesDate DATE, h1 INTEGER, h2 INTEGER, h3 INTEGER, h4 INTEGER, h5 INTEGER, h6 INTEGER, h7 INTEGER, PRIMARY KEY (studentId, absencesDate))');

            tx.executeSql('CREATE TABLE IF NOT EXISTS ABSENCES_LOG (Id INTEGER PRIMARY KEY AUTOINCREMENT, studentId INTEGER, absencesDate DATE, h1 INTEGER, h2 INTEGER, h3 INTEGER, h4 INTEGER, h5 INTEGER, h6 INTEGER, h7 INTEGER, stmtType TEXT)');

            authenticate(user, pwd, successCallback, errorCallback);
        }
        catch (e)
        {
            errorCallback(JSON.stringify(e));
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

