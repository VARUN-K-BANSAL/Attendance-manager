
const user_ele = document.getElementById("usrType")
const rollno = document.getElementById("roll")

user_ele.addEventListener("change", () => {
    if (user_ele.value == "Student") {
        rollno.style.display = "block";
    }
    else {
        rollno.style.display = "none";
    }
})

function check_name() {
    let msg = document.querySelector("#name_err")
    msg.innerHTML = "*Mandatory Field"
}

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

    if (val.length < 8 || val.length > 15) {
        ele.style.borderBottom = "2px solid red";
        msg.style.display = "block"
        msg.innerHTML = "Password must br between 8 and 15 characters";

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

    } else {
        ele.style.borderBottom = "2px solid red";
        msg.style.display = "block";
        msg.innerHTML = "Password not matched"
        msg.style.color = "red";

    }
}

function check_roll() {
    const user_ele = document.getElementById("usrType")
    let val = document.querySelector("#roll").value
   
  
    if (user_ele.value == "Student") {
      if (val.length == 0 || val == "" || !val) {
        return false
    }
        else {return true}
}}

function validate() {
    let email_val = document.querySelector("#email").value;
    let cval = document.querySelector("#c_pass").value;
    let pval = document.querySelector("#pass").value;
    const user_ele = document.getElementById("usrType")
    let roll_val = document.querySelector("#roll").value
    if (!email_val.includes("@iiits.in")) {
    return false
    }
   if(user_ele.value == "Student") {
        if (roll_val.length == 0 || roll_val == "" || !roll_val) {
            return false
        }
        else{
            return true
        } 
    }

    if(pval.length>15 || pval.length<8){
        return false
    }

    if (pval!==cval) {
    return false
    }
   else{
    return true
}}










