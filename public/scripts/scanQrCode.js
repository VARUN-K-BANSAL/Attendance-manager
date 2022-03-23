function markAttendance(qrCodeMessage) {

    document.getElementById('result').innerHTML = '<span class="result">' + qrCodeMessage + '</span>';
}

function errorInScanning(errorMessage) {
    //handle scan error
    console.log(errorMessage);
    // document.getElementById('result').innerHTML = '<span class="result">Some Internal Error occurred, please reload the page.<br>If problem persists please reach out to our developer team.</span>';
}

var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 });

html5QrcodeScanner.render(markAttendance, errorInScanning);