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
let modal = document.getElementById('addAdminModal')
let btn = document.getElementById('addAdmin')
let span = document.getElementsByClassName("close")[0];

function addAdmin() {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

let removeAdminModal = document.getElementById('removeAdminModal')
let removeAdminBtn = document.getElementById('removeAdmin')
let span1 = document.getElementsByClassName("close")[1];

function removeAdmin() {
    removeAdminModal.style.display = "block";
}

span1.onclick = function () {
    removeAdminModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    else if (event.target == removeAdminModal) {
        removeAdminModal.style.display = "none";
    }
}

async function check() {
    let pass = ""
    await $.getJSON("/getCookieDetails", function (res) {
        pass = res["user"].password.trim()
        console.log(res["user"].password);
    })
    let input_pass = document.getElementById('admin_pass').value
    console.log(pass + " " + input_pass);
    if (input_pass == pass) {
        return true
    }
    alert('Entered Password does not match')
    return false
}


function tabChange(event, tabName) {
    let tabContent = document.getElementsByClassName('tabContent')
    let tabLinks = document.getElementsByClassName('tabLinks')

    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none"
    }
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "")
    }

    document.getElementById(tabName).style.display = "block"
    event.currentTarget.className += " active"
}

function checkStudent() {
    let input = document.getElementById('studentInput').value.toUpperCase()
    let rows = document.getElementById('studentsTable').getElementsByTagName('tr')

    for (let i = 1; i < rows.length; i++) {
        let name = rows[i].getElementsByTagName('td')[0].textContent
        if (name) {
            if (name.indexOf(input) > -1) {
                rows[i].style.display = ""
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

function checkTeacher() {
    let input = document.getElementById('teacherInput').value.toUpperCase()
    let rows = document.getElementById('teachersTable').getElementsByTagName('tr')

    for (let i = 1; i < rows.length; i++) {
        let name = rows[i].getElementsByTagName('td')[0].textContent
        if (name) {
            if (name.indexOf(input) > -1) {
                rows[i].style.display = ""
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

function checkCourse() {
    let input = document.getElementById('courseInput').value.toUpperCase()
    let rows = document.getElementById('coursesTable').getElementsByTagName('tr')

    for (let i = 1; i < rows.length; i++) {
        let name = rows[i].getElementsByTagName('td')[0].textContent
        if (name) {
            if (name.toUpperCase().indexOf(input) > -1) {
                rows[i].style.display = ""
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

function checkAdmin() {
    let input = document.getElementById('adminInput').value.toUpperCase()
    let rows = document.getElementById('adminTable').getElementsByTagName('tr')

    for (let i = 1; i < rows.length; i++) {
        let name = rows[i].getElementsByTagName('td')[0].textContent
        if (name) {
            if (name.toUpperCase().indexOf(input) > -1) {
                rows[i].style.display = ""
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

$(document).ready(function () {

    $.getJSON("/admin/getStudents", function (res) {
        let i = 0;
        while (res[i] != undefined) {
            const newStudent = `
                <tr>
                    <td>${res[i].name}</td>
                    <td>${res[i].email}</td>
                    <td>${res[i].roll_number}</td>
                    <td><form action="/admin/removeStudent/${res[i].email}" method="GET" onsubmit="return confirmRemove()"><button type="submit" id="${res[i].email}">Remove Student</button></form></td>
                </tr>
            `
            $("#studentsTable").append(newStudent);
            i++;
        }
        // console.log(res);
    })
    $.getJSON("/admin/getTeachers", function (res) {
        let i = 0;
        while (res[i] != undefined) {
            const newTeacher = `
                <tr>
                    <td>${res[i].name}</td>
                    <td>${res[i].email}</td>
                    <td><form action="/admin/removeTeacher/${res[i].email}" method="GET" onsubmit="return confirmRemove()"><button type="submit" id="${res[i].email}">Remove Teacher</button></form></td>
                </tr>
            `
            $("#teachersTable").append(newTeacher);
            i++;
        }
        // console.log(res);
    })
    $.getJSON("/admin/getCourses", function (res) {
        let i = 0;
        while (res[i] != undefined) {
            const newCourse = `
                <tr>
                    <td>${res[i].name}</td>
                    <td>${res[i].name}</td>
                    <td>${res[i].name}</td>
                    <td><form action="/admin/removeCourse/${res[i].name}" method="GET" onsubmit="return confirmRemove()"><button type="submit" id="${res[i].name}">Remove Course</button></form></td>
                </tr>
            `
            $("#coursesTable").append(newCourse);
            i++;
        }
        // console.log(res);
    })
    $.getJSON("/admin/getAdmins", function (res) {
        let i = 0;
        while (res[i] != undefined) {
            const newAdmin = `
                <tr>
                    <td>${res[i].name}</td>
                    <td>${res[i].email}</td>
                    <td><button type="submit" id="${res[i].name}" onclick="removeAdmin()">Remove Admin</button></td>
                </tr>
            `
            $("#adminTable").append(newAdmin);
            i++;
        }
        // console.log(res);
    })
})


function confirmRemove() {
    return confirm("Do you really want to remove")
}