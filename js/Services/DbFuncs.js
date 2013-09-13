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
	
	var loadClassStudents = function (classId) {
	};
	
	return { loadClasses: loadClasses, loadClassStudents: loadClassStudents };

})();



