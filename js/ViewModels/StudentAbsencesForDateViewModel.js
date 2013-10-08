StudentAbsencesForDateViewModel = function(selectedDate, selectedStudent,  
        myLog, enableSubscriptionsImmediately) {
    self = this;

    self.selectedDate = selectedDate || PageStateManager.currentDate;
    if (selectedDate) 
        PageStateManager.currentDate = selectedDate;

    self.selectedStudent = selectedStudent || PageStateManager.currentStudent;
    if (selectedStudent) 
        PageStateManager.currentStudent = selectedStudent;

    self.headerData = (selectedStudent ? selectedStudent.studentInfo() : '') + ' - ' +
        (selectedDate ? new JsSimpleDateFormat("dd/MMM/yyyy", "el").format(selectedDate) : '');
	
    myLog = myLog || function(err) { console.log(err); };

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
    //Used for Html combo binding
    self.absenceIds = [];
    for (var absenceId in AbsenceEnum)
        self.absenceIds.push(AbsenceEnum[absenceId]);

    self.absences = _.invoke(_.range(7), ko.observable);
    var absencesOriginal;

    self.getOriginal = function() {
        return new Absences(absencesOriginal.studentId, absencesOriginal.absencesDate, 
            self.absences[0](), self.absences[1](), self.absences[2](), self.absences[3](), 
            self.absences[4](), self.absences[5](), self.absences[6]());
    };
	
	self.save = function() 
    {
        try
        {
            var o = new Absences(absencesOriginal.studentId, absencesOriginal.absencesDate, 
                self.absences[0](), self.absences[1](), self.absences[2](), self.absences[3](), 
                self.absences[4](), self.absences[5](), self.absences[6]());

			var succeededCallback = function() {
				absencesOriginal = o;
				$.mobile.loading('hide');
			};
			var errorCallback = function(e) {
				$.mobile.loading('hide');
				myLog(e);
			};
			
            $.mobile.loading('show');
            if (self.isNewEntity())
                DbFuncs.saveNewAbsences(o, succeededCallback, errorCallback);
            else if (self.isModifiedEntity())
                DbFuncs.updateAbsences(o, succeededCallback, errorCallback);
            else if (self.isDeletedEntity())
                DbFuncs.deleteAbsences(o, succeededCallback, errorCallback);
            else
                $.mobile.loading('hide');
        }
        catch(err)
        {
            myLog(err);
        }
    };

    self.isNewEntity = function() {
        return absencesOriginal && 
            _.every(Object.keys(absencesOriginal), function (a) { 
                    return !/h[1-7]/.test(a) || (absencesOriginal[a] === 0); 
                }) &&
            _.some(self.absences, function (a) { return a() !== 0; });
    };

    self.isModifiedEntity = function() {
        return absencesOriginal && 
            _.some(Object.keys(absencesOriginal), function (a) { 
                    return /h[1-7]/.test(a) && (absencesOriginal[a] !== self.absences[a.substring(1)-1]()); 
                }) &&
            _.some(self.absences, function (a) { return a() !== 0; });
    };

    self.isDeletedEntity = function() {
        return absencesOriginal && 
            _.some(Object.keys(absencesOriginal), function (a) { 
                  return /h[1-7]/.test(a) && (absencesOriginal[a] !== 0); 
                }) &&
            _.every(self.absences, function (a) { return a() === 0; });
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

    DbFuncs.loadStudentAbsencesForDate(self.selectedStudent, self.selectedDate, 
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
                myLog(JSON.stringify(e));
            }
        });
	
};