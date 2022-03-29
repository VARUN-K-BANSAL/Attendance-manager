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

function check() {
    console.log("check");
    let pass = document.getElementById('temp_pass').innerHTML
    console.log(pass);
    let input_pass = document.getElementById('admin_pass').value
    console.log(input_pass);
    if(input_pass == pass) {
        return true
    }
    alert('Entered Password does not match')
    return false
}