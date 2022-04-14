
let user_ele = document.getElementById("usrType")
let rollno = document.getElementById("roll")
let roll_div = document.getElementById("roll_div")

user_ele.addEventListener("change", () => {
    if (user_ele.value == "Student") {
        roll_div.style.display = "block";
        document.querySelector("#roll").setAttribute("required",true)
    }
    else {
        roll_div.style.display = "none";
        rollno.value="none";
        document.querySelector("#roll").removeAttribute("required")
    }
})



function check_email() {
    let ele = document.querySelector("#email");
    let val = document.querySelector("#email").value;
    let msg = document.querySelector("#email_err");
    if (val.includes("@") && !val.includes("@iiits.in")) {
        ele.style.borderBottom = "2px solid blue";
        msg.innerHTML = "Only iiits.in extension allowed";
        msg.style.display = "block"
        return false
        
    } else if (val.includes("@iiits.in")) {
        ele.style.borderBottom = "2px solid green";
        msg.style.display = "none";
        return true
       
    } else {
        ele.style.borderBottom = "2px solid red";
        msg.innerHTML = "Username must contain an @ and iiits.in extension";
        msg.style.display = "block"
        return false
       
    }
}

function check_pass() {
    let ele = document.querySelector("#pass");
    let val = document.querySelector("#pass").value;
    let msg = document.querySelector("#pass_err");

    if (val.length < 4 || val.length > 10) {
        ele.style.borderBottom = "2px solid red";
        msg.style.display = "block"
        msg.innerHTML = "Password must br between 4 and 10 characters";

    } else {
        ele.style.borderBottom = "2px solid green";
        msg.style.display = "none";

    }
}

function conf_pass() {
    let ele = document.querySelector("#c_pass");
    let cval = document.querySelector("#c_pass").value;
    let pval = document.querySelector("#pass").value;
    let msg = document.querySelector("#c_pass_err");

    if (cval == pval) {
        ele.style.borderBottom = "2px solid green";
        msg.style.display = "block"
        msg.innerHTML = "Password matched";
        msg.style.color = "green"
        return true

    } else {
        ele.style.borderBottom = "2px solid red";
        msg.style.display = "block";
        msg.innerHTML = "Password not matched"
        msg.style.color = "red";
        return false
    }
}

function check_roll() {
   let user_ele = document.getElementById("usrType")
    let val = document.querySelector("#roll").value


    if (user_ele.value == "Student") {
        if (val.length == 0 || val == "" || !val) {
            return false
        }
        else { return true }
    }
}

function confirmPassword() {
    let pass = document.querySelector("#pass").value
    let c_pass = document.querySelector("#c_pass").value
    if (c_pass != pass) {
        return false;
    }
    else {
        return true;
    }
}

function validatePassword() {
    let val = document.querySelector("#pass").value;
    if (val.length < 4 || val.length > 15) {
        return false
    }
    else {
        return true
    }
}

function validateEmail() {
    let val = document.querySelector("#email").value;
    if(val.includes("@iiits.in")) {return true} 
    else{return false}
}


document.getElementById("btn").onclick = function validate() {
    if (confirmPassword() && validatePassword() && validateEmail() ) {
       
        return true;
    }
    else {
       
        return false;
    }
}










