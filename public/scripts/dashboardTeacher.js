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

//Menu Toggle JS
let toggle = document.querySelector('.toggle');
let navigation = document.querySelector('.navigation');
let main = document.querySelector('.main');

toggle.onclick = function () {
    navigation.classList.toggle('active');
    main.classList.toggle('active')
}

let list = document.querySelectorAll('.navigation li ');

function activelink() {
    list.forEach((item) =>
        item.classList.remove('hovered'));
    this.classList.add('hovered');
}
list.forEach((item) =>
    item.addEventListener('mouseover', activelink));


// Scanning QR and Marking attendance

let stdSet = new Set();
let i = 0;

// let attendInpEl = document.getElementById("attendanceInput");
// let attendBtnEl = document.querySelector(".attendance_btn");


let addStudentAttendance = () => {

    let attendInpEl = document.getElementById("attendanceInput");

    let stdStr = "";
    stdSet.forEach((ele) => {
        stdStr += `${ele};;`;
    })

    // console.log("Click !!")

    // console.log(`stdStr = ${stdStr}`);

    // console.log(attendInpEl)

    attendInpEl.value = stdStr;

    // console.log(`input field = ${attendInpEl.value}`);

}

function markAttendance(qrCodeMessage) {
    // console.log(`QR = ${qrCodeMessage}`);
    stdSet.add(qrCodeMessage);
    // console.log(stdSet)
    document.getElementById('result').innerHTML = '<div style = "margin: 1rem 0rem;" class="result">' + qrCodeMessage + '</div>';
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
