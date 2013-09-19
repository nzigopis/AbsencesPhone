StudentAbsencesForDateViewModel = function(selectedDate, selectedStudent, loadStudentAbsencesForDateFunc, myLog) {
	
    self = this;

    self.selectedDate = selectedDate || PageStateManager.currentDate;
    if (selectedDate) 
            PageStateManager.currentDate = selectedDate;

    self.selectedStudent = selectedStudent || PageStateManager.currentStudent;
    if (selectedStudent) 
            PageStateManager.currentStudent = selectedStudent;

    self.h1a = ko.observable();

    self.log = myLog || function(err) { console.log(err); };

    self.absenceTypes = ko.observableArray([
        {id: 0, desc: ''},
        {id: AbsenceType.UNEXCUSED_FIRST, desc: 'Αδικ/1η ώρα'},
        {id: AbsenceType.UNEXCUSED_MIDDLE, desc: 'Αδικ/Ενδ. ώρα'},
        {id: AbsenceType.UNEXCUSED_LAST, desc: 'Αδικ/Τελ. ώρα'},
        {id: AbsenceType.EXPELLED_SINGLE, desc: 'Αποβ/1 ώρα'},
        {id: AbsenceType.EXPELLED_DAILY, desc: 'Αποβ/Ολοήμ.'},
        {id: AbsenceType.EXCUSED_PARENT, desc: 'Δικ/Κηδ.'},
        {id: AbsenceType.EXCUSED_DAILY_PARENT, desc: 'Δικ/Κηδ-Ολοημ.'},
        {id: AbsenceType.EXCUSED_DOCTOR, desc: 'Δικ/Ιατρό'},
        {id: AbsenceType.EXCUSED_HEAD, desc: 'Δικ/Διευθ.'}
    ]);
    loadStudentAbsencesForDateFunc = loadStudentAbsencesForDateFunc || 
                    DbFuncs.loadStudentAbsencesForDate;
    loadStudentAbsencesForDateFunc(self.selectedStudent, self.selectedDate, 
        function(a) { 
            try 
            {
                self.h1a(a.h1); 
                $("#h1").selectmenu("refresh");
            } 
            catch (e)
            {
                self.log(JSON.stringify(e));
            }
    });
};

