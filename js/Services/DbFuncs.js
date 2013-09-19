DbFuncs = (function () {
    
    var loadClasses = function (successCallback, errorCallback) {
		
		successCallback = successCallback || function(data) {};
		
		errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};
		
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		
		db.readTransaction(function (tx) {
			tx.executeSql('SELECT * FROM CLASSES', [], 
				function (tx, results) {
					if (results.rows.length === 0)
						errorCallback(JSON.stringify(e));
					else 
					{
						var res = [];
						for (var i = 0; i < results.rows.length; i++)
							res.push(new SchoolClass(results.rows.item(i).classId, results.rows.item(i).classDescription));

						successCallback(res);
					}
				}, 
				function (tx, e) {
					errorCallback(JSON.stringify(e));
			});
		});
	};
	
	var loadClassStudentsForDate = function (aClass, selectedDate, successCallback, errorCallback) {
		successCallback = successCallback || function(data) {};
		errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};
		
		var sql = createClassStudentsSql();
		loadStudentsFromDb(sql, aClass.classId, 
			function(students) {
				loadStudentAbsencesForDate(students, selectedDate, successCallback, errorCallback)
			}, 
			errorCallback);
	};
	
	var loadClassStudents = function (aClass, successCallback, errorCallback) {
		successCallback = successCallback || function(data) {};
		errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};
		
		var sql = createClassStudentsSql(true);
		loadStudentsFromDb(sql, aClass.classId, successCallback, errorCallback);
	};
	
	var loadDaysWithAbsences = function (selectedClass, firstDayOfMonth, successCallback, errorCallback) {
		successCallback = successCallback || function(data) {};
		
		errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};
		
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		
		var sql = 'SELECT DISTINCT absencesDate ' +
			'FROM ABSENCES A INNER JOIN CLASS_STUDENTS CS ON A.STUDENTID=CS.STUDENTID ' +
			'WHERE CS.CLASSID=? AND A.ABSENCESDATE BETWEEN ? AND ? ' +
			'ORDER BY absencesDate';
	
		var fromDate = new JsSimpleDateFormat("yyyy-MM-dd").format(firstDayOfMonth);
		var toDate = DateFuncs.endOfMonth(firstDayOfMonth);
		
		db.readTransaction(function (tx) {
			tx.executeSql(sql, 
				[selectedClass.classId, fromDate, toDate], 
				function (tx, results) {
					var len = results.rows.length, res = [];
					if (len === 0)
					{
						successCallback();
						return;
					}
					for (var i = 0; i < len; i++){
						var row = results.rows.item(i);
						res.push(row.absencesDate);
					}
					successCallback(res);
				}, 
				function (tx, e) {
					errorCallback(JSON.stringify(e));
			});
		});
	};
	
	//	Helper Private Methods
	
	var createClassStudentsSql = function(includeAbsencesParam) {
		if (!includeAbsencesParam) 
		{
			return 'SELECT S.*, 0 as UNEXCUSED, 0 as EXCUSED ' + 
				'FROM STUDENTS S INNER JOIN CLASS_STUDENTS CS ON S.STUDENTID = CS.STUDENTID ' +
				'WHERE CS.CLASSID=? ' +
				'GROUP BY S.STUDENTID ORDER BY S.STUDENTID ';
		}
		else
		{
			return 'SELECT S.* , ' + sumsClause('A') + 
				'FROM STUDENTS S INNER JOIN CLASS_STUDENTS CS ON S.STUDENTID = CS.STUDENTID ' +
				'LEFT JOIN  ABSENCES AS A ON A.STUDENTID = S.STUDENTID WHERE CS.CLASSID=? ' +
				'GROUP BY S.STUDENTID ORDER BY S.STUDENTID ';
		};
	};
	
	var sumsClause = function(absencesAlias) {
		var excusedSum = "";
		
		for (var i = 1; i <= 7; i++)
			excusedSum += ' + case when ' + absencesAlias + '.H' + i + ' >= ' + 
				AbsenceType.EXCUSED_PARENT + ' then 1 else 0 end';
		excusedSum = excusedSum.substr(2);
		
		var unExcusedSum = "";
		for (var i = 1; i <= 7; i++)
			unExcusedSum += ' + case when ' + absencesAlias + '.H' + i + ' between 1 AND ' + 
				(AbsenceType.EXCUSED_PARENT - 1) + ' then 1 else 0 end';
		unExcusedSum = unExcusedSum.substr(2);
		
		return ' SUM(' + unExcusedSum + ') UNEXCUSED, SUM(' + excusedSum + ') EXCUSED ';
	};
	
	var loadStudentAbsencesForDate = function(students, selectedDate, successCallback, errorCallback) {
		var dateFormatted = new JsSimpleDateFormat("yyyy-MM-dd").format(selectedDate);
		var studentIds = _.map(students, function(student){ return student.studentId; });
		
		var sql = 'SELECT A.STUDENTID AS STUDENTID, ' + sumsClause('A') +
				'FROM ABSENCES A WHERE A.STUDENTID IN (' + studentIds.join() +') AND A.ABSENCESDATE=? ' +
				'group by A.STUDENTID';
		
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.readTransaction(function (tx) {
			tx.executeSql(sql, [dateFormatted], 
				function (tx, results) {
					var len = results.rows.length;
					if (len === 0)
					{
						successCallback(students);
						return;
					}
					for (var i = 0; i < len; i++){
						var row = results.rows.item(i);
						var id = row.STUDENTID;
						var student = _.find(students, function(s){ return s.studentId === id; });
						if (student)
						{
							student.unexcusedAbsencesCount = row.UNEXCUSED;
							student.excusedAbsencesCount = row.EXCUSED;
						}
					}
					successCallback(students);
				}, 
				function (tx, e) {
					errorCallback(JSON.stringify(e));
			});
		});
	};
	
	var loadStudentsFromDb = function(sql, classId, successCallback, errorCallback) {
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.readTransaction(function (tx) {
			tx.executeSql(sql, [classId], 
				function (tx, results) {
					var len = results.rows.length, res = [];
					if (len === 0)
					{
						successCallback();
						return;
					}
					for (var i = 0; i < len; i++){
						var row = results.rows.item(i);
						res.push(new Student(row.studentId, row.firstName, row.lastName, row.fatherName, row.motherName,
							row.UNEXCUSED, row.EXCUSED));
					}
					successCallback(res);
				}, 
				function (tx, e) {
					errorCallback(JSON.stringify(e));
			});
		});
	}
	
	//	End of Helper  Methods
	
	return { 
		loadClasses: loadClasses, 
		loadClassStudents: loadClassStudents, 
		loadDaysWithAbsences: loadDaysWithAbsences,
		loadClassStudentsForDate: loadClassStudentsForDate
	};

})();



