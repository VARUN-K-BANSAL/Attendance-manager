let classesObj
let userObj

// Modal JS
let modal = document.getElementById('qrCodeModal')
let btn = document.getElementById('showQrCode')
let span = document.getElementsByClassName("close")[0];

function openModal(name, roll_number) {
  modal.style.display = "block";
  setQrCode(name, roll_number)
}

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// below code is for qrcode part as an interface of web application
let qr;
function generateQRCode(string) {
  qr = new QRious({
    element: document.getElementById('qr-code'),
    size: 300,
    value: string
  });
  qr.set({
    foreground: 'black',
    size: 300,
    value: string
  });
}

function setQrCode(name, roll_number) {
  let i = 0
  while(classesObj[i] != undefined) {
    if(classesObj[i].name == name) {
      let j = 0
      while(j < classesObj[i].students.length) {
        if(classesObj[i].students[j].roll_number == roll_number) {
          let res = generateQRCode(classesObj[i].students[j].qrcode_string)
          console.log(res);
        }
        j++
      }
    }
    i++
  }
}

// below code is for adding class for students in which student is involved
let classTemplate = (name, roll_number) =>
  `
<div class="class" id = "${name}">
    <div class = "${name}">
        <h3>${name}</h3>
    </div>
    <div class = "function_links">
        <button onclick="openModal('${name}', '${roll_number}')" class = "btn" id="showQrCode" style="border:none; outline:none;">My Qr Code</button>
        <a href="/showAttendance/${name}" class = "btn" target="__blank">Show Attendance</a>
    </div>
</div>
`

$(document).ready(function () {
  $.getJSON('/getCookieDetails', function (user) {
    $.getJSON('/getClasses', function (classes) {
      classesObj = classes
      userObj = user
      let i = 0;
      while (classes[i] != undefined) {
        let j = 0;
        while (j < classes[i].students.length) {
          if (classes[i].students[j].roll_number == user["user"].roll_number) {
            let temp = classTemplate(classes[i].name, user['user'].roll_number)
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