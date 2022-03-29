
function check_email() {
    let ele = document.querySelector("#email");
    let val = document.querySelector("#email").value;
    let msg = document.querySelector("#email_err");

    if (val.includes("@") && !val.includes("@iiits.in")) {
        ele.style.borderBottom = "2px solid blue";
        msg.innerHTML = "Only iiits.in extension allowed";
        return false

    } else if (val.includes("@iiits.in")) {
        ele.style.borderBottom = "2px solid green";
        msg.style.display = "none";
    } else {
        ele.style.borderBottom = "2px solid red";
        msg.innerHTML = "Username must contain an @ and iiits.in extension";
        return false
    }
}