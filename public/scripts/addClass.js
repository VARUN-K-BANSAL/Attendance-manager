let classTemplate = (name) => {
    return `<div class="class">
    <div class = "class_name" id = "${name}">
        <h3>${name}</h3>
    </div>                    
    <div class = "function_links">
        <button class = "btn ${name}" id="scanQrCodeBtn" style="border: none; outline: none;" onclick="showScanQrCode()">Scan QR Code</button>
        <a href="/showAttendance" class = "btn" target="__blank">Show Attendance</a>
        <a href="/generateQrCode/${name}" class = "btn">Generate QR</a>
        <button href="#" class="btn ${name}" id="addStudentBtn" style="border: none; outline: none;" onclick="addStudent()">Add Student</button>
        <button href="#" class="btn ${name}" id="addTeacherBtn" style="border: none; outline: none;" onclick="addTeacher()">Add Teacher</button>
        <a href="/removeClass/${name}" class = "btn">Remove Class</a>
    </div>

    <div class="modal" id="qrCodeScannerModal">
        <div class="modal-content modal-animate">
            <a class="close" onclick="closeScanningModal()">&times;</a>
            <div class="row">
                <div class="col">
                    <div id="reader"></div>
                </div>
                <div class="col" style="padding:3rem;">
                    <h4>SCAN RESULT</h4>
                    <div id="result">Result Here</div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" id="addStudentModal">
        <div class="small-modal-content modal-animate">
            <a class="close" onclick="closeAddStudentModal()">&times;</a>
            <form action="/addStudent/${name}" method="POST">
                <input type="text" name="studentEmail" id="addStudentInput">
                <button type="submit" class="btn">Add Student</button>
            </form>
        </div>
    </div>
    <div class="modal" id="addTeacherModal">
        <div class="small-modal-content modal-animate">
            <a class="close" onclick="closeAddTeacherModal()">&times;</a>
            <h2>Add Teacher</h2>
            <form action="/addTeacher/${name}" method="POST">
                <input type="text" name="teacherEmail" id="addTeacherInput">
                <button type="submit" class="btn">Add Teacher</button>
            </form>
        </div>
    </div>

    </div>`
}

let initialClasses = document.querySelector(".classes").innerHTML;

function addClassFinal(name) {
    initialClasses += classTemplate(name);
    document.querySelector(".classes").innerHTML = initialClasses;
    // addClassModal.style.display = "none";
}