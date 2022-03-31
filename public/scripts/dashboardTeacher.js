// Modal JS
// let modal = document.getElementById('qrCodeScannerModal')
// let btn = document.getElementById('scanQrCodeBtn')
// let span = document.getElementsByClassName("close")[0];

// btn.onclick = function () {
//     modal.style.display = "block";
//     scanQrCode()
// }

// span.onclick = function () {
//     modal.style.display = "none";
// }

// window.onclick = function (event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

let newClassModal = document.getElementById('addClassModal')
function addClass() {
    console.log('check 1');
    newClassModal.style.display = "block";
}

// let newClassModal = document.getElementById('addClassModal')
let classBtn = document.getElementById('addClass')
let classSpan = document.getElementsByClassName("close")[0];

classBtn.onclick = function () {
    console.log('check');
    newClassModal.style.display = "block";
}

classSpan.onclick = function () {
    newClassModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == newClassModal) {
        addClassModal.style.display = "none";
    }
}

//Menu Toggle
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

function markAttendance(qrCodeMessage) {
    document.getElementById('result').innerHTML = '<span class="result">' + qrCodeMessage + '</span>';
}

function errorInScanning(errorMessage) {
    //handle scan error
    console.log(errorMessage);
    // document.getElementById('result').innerHTML = '<span class="result">Some Internal Error occurred, please reload the page.<br>If problem persists please reach out to our developer team.</span>';
}

function scanQrCode() {
    console.log('test');
    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader", { fps: 10, qrbox: 300 });

    html5QrcodeScanner.render(markAttendance, errorInScanning);
}


// adding class js
// let classes = '<%- JSON.stringify(classes) %>'
// console.log(classes[0].name);

// let classes = <%- JSON.stringify(classes[0].name) %>;
// document.getElementById('classObj').style.display = 'block';
// document.getElementById('classObj').innerHTML = classes;
// console.log(classes);