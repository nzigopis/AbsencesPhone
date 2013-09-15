Student = function (studentId, firstName, lastName, fatherName, motherName ) {

    this.studentId = studentId;
    this.firstName = firstName;
	this.lastName = lastName;
	this.fatherName = fatherName;
	this.motherName = motherName;

	this.studentInfo = function(){
		return this.studentId + ' ' + this.lastName + ' ' + this.firstName;
	};
};