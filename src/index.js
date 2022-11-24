var studentList = [];
var mode = 'create';
function submitForm() {
    if (mode === 'create') createStudent();
    else updateStudent();
}
function createStudent() {
    if (!validateForm()) return;
    var id = document.getElementById('txtMaSV').value;
    var fullName = document.getElementById('txtTenSV').value;
    var email = document.getElementById('txtEmail').value;
    var dob = document.getElementById('txtNgaySinh').value;
    var course = document.getElementById('khSV').value;
    var math = +document.getElementById('txtDiemToan').value;
    var physic = +document.getElementById('txtDiemLy').value;
    var chemistry = +document.getElementById('txtDiemHoa').value;
    for (var i = 0; i < studentList.length; i++) {
        if (studentList[i].studentId === id) return alert('Id đã tồn tại');
    }
    var student = new Student(id, fullName, email, dob, course, math, physic, chemistry);
    studentList.push(student);
    renderStudents();
    saveStudentList();
    resetForm();
}
function renderStudents(data) {
    data = data || studentList;
    var html = '';
    for (var i = 0; i < data.length; i++) {
        html +=
            `
            <tr>
                <td>${data[i].studentId}</td>
                <td>${data[i].fullName}</td>
                <td>${data[i].email}</td>
                <td>${data[i].dob}</td>
                <td>${data[i].course}</td>
                <td>${data[i].calcGPA()}</td>
                <td>
                    <button
                    onclick="getUpdateStudent('${data[i].studentId}')"
                    class='btn btn-info'>Edit</button>
                    <button
                    onclick="deleteStudent('${data[i].studentId}')"
                    class='btn btn-danger'>Xoá</button>
                </td>
            </tr>  
        `
    }
    document.getElementById('tbodySinhVien').innerHTML = html;
}
function saveStudentList() {
    localStorage.setItem('SL', JSON.stringify(studentList));
}
function getStudentList() {
    var studentListJson = localStorage.getItem('SL');
    if (!studentListJson) return [];
    else return JSON.parse(studentListJson);
}
function mapStudentList(local) {
    var result = [];
    for (var i = 0; i < local.length; i++) {
        var newStudent = new Student(
            local[i].studentId,
            local[i].fullName,
            local[i].email,
            local[i].dob,
            local[i].course,
            local[i].math,
            local[i].physic,
            local[i].chemistry,
        );
        result.push(newStudent);
    }
    return result;
}
function findById(id) {
    for (var i = 0; i < studentList.length; i++) {
        if (studentList[i].studentId === id) return i;
    }
    return -1;
}
function deleteStudent(id) {
    var index = findById(id);
    if (index === -1) return alert('Id không tồn tại');
    studentList.splice(index, 1);
    renderStudents();
    saveStudentList();
}
function getUpdateStudent(id) {
    var index = findById(id);
    if (index === -1) return alert('Id không tồn tại');
    var student = studentList[index];
    document.getElementById('txtMaSV').value = student.studentId;
    document.getElementById('txtTenSV').value = student.fullName;
    document.getElementById('txtEmail').value = student.email;
    document.getElementById('txtNgaySinh').value = student.dob;
    document.getElementById('khSV').value = student.course;
    document.getElementById('txtDiemToan').value = student.math;
    document.getElementById('txtDiemLy').value = student.physic;
    document.getElementById('txtDiemHoa').value = student.chemistry;

    document.getElementById('txtMaSV').disabled = true;
    mode = 'update';
    document.getElementById('btnCreate').innerHTML = 'Cập nhật';
    document.getElementById('btnCreate').classList.remove('btn-success');
    document.getElementById('btnCreate').classList.add('btn-primary');

    document.getElementById('btnCancel').style.display = 'inline-block';
}
function resetForm() {
    document.getElementById('btnCreate').innerHTML = 'Thêm sinh viên';
    document.getElementById('btnCreate').classList.add('btn-success');
    document.getElementById('btnCreate').classList.remove('btn-primary');

    document.getElementById('btnCancel').style.display = 'none';
    document.getElementById('form').reset();
    document.getElementById('txtMaSV').disabled = false;
    mode = 'create';
}
function updateStudent() {

    var id = document.getElementById('txtMaSV').value;
    var fullName = document.getElementById('txtTenSV').value;
    var email = document.getElementById('txtEmail').value;
    var dob = document.getElementById('txtNgaySinh').value;
    var course = document.getElementById('khSV').value;
    var math = +document.getElementById('txtDiemToan').value;
    var physic = +document.getElementById('txtDiemLy').value;
    var chemistry = +document.getElementById('txtDiemHoa').value;
    var index = findById(id);
    var student = studentList[index];
    student.studentId = id;
    student.fullName = fullName;
    student.email = email;
    student.dob = dob;
    student.course = course;
    student.math = math;
    student.physic = physic;
    student.chemistry = chemistry;
    renderStudents();
    saveStudentList();
    resetForm();
}
function searchStudent(e) {
    var keyword = e.target.value.trim().toLowerCase();
    var result = [];
    for (var i = 0; i < studentList.length; i++) {
        var studentId = studentList[i].studentId;
        var name = studentList[i].fullName.toLowerCase();
        if (keyword === studentId || name.includes(keyword)) {
            result.push(studentList[i]);
        }
    }
    renderStudents(result);
}

function lengthValid(val, config) {
    if (val.length < config.min || val.length > config.max) {
        document.getElementById(config.errorId).innerHTML = `Độ dài phải từ ${config.min} đến ${config.max} kí tự`;
        return false;
    }
    return true;
}
function regexName(val, config) {
    if (config.regex.test(val)) {
        document.getElementById(config.errorId).innerHTML = '';
        return true;
    }
    document.getElementById(config.errorId).innerHTML = 'Không đúng định dạng';
    return false;
}
function require(val, config) {
    var spanErrorList = [
        "Vui lòng nhập mã sinh viên",
        'Vui lòng nhập tên',
        'Vui lòng nhập Email',
        'Vui lòng chọn điểm toán',
        'Vui lòng chọn điểm lý',
        'Vui lòng chọn điểm hóa'
    ];

    var spanError = '';
    // check nếu cái object nhận vào có Key nào không là mảng rỗng 
    // thì ta cho object config.'Nào đó' gán vào thằng config.errorId luôn 
    if (config.errorId === 'studentIdError') {
        config.errorId = config.errorId;
        spanError = spanErrorList[0];
    }
    else if (config.errorName === 'nameError') {
        config.errorId = config.errorName;
        spanError = spanErrorList[1];
    }
    else if (config.errorEmail === 'emailError') {
        config.errorId = config.errorEmail;
        spanError = spanErrorList[2];
    }
    else if (config.errorMath === 'mathError') {
        config.errorId = config.errorMath;
        spanError = spanErrorList[3];
    }
    else if (config.errorPhysic === 'physicError') {
        config.errorId = config.errorPhysic;
        spanError = spanErrorList[4];
    }
    else if (config.errorChemistry === 'chemistryError') {
        config.errorId = config.errorChemistry;
        spanError = spanErrorList[5];
    }

    if (val.length > 0) {
        document.getElementById(config.errorId).innerHTML = '';
        return true;
    }
    document.getElementById(config.errorId).innerHTML = spanError;
    console.log(config);
    return false;
}
function requireDate() {
    var todayDate = new Date();
    var month = todayDate.getMonth() + 1;
    var day = todayDate.getDate();
    var year = todayDate.getFullYear();
    if (month < 10) month = '0' + month.toString();
    if (day < 10) day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    document.getElementById('txtNgaySinh').setAttribute('max', maxDate);
    console.log(document.getElementById('txtNgaySinh').value)
    const dateInput = document.getElementById('txtNgaySinh');

    if (!dateInput.value) {
        document.getElementById('dobError').innerHTML = 'Vui lòng chọn ngày sinh';
        return false;
    } else {
        document.getElementById('dobError').innerHTML = '';
        return true;
    }

}
function requireCourse() {
    var e = document.getElementById('khSV').value;
    if (e == 1) {
        document.getElementById('courseError').innerHTML = 'Vui lòng chọn khóa học';
        return false;
    }
    else {
        document.getElementById('courseError').innerHTML = '';
        return true;
    }

}
function validateForm() {
    var id = document.getElementById('txtMaSV').value;
    var fullName = document.getElementById('txtTenSV').value;
    var email = document.getElementById('txtEmail').value;
    var dob = document.getElementById('txtNgaySinh').value;
    var course = document.getElementById('khSV').value;
    var math = +document.getElementById('txtDiemToan').value;
    var physic = +document.getElementById('txtDiemLy').value;
    var chemistry = +document.getElementById('txtDiemHoa').value;
    var studentIdRegex = /^[0-9]*$/;
    var textRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/g;
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // regex test số thập phân có 2 chữ số 
    var numberPoint = /^0$|^[1-9](?:\.[0-9]{1,2})?$|^10(?:\.00?)?$/;


    // check Id student
    var studentIdValid =
        require(id, { errorId: 'studentIdError' }) &&
        lengthValid(id, { errorId: 'studentIdError', min: 3, max: 6 }) &&
        regexName(id, { regex: studentIdRegex, errorId: "studentIdError" });
    // check Name
    var studentNameValid =
        require(fullName, { errorName: 'nameError' }) &&
        regexName(fullName, { regex: textRegex, errorId: "nameError" });
    // check Email 
    var studentEmailValid =
        require(email, { errorEmail: 'emailError' }) &&
        regexName(email, { regex: emailRegex, errorId: "emailError" });

    var studentDob = requireDate();

    var studentCourse = requireCourse();

    var pointMath = require(id, { errorMath: 'mathError' }) &&
        regexName(math, { regex: numberPoint, errorId: 'mathError' });

    var pointPhysic = require(id, { errorPhysic: 'physicError' }) &&
        regexName(physic, { regex: numberPoint, errorId: 'physicError' });

    var pointChemistry = require(id, { errorChemistry: 'chemistryError' }) &&
        regexName(chemistry, { regex: numberPoint, errorId: 'chemistryError' });

    var isValid = studentIdValid && studentNameValid && studentEmailValid && studentDob && studentCourse && pointMath && pointPhysic && pointChemistry;

    console.log(isValid);
    return isValid;
}
window.onload = function () {
    studentList = mapStudentList(getStudentList());
    renderStudents();
}
