StudentAbsencesForDateViewModel = function(selectedDate, selectedStudent, loadStudentAbsencesForDateFunc, myLog) {
	
    self = this;

    self.selectedDate = selectedDate || PageStateManager.currentDate;
    if (selectedDate) 
            PageStateManager.currentDate = selectedDate;

    self.selectedStudent = selectedStudent || PageStateManager.currentStudent;
    if (selectedStudent) 
            PageStateManager.currentStudent = selectedStudent;

    self.log = myLog || function(err) { console.log(err); };

	var absenceTypesArray = function() {
		return [{id:AbsenceEnum.UNEXCUSED_FIRST, d:'Αδικ/1η ώρα'},
			{id:AbsenceEnum.UNEXCUSED_MIDDLE, d:'Αδικ/Ενδ. ώρα'},
			{id:AbsenceEnum.UNEXCUSED_LAST, d:'Αδικ/Τελ. ώρα'},
			{id:AbsenceEnum.EXPELLED_SINGLE, d:'Αποβ/1 ώρα'},
			{id:AbsenceEnum.EXPELLED_DAILY, d:'Αποβ/Ολοήμ.'},
			{id:AbsenceEnum.EXCUSED_PARENT, d:'Δικ/Κηδ.'},
			{id:AbsenceEnum.EXCUSED_DAILY_PARENT, d:'Δικ/Κηδ-Ολοημ.'},
			{id:AbsenceEnum.EXCUSED_DOCTOR, d:'Δικ/Ιατρό'},
			{id:AbsenceEnum.EXCUSED_HEAD, d:'Αδικ/Ενδ. ώρα'},
			{id:AbsenceEnum.EXCUSED_DAILY_PARENT, d:'Δικ/Διευθ.'}];
	};
	
    self.h1Array = ko.observableArray(absenceTypesArray());
	self.h1 = ko.observable();
	
	self.h2 = ko.observable();

    self.save = function() 
	{
		self.log(self.h1());
	};
	
    loadStudentAbsencesForDateFunc = loadStudentAbsencesForDateFunc || 
                    DbFuncs.loadStudentAbsencesForDate;
    loadStudentAbsencesForDateFunc(self.selectedStudent, self.selectedDate, 
        function(a) { 
            try 
            {
//				self.h1(a.h1);
//				self.h2(a.h2);
				
				var a1 = _.find(self.h1Array(), function(ab){ return ab.id === a.h1; });
				self.h1(a1); 
//				$("#h1").val(a.h1);
                $("#h1").selectmenu("refresh", true);
				
				window.setTimeout(function() 
				{
					$("#h1").selectmenu("refresh", true);
				}, 1000);
            } 
            catch (e)
            {
                self.log(JSON.stringify(e));
            }
    });
	
	
};

