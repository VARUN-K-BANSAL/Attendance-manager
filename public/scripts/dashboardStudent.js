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


// Modal JS
let modal = document.getElementById('qrCodeModal')
let btn = document.getElementById('showQrCode')
let span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


let qr;
(function () {
  qr = new QRious({
    element: document.getElementById('qr-code'),
    size: 300,
    value: "Test Value"
  });
})();



//incomplete
function generateQRCode() {
  var qrtext = document.getElementById("qr-text").value;
  document.getElementById("qr-result").innerHTML = "QR code for " + qrtext + ":";
  alert(qrtext);
  qr.set({
    foreground: 'black',
    size: 300,
    value: qrtext
  });
}