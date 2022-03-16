const user_ele=document.getElementById("usrType")
const rollno=document.getElementById("roll")
user_ele.addEventListener("change",()=>{
    if(user_ele.value=="Student"){
         rollno.style.display="block";
    }
    else{
        rollno.style.display="none";
    }
})
