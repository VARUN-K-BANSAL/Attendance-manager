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


// Global 

let stdSet = new Set();
let i = 0;

/* Scanning Qr Code js */

// let closeBtnEl = document.querySelector(".close");

// closeBtnEl.addEventListener("click" , () => {
//     console.log("click close !!!!")
// })

function markAttendance(qrCodeMessage) {
    console.log(`QR = ${qrCodeMessage}`);
    stdSet.add(qrCodeMessage);
    console.log(stdSet)
    document.getElementById('result').innerHTML = '<span class="result">' + qrCodeMessage + '</span>';
}

function errorInScanning(errorMessage) {
    //handle scan error
    console.log(errorMessage);
    // document.getElementById('result').innerHTML = '<span class="result">Some Internal Error occurred, please reload the page.<br>If problem persists please reach out to our developer team.</span>';
}


function scanQrCode() {
    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: 300 });

    html5QrcodeScanner.render(markAttendance, errorInScanning);
}
