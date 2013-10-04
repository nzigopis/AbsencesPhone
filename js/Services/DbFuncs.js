DbFuncs = (function(dbPersistence, dbLoader) {

	var dbPersistence = dbPersistence;
	var dbLoader = dbLoader;
	
	var login = function(user, pwd, successCallback, errorCallback) {
		successCallback = successCallback || function(data) {
		};
		errorCallback = errorCallback || function(e) {
			alert(JSON.stringify(e));
		};

		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.readTransaction(function(tx) {
			tx.executeSql('SELECT * FROM USERS', [],
					function(tx, results) {
						if (results.rows.length === 0)
							DbSync.pull(user, pwd, authenticate, successCallback, errorCallback);
						else
							authenticate(user, pwd, successCallback, errorCallback);
					},
					function(tx, e) {
						DbSync.pull(user, pwd, authenticate, successCallback, errorCallback);
					});
		});
	};

	var authenticate = function(user, pwd, successCallback, errorCallback) {
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.readTransaction(function(tx) {
			tx.executeSql('SELECT * FROM USERS WHERE userName=?', [user],
					function(tx, results) {
						if (results.rows.length === 0)
							errorCallback("Λάθος Όνομα Χρήστη !");
						else if (results.rows.item(0).userPassword !== pwd)
							errorCallback("Λάθος Κωδικός !");
						else {
							PageStateManager.yearStart = 2013;
							PageStateManager.yearEnd = 2014;
							PageStateManager.userName = user;
							PageStateManager.userPassword = pwd;
							successCallback();
						}
					},
					function(e) {
						errorCallback('Δεν φορτώθηκαν δεδομένα από τον server !');
					}
			);
		});
	}

	var updateAbsences = function(absences, successCallback, errorCallback) {
		dbPersistence.updateAbsences(absences, successCallback, errorCallback);
	};

	var saveNewAbsences = function(absences, successCallback, errorCallback) {
		dbPersistence.saveNewAbsences(absences, successCallback, errorCallback);
	};

	var deleteAbsences = function(absences, successCallback, errorCallback) {
		dbPersistence.deleteAbsences(absences, successCallback, errorCallback);
	};

	var loadClasses = function(successCallback, errorCallback) {
		dbLoader.loadClasses(successCallback, errorCallback);
	};

	var loadClassStudents = function(aClass, successCallback, errorCallback) {
		dbLoader.loadClassStudents(aClass, successCallback, errorCallback);
	};

	var loadStudentsAbsencesForClassAndDate = function(aClass, selectedDate, successCallback, errorCallback) {
		dbLoader.loadStudentsAbsencesForClassAndDate(aClass, selectedDate, successCallback, errorCallback);
	};

	
	var loadDaysWithAbsences = function(selectedClass, firstDayOfMonth, successCallback, errorCallback) {
		dbLoader.loadDaysWithAbsences(selectedClass, firstDayOfMonth, successCallback, errorCallback);
	};

	var loadStudentAbsencesForDate = function(selectedStudent, selectedDate, successCallback, errorCallback) {
		dbLoader.loadStudentAbsencesForDate(selectedStudent, selectedDate, successCallback, errorCallback);
	};

	return {
		login: login,
		loadClasses: loadClasses,
		loadClassStudents: loadClassStudents,
		loadDaysWithAbsences: loadDaysWithAbsences,
		loadStudentsAbsencesForClassAndDate: loadStudentsAbsencesForClassAndDate,
		loadStudentAbsencesForDate: loadStudentAbsencesForDate,
		saveNewAbsences: saveNewAbsences,
		updateAbsences: updateAbsences,
		deleteAbsences: deleteAbsences
	};

})(DbPersistence, DbLoader);



