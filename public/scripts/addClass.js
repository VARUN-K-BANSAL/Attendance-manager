"use strict"

// let addClassModal = document.querySelector(".addClassModal");
// // let closeButton = document.querySelector(".closeM")
// // let id = ""

// function closeAddModal() {
//     addClassModal.style.display = "none";
// }

let classTemplate = (name) => {
    return `<div class="class">
    <div class = "class_name" id = "${name}">
        <h3>${name}</h3>
    </div>                    
    <div class = "function_links">
        <button class = "btn ${name}" id="scanQrCodeBtn" style="border: none; outline: none;" onclick="showScanQrCode()">Scan QR Code</button>
        <a href="/showAttendance" class = "btn" target="__blank">Show Attendance</a>
        <a href="#" class = "btn">Generate QR</a>
        <a href="#" class = "btn">Add Student</a>
        <a href="#" class = "btn">Add Teacher</a>
        <a href="/removeClass/${name}" class = "btn">Remove Class</a>
    </div>

    <div class="modal modal-animate" id="qrCodeScannerModal">
        <div class="modal-content">
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

    </div>`;
}

let initialClasses = document.querySelector(".classes").innerHTML;

// function addNewClass (){
//     console.log("click")
//     addClassModal.style.display = "block"; 
// }

function addClassFinal(name) {
    // let classVal = document.getElementById("className").value;

    // console.log(classVal);
    
    // let requiredClass = classTemplate.replace("${id}",String(classVal))

    initialClasses += classTemplate(name);
    document.querySelector(".classes").innerHTML = initialClasses;
    // addClassModal.style.display = "none";
}