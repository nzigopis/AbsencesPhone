StudentAbsencesForDateViewModel = function(selectedDate, selectedStudent, loadStudentAbsencesForDateFunc, myLog) {
	
    self = this;

    self.selectedDate = selectedDate || PageStateManager.currentDate;
    if (selectedDate) 
            PageStateManager.currentDate = selectedDate;

    self.selectedStudent = selectedStudent || PageStateManager.currentStudent;
    if (selectedStudent) 
            PageStateManager.currentStudent = selectedStudent;

    self.log = myLog || function(err) { console.log(err); };

    self.absenceTypes = ko.observableArray([
        new AbsenceType(0, ''),
        new AbsenceType(AbsenceEnum.UNEXCUSED_FIRST, 'Αδικ/1η ώρα'),
        new AbsenceType(AbsenceEnum.UNEXCUSED_MIDDLE, 'Αδικ/Ενδ. ώρα'),
        new AbsenceType(AbsenceEnum.UNEXCUSED_LAST, 'Αδικ/Τελ. ώρα'),
        new AbsenceType(AbsenceEnum.EXPELLED_SINGLE, 'Αποβ/1 ώρα'),
        new AbsenceType(AbsenceEnum.EXPELLED_DAILY, 'Αποβ/Ολοήμ.'),
        new AbsenceType(AbsenceEnum.EXCUSED_PARENT, 'Δικ/Κηδ.'),
        new AbsenceType(AbsenceEnum.EXCUSED_DAILY_PARENT, 'Δικ/Κηδ-Ολοημ.'),
        new AbsenceType(AbsenceEnum.EXCUSED_DOCTOR, 'Δικ/Ιατρό'),
        new AbsenceType(AbsenceEnum.EXCUSED_HEAD, 'Δικ/Διευθ.')
    ]);
	
	self.h1a = ko.observable();

    self.save = function() 
	{
		self.log(self.h1a());
	};
	
    loadStudentAbsencesForDateFunc = loadStudentAbsencesForDateFunc || 
                    DbFuncs.loadStudentAbsencesForDate;
    loadStudentAbsencesForDateFunc(self.selectedStudent, self.selectedDate, 
        function(a) { 
            try 
            {
//				self.h1a(a.h1);
				var a1 = _.find(self.absenceTypes(), function(ab){ return ab.absenceValue === a.h1; });
				self.h1a(a1); 
//				$("#h1").val(a.h1);
//                window.setTimeout(function() 
//				{
//					$("#h1").selectmenu('refresh', true);
//				}, 100);
            } 
            catch (e)
            {
                self.log(JSON.stringify(e));
            }
    });
};

