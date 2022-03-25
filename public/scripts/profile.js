let qr;
(function () {
  qr = new QRious({
    element: document.getElementById('qr-code'),
    size: 300,
    value: getData()
  });
  // console.log(qr);
})();

async function getData() {
  return qrcode_string
  // let classObject = await Class.findOne({ name: "FSD-1" })
  // console.log(classObject.attendance[0].qrcode_string);
  // return classObject.attendance[0].qrcode_string
}

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