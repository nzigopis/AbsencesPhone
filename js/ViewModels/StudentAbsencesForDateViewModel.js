StudentAbsencesForDateViewModel = function(
		selectedDate, selectedStudent, loadAbsencesFunc, myLog, enableSubscriptionsImmediately) {
	
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

	self.absenceName = function (a) {
		switch (a) {
			case AbsenceEnum.NOT_ABSENT: return '';
			case AbsenceEnum.UNEXCUSED_FIRST: return 'Αδικ/1η ώρα';
			case AbsenceEnum.UNEXCUSED_MIDDLE: return 'Αδικ/Ενδ. ώρα';
			case AbsenceEnum.UNEXCUSED_LAST: return 'Αδικ/Τελ. ώρα';
			case AbsenceEnum.EXPELLED_SINGLE: return 'Αποβ/Ωριαία';
			case AbsenceEnum.EXPELLED_DAILY: return 'Αποβ/Ολοήμ.';
			case AbsenceEnum.EXCUSED_PARENT: return 'Δικαιολ./Κηδ.';
			case AbsenceEnum.EXCUSED_DOCTOR: return 'Δικαιολ./Ιατρό';
			case AbsenceEnum.EXCUSED_HEAD: return 'Δικαιολ./Διευθ.';
			default: return '';
		};
	};
	
	self.absenceIds = [];
	for (var absenceId in AbsenceEnum)
		self.absenceIds.push(AbsenceEnum[absenceId]);

	self.absences = _.invoke(_.range(7), ko.observable);
	
	var absenceChanged = function(newValue, index, absence) {
		if (newValue === AbsenceEnum.UNEXCUSED_FIRST && index > 0)
		{
			for (var i = 0; i < index; i++)
				self.absences[i](AbsenceEnum.NOT_ABSENT);
		}
		else if (newValue === AbsenceEnum.EXPELLED_DAILY)
		{
			for (var i = index; i < 7; i++)
				self.absences[i](AbsenceEnum.EXPELLED_DAILY);
		};
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
						self.absences[i](ax); 
					}
				)
				
				if (enableSubscriptionsImmediately)
					enableSubscriptions();
				
				setTimeout(function() {
					_.each(_.range(7), function(j) {
						var aCombo = $("#h"+(j+1)); 
						if (aCombo)
							aCombo.selectmenu("refresh", true);
					});
					if (!enableSubscriptionsImmediately)
						enableSubscriptions();
					}, 1000);
            } 
            catch (e)
            {
                self.log(JSON.stringify(e));
            }
    });
	
	
};