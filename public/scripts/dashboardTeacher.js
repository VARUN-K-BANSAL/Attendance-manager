// Modal JS

function showScanQrCode() {
    let modal = document.getElementById('qrCodeScannerModal')
    modal.style.display = "block";
    scanQrCode()
}

function addStudent() {
    let modal = document.getElementById('addStudentModal')
    modal.style.display = "block";
}

function addTeacher() {
    let modal = document.getElementById('addTeacherModal')
    modal.style.display = "block";
}

function closeScanningModal() {
    document.getElementById('qrCodeScannerModal').style.display = "none";
}
function closeAddStudentModal() {
    document.getElementById('addStudentModal').style.display = "none";
}
function closeAddTeacherModal() {
    document.getElementById('addTeacherModal').style.display = "none";
}

window.onclick = function (event) {
    if (event.target == document.getElementById('qrCodeScannerModal')) {
        document.getElementById('qrCodeScannerModal').style.display = "none";
    } else if (event.target == document.getElementById('addStudentModal')) {
        document.getElementById('addStudentModal').style.display = "none";
    } else if (event.target == document.getElementById('addTeacherModal')) {
        document.getElementById('addTeacherModal').style.display = "none";
    } else if (event.target == document.getElementById('addClassModal')) {
        document.getElementById('addClassModal').style.display = "none";
    }
}


// JS for adding new class modal
function addClass() {
    document.getElementById('addClassModal').style.display = "block";
}

function closeAddClassModal() {
    document.getElementById('addClassModal').style.display = "none";
}

// Scanning QR and Marking attendance

let stdSet = new Set();
let i = 0;
let addStudentAttendance = () => {

    let attendInpEl = document.getElementById("attendanceInput");
    let stdStr = "";
    stdSet.forEach((ele) => {
        stdStr += `${ele};;`;
    })
    attendInpEl.value = stdStr;
}

let classTemplate = (name) => {
    return `<div class="class">
    <div class = "class_name" id = "${name}">
        <h3>${name}</h3>
    </div>                    
    <div class = "function_links">
        <button class = "btn ${name}" id="scanQrCodeBtn" style="border: none; outline: none;" onclick="showScanQrCode()">Scan QR Code</button>
        <a href="/showAttendance/${name}" class = "btn" target="__blank">Show Attendance</a>
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
                    <h4 style = "margin-bottom: 2rem;">SCAN RESULT</h4>
                    <div id="result">Result Here</div>
                    
                    <form action="/markAttendance/${name}" class = "attendanceForm" method = "post">
                        <input id = "attendanceInput" type="text" name = "qrCodeArr" style = "display: none;">
                        <button type="submit" class = "attendance_btn btn" onclick = "addStudentAttendance()">Submit</button>
                    </form>
                    

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

$(document).ready(function () {
    $.getJSON('/getCookieDetails', function (user) {
        $.getJSON('/getClasses', function (classes) {
            // classesObj = classes
            // userObj = user
            let i = 0;
            while (classes[i] != undefined) {
                let j = 0;
                while (j < classes[i].teachers.length) {
                    if (classes[i].teachers[j].email == user["user"].email) {
                        let temp = classTemplate(classes[i].name, user['user'].email)
                        $('#classesSection').append(temp);
                        break;
                    }
                    j++;
                }
                i++;
            }
        })
    })
})


let prevRoll = ""

function markAttendance(qrCodeMessage) {
    // console.log(`QR = ${qrCodeMessage}`);
    stdSet.add(qrCodeMessage);
    // console.log(stdSet)
    let roll = qrCodeMessage.split("%%")
    if (prevRoll != roll[0]) {
        prevRoll = roll[0]
        $('#result').append('<div style = "margin: 1rem 0rem;" class="result">' + roll[0] + '</div>');
    }
}

function errorInScanning(errorMessage) {
    //handle scan error
    console.log(errorMessage);
    // document.getElementById('result').innerHTML = '<span class="result">Some Internal Error occurred, please reload the page.<br>If problem persists please reach out to our developer team.</span>';
}


function scanQrCode() {
    document.getElementById('result').innerHTML = '';
    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: 300 });

    html5QrcodeScanner.render(markAttendance, errorInScanning);
}

window.addEventListener('beforeunload', function(e) {
    if($('.result').length == 0) {
        return
    }
    e.preventDefault()
    e.returnValue = 'Please submit the attendance first'
})