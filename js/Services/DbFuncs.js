DbFuncs = (function () {
    
    var login = function (user, pwd, successCallback, errorCallback) {
        successCallback = successCallback || function(data) {};
        errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};

        var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
        db.readTransaction(function (tx) {
            tx.executeSql('SELECT * FROM USERS', [], 
                function (tx, results) {
                    if (results.rows.length === 0)
                        DbSync.pull(user, pwd, authenticate, successCallback, errorCallback);
                    else
                        authenticate(user, pwd, successCallback, errorCallback);
                }, 
                function (tx, e) {
                    DbSync.pull(user, pwd, authenticate, successCallback, errorCallback);
                });
        });
    };

    var authenticate = function(user, pwd, successCallback, errorCallback) {
        var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
        db.readTransaction(function (tx) {
            tx.executeSql('SELECT * FROM USERS WHERE userName=?', [user], 
                function (tx, results) {
                    if (results.rows.length === 0 || results.rows.item(0).userPassword !== pwd)
                        errorCallback("Λάθος Όνομα Χρήστη !");
                    else {
                        PageStateManager.yearStart = 2013;
                        PageStateManager.yearEnd = 2014;
                        PageStateManager.userName = user;
                        PageStateManager.userPassword = pwd;
                        successCallback();
                    }
                },
                function (e) { 
					$.mobile.loading('hide');
					errorCallback('Δεν φορτώθηκαν δεδομένα από τον server !');
				}
            );
        });
    }

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
	
    var loadStudentsAbsencesForClassAndDate = function (aClass, selectedDate, successCallback, errorCallback) {
            successCallback = successCallback || function(data) {};
            errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};

            var sql = createClassStudentsSql();
            loadStudentsFromDb(sql, aClass.classId, 
                    function(students) {
                            loadSumsAbsences(students, selectedDate, successCallback, errorCallback)
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

            var sql = 'SELECT DISTINCT absencesDate ' +
                    'FROM ABSENCES A INNER JOIN CLASS_STUDENTS CS ON A.STUDENTID=CS.STUDENTID ' +
                    'WHERE CS.CLASSID=? AND A.ABSENCESDATE BETWEEN ? AND ? ' +
                    'ORDER BY absencesDate';
            var fmt = new JsSimpleDateFormat("yyyy-MM-dd");
            var fromDate = fmt.format(firstDayOfMonth);
            var toDate = DateFuncs.endOfMonth(firstDayOfMonth);

            var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
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
                                            res.push(fmt.parse(row.absencesDate));
                                    }
                                    successCallback(res);
                            }, 
                            function (tx, e) {
                                    errorCallback(JSON.stringify(e));
                    });
            });
    };

    var loadStudentAbsencesForDate= function (selectedStudent, selectedDate, successCallback, errorCallback) {
            successCallback = successCallback || function(data) {};
            errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};

            var dateFormatted = new JsSimpleDateFormat("yyyy-MM-dd").format(selectedDate);
            var studentId = selectedStudent.studentId;

            var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
            db.readTransaction(function (tx) {
                    tx.executeSql('SELECT * FROM ABSENCES A WHERE A.STUDENTID=? AND A.ABSENCESDATE=?', 
                            [studentId, dateFormatted], 
                            function (tx, results) {
                                    if (results.rows.length === 0)
                                            successCallback(new Absences(studentId, selectedDate, 0, 0, 0, 0, 0, 0, 0));
                                    else 
                                    {
                                            var a = results.rows.item(0);
                                            successCallback(new Absences(studentId, selectedDate, a.h1, a.h2, a.h3, a.h4, a.h5, a.h6, a.h7));
                                    }
                            }, 
                            function (tx, e) {
                                    errorCallback(JSON.stringify(e));
                    });
            });
    };

    var updateAbsences = function(absences, successCallback, errorCallback) {
            successCallback = successCallback || function() {};
            errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};

            var d = new JsSimpleDateFormat('yyyy-MM-dd').format(absences.absencesDate);
            var updateValues = [absences.h1, absences.h2, absences.h3, 
                    absences.h4, absences.h5, absences.h6, absences.h7, absences.studentId, d];
            var logValues = [absences.studentId, d, absences.h1, absences.h2, absences.h3, 
                    absences.h4, absences.h5, absences.h6, absences.h7, 'u'];

            var absencesSql = 'UPDATE ABSENCES SET h1=?,h2=?,h3=?,h4=?,h5=?,h6=?,h7=? WHERE studentId=? AND absencesDate=?';
            var absencesLogSql = 'INSERT INTO ABSENCES_LOG (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7,stmtType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
            db.transaction(function (tx) {
                tx.executeSql(absencesSql, updateValues,
                    function () {
                        tx.executeSql(absencesLogSql, logValues,
                            function () { 
                                successCallback();
                            },
                            function (t1, e) {
                                errorCallback(JSON.stringify(e));
                            }
                        );
                    },
                    function (t2, e) {
                        errorCallback(JSON.stringify(e));
                    }
                );
            });
    };

    var saveNewAbsences = function(absences, successCallback, errorCallback) {
            successCallback = successCallback || function() {};
            errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};

            var values = [absences.studentId, new JsSimpleDateFormat('yyyy-MM-dd').format(absences.absencesDate),
                    absences.h1, absences.h2, absences.h3, absences.h4, absences.h5, absences.h6, absences.h7];
            var logValues = [absences.studentId, new JsSimpleDateFormat('yyyy-MM-dd').format(absences.absencesDate),
                    absences.h1, absences.h2, absences.h3, absences.h4, absences.h5, absences.h6, absences.h7, 'i'];
            var absencesSql = 'INSERT INTO ABSENCES (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            var absencesLogSql = 'INSERT INTO ABSENCES_LOG (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7,stmtType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
            db.transaction(function (tx) {
                    tx.executeSql(absencesSql, values,
                            function () {
                                    tx.executeSql(absencesLogSql, logValues,
                                            function () { 
                                                    successCallback();
                                            },
                                            function (t1, e) {
                                                    errorCallback(JSON.stringify(e));
                                            }
                                    );
                            },
                            function (t2, e) {
                                    errorCallback(JSON.stringify(e));
                            }
                    );
            });
    };

    var deleteAbsences = function(absences, successCallback, errorCallback) {
            successCallback = successCallback || function() {};
            errorCallback = errorCallback || function(e) { alert(JSON.stringify(e));};

            var d = new JsSimpleDateFormat('yyyy-MM-dd').format(absences.absencesDate);
            var deleteValues = [absences.studentId, d];
            var logValues = [absences.studentId, d, absences.h1, absences.h2, absences.h3, 
                    absences.h4, absences.h5, absences.h6, absences.h7, 'd'];

            var absencesSql = 'DELETE FROM ABSENCES WHERE studentId=? AND absencesDate=?';
            var absencesLogSql = 'INSERT INTO ABSENCES_LOG (studentId,absencesDate,h1,h2,h3,h4,h5,h6,h7,stmtType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            var db = openDatabase(Constants.DB_NAME, '1.0', 'Test DB', Constants.DB_SIZE);
            db.transaction(function (tx) {
                tx.executeSql(absencesSql, deleteValues,
                    function () {
                        tx.executeSql(absencesLogSql, logValues,
                            function () { 
                                successCallback();
                            },
                            function (t1, e) {
                                errorCallback(JSON.stringify(e));
                            }
                        );
                    },
                    function (t2, e) {
                        errorCallback(JSON.stringify(e));
                    }
                );
            });
    };

    //	Helper Private Methods
    //
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
                            AbsenceEnum.EXCUSED_PARENT + ' then 1 else 0 end';
            excusedSum = excusedSum.substr(2);

            var unExcusedSum = "";
            for (var i = 1; i <= 7; i++)
                    unExcusedSum += ' + case when ' + absencesAlias + '.H' + i + ' between 1 AND ' + 
                            (AbsenceEnum.EXCUSED_PARENT - 1) + ' then 1 else 0 end';
            unExcusedSum = unExcusedSum.substr(2);

            return ' SUM(' + unExcusedSum + ') UNEXCUSED, SUM(' + excusedSum + ') EXCUSED ';
    };

    var loadSumsAbsences = function(students, selectedDate, successCallback, errorCallback) {
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
    //
    //	End of Helper  Methods

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

})();



