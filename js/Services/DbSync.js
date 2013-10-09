DbSync = (function () {
    
	var addUsers = function(data, tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (userName TEXT PRIMARY KEY, userPassword TEXT)');
		if (!data.users)
			return;
		
		for (var i = 0; i < data.users.length; i++)
		{
			var userName = data.users[i].userName;
			var password = data.users[i].userPassword;
			tx.executeSql('INSERT INTO USERS (userName, userPassword) VALUES (?, ?)', [userName, password]);
		}
	};
	
    var addClasses = function(data, tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS CLASSES (classId TEXT PRIMARY KEY, classDescription TEXT)');
		if (!data.classes)
			return;
		
		for (var i = 0; i < data.classes.length; i++)
		{
			var classId = data.classes[i].classId;
			var classDescription = data.classes[i].classDescription;
			tx.executeSql('INSERT INTO CLASSES (classId, classDescription) VALUES (?, ?)', 
				[classId, classDescription],
				(function (j) {
						return function () {console.log('Added class ' + j)};
				})(classId)
				);
		}
	};
	
    var addStudents = function(data, tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENTS (studentId INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, fatherName TEXT, motherName TEXT)');
        if (!data.students)
			return;
		
		for (var i = 0; i < data.students.length; i++)
		{
			var studentId = data.students[i].studentId;
			var firstName = data.students[i].firstName;
			var lastName = data.students[i].lastName;
			var fatherName = data.students[i].fatherName;
			var motherName = data.students[i].motherName;
			tx.executeSql('INSERT INTO STUDENTS (studentId,firstName,lastName,fatherName,motherName) VALUES (?,?,?,?,?)', 
				[studentId, firstName, lastName, fatherName, motherName],
				(function (j) {
					return function () {console.log('Added Student with id ' + j)};
				})(studentId)
				);
		}
	};
	
	var addClassStudents = function(data, tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS CLASS_STUDENTS (studentId INTEGER, classId TEXT, PRIMARY KEY (studentId, classId))');
		if (!data.students)
			return;
		
		for (var i = 0; i < data.students.length; i++)
		{
			var studentId = data.students[i].studentId;
			var classId = data.students[i].attendsClass.key.raw.name;
			tx.executeSql('INSERT INTO CLASS_STUDENTS (studentId, classId) VALUES (?,?)', 
				[studentId, classId],
				(function (j,k) {
					return function () {console.log('Added student ' + j + ' to class ' + k)};
				})(studentId, classId)
			);
		}
	};
	
    var updateDb = function (data, tx, user, pwd, authenticate, successCallback, errorCallback) {
        successCallback = successCallback || function(d) {};
        errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};
		
        try 
        {
            addUsers(data, tx);
			
            addClasses(data, tx);

			addStudents(data, tx);

			addClassStudents(data, tx);
			
            tx.executeSql('CREATE TABLE IF NOT EXISTS ABSENCES (studentId INTEGER, absencesDate DATE, h1 INTEGER, h2 INTEGER, h3 INTEGER, h4 INTEGER, h5 INTEGER, h6 INTEGER, h7 INTEGER, PRIMARY KEY (studentId, absencesDate))');

            tx.executeSql('CREATE TABLE IF NOT EXISTS ABSENCES_LOG (Id INTEGER PRIMARY KEY AUTOINCREMENT, studentId INTEGER, absencesDate DATE, h1 INTEGER, h2 INTEGER, h3 INTEGER, h4 INTEGER, h5 INTEGER, h6 INTEGER, h7 INTEGER, stmtType TEXT)');

            authenticate(user, pwd, successCallback, errorCallback);
        }
        catch (e)
        {
            errorCallback(JSON.stringify(e));
        }
    };
	
	var pull = function (user, pwd, authenticate, successCallback, errorCallback) {
        successCallback = successCallback || function(data) {};
        errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};
		
		$.getJSON(Constants.SERVER_PULL_URL)
			.done(function(data) {
				var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
				db.transaction(function (tx) {
					updateDb(data, tx, user, pwd, authenticate, successCallback, errorCallback) });
			})
			.fail(function(error) {
				errorCallback('Πρόβλημα επικοινωνίας με το Server. Προσπαθείστε αργότερα!' + JSON.stringify(error));
			}); 
	};
	
    var push = function (logData, user, pwd, successCallback, errorCallback) {
		successCallback = successCallback || function(data) {};
        errorCallback = errorCallback || function(e) { console.log(JSON.stringify(e));};
		
		$.post(Constants.SERVER_PUSH_URL, JSON.stringify(logData))
			.done(function(data, textStatus, jqXHR) {
				successCallback(data);
			})
			.fail(function(error) {
				errorCallback('Πρόβλημα επικοινωνίας με το Server. Προσπαθείστε αργότερα!' + JSON.stringify(error));
			}); 
		
    };

    var dbSyncPublicMethods = { pull: pull, push: push };
    
	return dbSyncPublicMethods;

})();

