function Student(studentId, fullName, email, dob, course, math, physic, chemistry) {
    this.studentId = studentId;
    this.fullName = fullName;
    this.email = email;
    this.dob = dob;
    this.course = course;
    this.math = math;
    this.physic = physic;
    this.chemistry = chemistry;
    this.calcGPA = function () {
        return ((this.math + this.chemistry + this.physic) / 3).toFixed(2)
    }
}