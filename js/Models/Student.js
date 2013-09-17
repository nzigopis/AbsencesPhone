Student = function (studentId, firstName, lastName, fatherName, motherName, 
	unexcusedAbsencesCount, excusedAbsencesCount ) {

    this.studentId = studentId;
    this.firstName = firstName;
	this.lastName = lastName;
	this.fatherName = fatherName;
	this.motherName = motherName;
	this.unexcusedAbsencesCount = unexcusedAbsencesCount || 0;
	this.excusedAbsencesCount = excusedAbsencesCount || 0;
	
	this.studentInfo = function(){
		return this.studentId + ' ' + this.lastName + ' ' + this.firstName ; 
//				this.unexcusedAbsencesCount + '(ΑΔΙΚ.)' + this.excusedAbsencesCount + '(ΔΙΚ.)';
	};
	
	this.studentAbsences = function(){
		return this.unexcusedAbsencesCount + ' δικ. / ' + this.excusedAbsencesCount + ' αδικ.';
	};
};