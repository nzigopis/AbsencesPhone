Student = function (studentId, firstName, lastName, fatherName, motherName, 
	unexcusedAbsencesCount, excusedAbsencesCount ) {

    this.studentId = studentId;
    this.firstName = firstName;
	this.lastName = lastName;
	this.fatherName = fatherName || '';
	this.motherName = motherName || '';
	this.unexcusedAbsencesCount = unexcusedAbsencesCount || 0;
	this.excusedAbsencesCount = excusedAbsencesCount || 0;
	
	this.studentInfo = function(){
		return this.lastName + ' ' + this.firstName + ' ' + this.fatherName.substring(0, 3); 
	};
	
	this.studentAbsences = function(){
		return this.excusedAbsencesCount + ' δικ. / ' + this.unexcusedAbsencesCount + ' αδικ.';
	};
};