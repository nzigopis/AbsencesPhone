DbPersistence = (function() {
    
    var updateLog = function(tx, logValues, successCallback, errorCallback) {
        var insertIntoLogSql = 'INSERT INTO ABSENCES_LOG (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7,stmtType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        var updateLogSql = 'UPDATE ABSENCES_LOG SET h1=?,h2=?,h3=?,h4=?,h5=?,h6=?,h7=?,stmtType=? WHERE studentId=? AND absencesDate=?';
        var findLogEntrySql = 'SELECT * FROM ABSENCES_LOG WHERE studentId = ? AND absencesDate = ?';
        var updateValues = [logValues.slice(2), logValues[0], logValues[1]];
        
        tx.executeSql(findLogEntrySql, [logValues[0], logValues[1]],
            function() {
                if (results.rows.length === 0)
                    tx.executeSql(insertIntoLogSql, logValues,
                        function() { successCallback(); },
                        function(t1, e) { errorCallback(JSON.stringify(e)); }
                    );
                else
                    tx.executeSql(updateLogSql, updateValues,
                        function() { successCallback(); },
                        function(t1, e) { errorCallback(JSON.stringify(e)); }
                    );
            },
            function(t1, e) {
                errorCallback(JSON.stringify(e));
            }
        );
    };
    
	var updateAbsences = function(absences, successCallback, errorCallback) {
            successCallback = successCallback || function() {
            };
            errorCallback = errorCallback || function(e) {
                    alert(JSON.stringify(e));
            };

            var d = new JsSimpleDateFormat('yyyy-MM-dd').format(absences.absencesDate);
            var updateValues = [absences.h1, absences.h2, absences.h3,
                    absences.h4, absences.h5, absences.h6, absences.h7, absences.studentId, d];
            var logValues = [absences.studentId, d, absences.h1, absences.h2, absences.h3,
                    absences.h4, absences.h5, absences.h6, absences.h7, 'u'];

            var absencesSql = 'UPDATE ABSENCES SET h1=?,h2=?,h3=?,h4=?,h5=?,h6=?,h7=? WHERE studentId=? AND absencesDate=?';
            
            var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
            db.transaction(function(tx) {
                tx.executeSql(absencesSql, updateValues,
                    function() {
                        updateLog(tx, logValues, successCallback, errorCallback);
                    },
                    function(t2, e) {
                        errorCallback(JSON.stringify(e));
                    }
                );
            });
	};

	var saveNewAbsences = function(absences, successCallback, errorCallback) {
		successCallback = successCallback || function() {
		};
		errorCallback = errorCallback || function(e) {
			alert(JSON.stringify(e));
		};

		var values = [absences.studentId, new JsSimpleDateFormat('yyyy-MM-dd').format(absences.absencesDate),
			absences.h1, absences.h2, absences.h3, absences.h4, absences.h5, absences.h6, absences.h7];
		var logValues = [absences.studentId, new JsSimpleDateFormat('yyyy-MM-dd').format(absences.absencesDate),
			absences.h1, absences.h2, absences.h3, absences.h4, absences.h5, absences.h6, absences.h7, 'i'];
		var absencesSql = 'INSERT INTO ABSENCES (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
		var absencesLogSql = 'INSERT INTO ABSENCES_LOG (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7,stmtType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.transaction(function(tx) {
			tx.executeSql(absencesSql, values,
					function() {
						tx.executeSql(absencesLogSql, logValues,
								function() {
									successCallback();
								},
								function(t1, e) {
									errorCallback(JSON.stringify(e));
								}
						);
					},
					function(t2, e) {
						errorCallback(JSON.stringify(e));
					}
			);
		});
	};

	var deleteAbsences = function(absences, successCallback, errorCallback) {
		successCallback = successCallback || function() {
		};
		errorCallback = errorCallback || function(e) {
			alert(JSON.stringify(e));
		};

		var d = new JsSimpleDateFormat('yyyy-MM-dd').format(absences.absencesDate);
		var deleteValues = [absences.studentId, d];
		var logValues = [absences.studentId, d, absences.h1, absences.h2, absences.h3,
			absences.h4, absences.h5, absences.h6, absences.h7, 'd'];

		var absencesSql = 'DELETE FROM ABSENCES WHERE studentId=? AND absencesDate=?';
		var absencesLogSql = 'INSERT INTO ABSENCES_LOG (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7,stmtType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.transaction(function(tx) {
			tx.executeSql(absencesSql, deleteValues,
					function() {
						tx.executeSql(absencesLogSql, logValues,
								function() {
									successCallback();
								},
								function(t1, e) {
									errorCallback(JSON.stringify(e));
								}
						);
					},
					function(t2, e) {
						errorCallback(JSON.stringify(e));
					}
			);
		});
	};

	return {
		saveNewAbsences: saveNewAbsences,
		updateAbsences: updateAbsences,
		deleteAbsences: deleteAbsences
	};
})();

