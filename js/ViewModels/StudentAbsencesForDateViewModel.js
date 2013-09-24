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
	var absencesOriginal;
	
	self.save = function() 
	{
		if (isNewEntity())
		{
			var o = new Absences(absencesOriginal.studentId, absencesOriginal.absencesDate, 
				self.absences[0](), self.absences[1](), self.absences[2](), self.absences[3](), 
				self.absences[4](), self.absences[5](), self.absences[6]());
			DbFuncs.saveNewAbsences(o);
		};
	};
	
	var isNewEntity = function() {
		return absencesOriginal && 
			_.every(Object.keys(absencesOriginal), function (a) { 
					return !/h[1-7]/.test(a) || (absencesOriginal[a] === 0); 
				}) &&
			_.some(self.absences, function (a) { return a() !== 0; });
	};
	
	var absenceChanged = function(newValue, index, absence) {
		if (newValue === AbsenceEnum.UNEXCUSED_FIRST && index > 0)
		{
			for (var i = 0; i < index; i++)
				self.absences[i](AbsenceEnum.NOT_ABSENT);
			refreshCombos(500);
		}
		else if (newValue === AbsenceEnum.EXPELLED_DAILY)
		{
			for (var i = index; i < 7; i++)
				self.absences[i](AbsenceEnum.EXPELLED_DAILY);
			refreshCombos(500);
		};
	};
	
	var subscriptionsEnabled;
	var enableSubscriptions = function() {
		if (subscriptionsEnabled)
			return;
		_.each(self.absences, function(elem, index) { 
			elem.subscribe(function f(newValue) { 
				absenceChanged(newValue, index, elem); 
			}); 
		});
		subscriptionsEnabled = true;
	};

	var refreshCombos = function(timeout) {
		setTimeout(function() {
			_.each(_.range(7), function(j) {
				var aCombo = $("#h"+(j+1)); 
				if (aCombo)
					aCombo.selectmenu("refresh", true);
			});
			if (!enableSubscriptionsImmediately)
				enableSubscriptions();
			}, timeout || 1000);
	};
	
	(loadAbsencesFunc || DbFuncs.loadStudentAbsencesForDate)(
		self.selectedStudent, self.selectedDate, 
        function(a) { 
            try 
            {
				absencesOriginal = a;
				_.each(_.range(7), 
					function(i) {
						var ax = a["h" + (i+1)];
						self.absences[i](ax); 
					});
				
				if (enableSubscriptionsImmediately)
					enableSubscriptions();
				
				refreshCombos();
            } 
            catch (e)
            {
                self.log(JSON.stringify(e));
            }
    });
	
};