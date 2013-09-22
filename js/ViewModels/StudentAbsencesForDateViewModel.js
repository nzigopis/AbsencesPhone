StudentAbsencesForDateViewModel = function(selectedDate, selectedStudent, loadAbsencesFunc, myLog) {
	
    self = this;

    self.selectedDate = selectedDate || PageStateManager.currentDate;
    if (selectedDate) 
		PageStateManager.currentDate = selectedDate;

    self.selectedStudent = selectedStudent || PageStateManager.currentStudent;
    if (selectedStudent) 
		PageStateManager.currentStudent = selectedStudent;

  	self.headerData = (selectedStudent ? selectedStudent.studentInfo() : '') + ' - ' +
		(selectedDate ? new JsSimpleDateFormat("dd/MMM/yyyy", "el").format(selectedDate) : '');
	
    self.log = myLog || function(err) { console.log(err); };

	var absenceTypesArray = function() {
		return [{id:0, d:''},
			{id:AbsenceEnum.UNEXCUSED_FIRST, d:'Αδικ/1η ώρα'},
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

    self.comboData = _.invoke(_.range(7), absenceTypesArray);
	self.absences = _.invoke(_.range(7), ko.observable);
	
	var absenceChanged = function(newValue, index, absence) {
		console.log(newValue, index, JSON.stringify(absence()));
	};
	
	var enableSubscriptions = function() {
		_.each(self.absences, function(elem, index) { 
			elem.subscribe(function f(newValue) { 
				absenceChanged(newValue, index, elem); 
			}); 
		});
	};
	
    self.save = function() 
	{
		
	};
	
  (loadAbsencesFunc || DbFuncs.loadStudentAbsencesForDate)(
		self.selectedStudent, self.selectedDate, 
        function(a) { 
            try 
            {
				_.each(_.range(7), 
					function(i) {
						var ax = a["h" + (i+1)];
						var absence = _.find(self.comboData[i], function(ab){ return ab.id === ax; });
						self.absences[i](absence); 
					}
				)
				
				setTimeout(function() {
					_.each(_.range(7), function(j) {
						var aCombo = $("#h"+(j+1)); 
						if (aCombo)
							aCombo.selectmenu("refresh", true);
					});
					enableSubscriptions();
					}, 1000);
            } 
            catch (e)
            {
                self.log(JSON.stringify(e));
            }
    });
	
	
};