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
	
	var loadClassStudents = function (aClass, successCallback, errorCallback) {
		
		successCallback = successCallback || function(data) {};
		
		errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};
		
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		
		var excusedSum = "";
		for (var i = 1; i <= 7; i++)
		{
			excusedSum += ' + case when A.H' + i + ' >= ' + AbsenceType.EXCUSED_PARENT + ' then 1 else 0 end';
		}
		excusedSum = excusedSum.substr(2);
		
		var unExcusedSum = "";
		for (var i = 1; i <= 7; i++)
		{
			unExcusedSum += ' + case when A.H' + i + ' between 1 AND ' + (AbsenceType.EXCUSED_PARENT - 1) + ' then 1 else 0 end';
		}
		unExcusedSum = unExcusedSum.substr(2);
		var sql = 'SELECT S.*, SUM(' + unExcusedSum + ') UNEXCUSED, SUM(' + 
				excusedSum + ') EXCUSED ' +
				'FROM STUDENTS S INNER JOIN CLASS_STUDENTS CS ON S.STUDENTID = CS.STUDENTID ' +
				'LEFT JOIN ABSENCES A ON A.STUDENTID = S.STUDENTID WHERE CS.CLASSID=? ' +
				'GROUP BY S.STUDENTID ORDER BY S.STUDENTID '

		
		db.readTransaction(function (tx) {
			tx.executeSql(sql, 
				[aClass.classId], 
				function (tx, results) {
					var len = results.rows.length, res = [];
					if (len === 0)
					{
						successCallback();
						return;
					}
					for (var i = 0; i < len; i++){
						var row = results.rows.item(i);
						res.push(new Student(row.studentId, row.firstName, row.lastName, row.fatherName, row.motherName));
					}
					successCallback(res);
				}, 
				function (tx, e) {
					errorCallback(JSON.stringify(e));
			});
		});
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
		var toDate = endOfMonth(firstDayOfMonth);
		
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
	
	var lastDayOfMonth = function(month) {
		switch(month)
		{
			case 1:
				return 28;
			case 8:
			case 10:
			case 3:
				return 30;
			default:
				return 31;
		}	
	};
	
	var endOfMonth = function(firstDateOfMonth) {
		var day = lastDayOfMonth(firstDateOfMonth.getMonth());
		
		var endDate = new Date(firstDateOfMonth.getFullYear(), firstDateOfMonth.getMonth(), day);
		return new JsSimpleDateFormat("yyyy-MM-dd").format(endDate);
	};
	
	var monthNameToNum = function(monthName) {
		switch(monthName)
		{
		case 'Σεπτέμβριος':
			return 8;
		case 'Οκτώβριος':
			return 9;
		case 'Νοέμβριος':
			return 10;
		case 'Δεκέμβριος':
			return 11;
		case 'Ιανουάριος':
			return 0;
		case 'Φεβρουάριος':
			return 1;
		case 'Μάρτιος':
			return 2;
		case 'Απρίλιος':
			return 3;
		case 'Μάιος':
			return 4;
		}
	};
	
	return { loadClasses: loadClasses, loadClassStudents: loadClassStudents, 
				loadDaysWithAbsences: loadDaysWithAbsences, lastDayOfMonth: lastDayOfMonth };

})();



