DbPersistence = (function() {
    var yyyyMMdd = new JsSimpleDateFormat('yyyy-MM-dd');
	
	var clearLog = function(allButThese) {
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.transaction(function(tx) {
			tx.executeSql('DELETE FROM ABSENCES_LOG WHERE ID NOT IN (?)', allButThese);
		});
	};
	
	var pushLogToServer = function(tx, successCallback) {
		tx.executeSql('SELECT * FROM ABSENCES_LOG', [],
            function(tx, results) {
                if (results.rows.length === 0)
					return;
				var log = [];
				for (var i = 0; i < results.rows.length; i++) 
				{
					var itm = results.rows.item(i);
					log.push(new AbsencesLog(itm.id, itm.stmtType, itm.studentId, 
						itm.absencesDate, itm.h1, itm.h2, itm.h3, itm.h4, itm.h5, itm.h6, itm.h7));
				}
				setTimeout(function() {
					DbSync.push(log, PageStateManager.userName, PageStateManager.userPassword, clearLog);
				}, 1000);				
			});
			
		successCallback();
	};
	
    var updateLog = function(tx, absences, stmtType, successCallback, errorCallback) {
		var d = yyyyMMdd.format(absences.absencesDate);
		var findLogEntrySql = 'SELECT * FROM ABSENCES_LOG WHERE studentId = ? AND absencesDate = ?';
        var selectValues = [absences.studentId, d];
		
        var updateLogSql = 'UPDATE ABSENCES_LOG SET h1=?,h2=?,h3=?,h4=?,h5=?,h6=?,h7=?,stmtType=? WHERE studentId=? AND absencesDate=?';
		var updateLogValues = [absences.h1, absences.h2, absences.h3, absences.h4, absences.h5, 
			absences.h6, absences.h7, stmtType, absences.studentId, d];
		var insertIntoLogSql= 'INSERT INTO ABSENCES_LOG (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7,stmtType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		var insertIntoLogValues = [absences.studentId, d, absences.h1, absences.h2, absences.h3,
                    absences.h4, absences.h5, absences.h6, absences.h7, stmtType];
		    
		tx.executeSql(findLogEntrySql, selectValues,
            function(tx, results) {
                if (results.rows.length === 0)
                    tx.executeSql(insertIntoLogSql, insertIntoLogValues,
                        function() { pushLogToServer(tx, successCallback); },
                        function(t1, e) { errorCallback(JSON.stringify(e)); }
                    );
                else
                    tx.executeSql(updateLogSql, updateLogValues,
                        function() { pushLogToServer(tx, successCallback); },
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

            var d = yyyyMMdd.format(absences.absencesDate);
            var updateValues = [absences.h1, absences.h2, absences.h3,
                    absences.h4, absences.h5, absences.h6, absences.h7, absences.studentId, d];
            var absencesSql = 'UPDATE ABSENCES SET h1=?,h2=?,h3=?,h4=?,h5=?,h6=?,h7=? WHERE studentId=? AND absencesDate=?';
            
            var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
            db.transaction(function(tx) {
                tx.executeSql(absencesSql, updateValues,
                    function() {
                        updateLog(tx, absences, 'u', successCallback, errorCallback);
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

		var values = [absences.studentId, yyyyMMdd.format(absences.absencesDate),
			absences.h1, absences.h2, absences.h3, absences.h4, absences.h5, absences.h6, absences.h7];
		var absencesSql = 'INSERT INTO ABSENCES (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
		
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.transaction(function(tx) {
			tx.executeSql(absencesSql, values,
					function() {
						updateLog(tx, absences, 'i', successCallback, errorCallback);
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

		var d = yyyyMMdd.format(absences.absencesDate);
		var deleteValues = [absences.studentId, d];
		var absencesSql = 'DELETE FROM ABSENCES WHERE studentId=? AND absencesDate=?';
		
		var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
		db.transaction(function(tx) {
			tx.executeSql(absencesSql, deleteValues,
					function() {
						updateLog(tx, absences, 'd', successCallback, errorCallback);
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

