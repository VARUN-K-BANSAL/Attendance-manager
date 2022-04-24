function exportTable() {
    let className = document.getElementById('className').innerHTML
    $("#sheet").table2excel({
        name: "Class Attendance",
        filename: `${className} attendance.xls`,
        preserveColors: true
    });
}


let tableHeadingTemplate = (date) => {
    return `
    <th scope="col">${date}</th>
    `
}

let tableRowsTemplate = (status) => {
    return `
    <td>${status}</td>
    `
}

$(document).ready(function () {
    $.getJSON('/getClasses', function (res) {
        let i = 0;
        while (res[i] != undefined) {
            if (res[i].name == $('#className')[0].innerHTML) {
                let j = res[i].attendance.length - 1
                while (j > -1) {
                    let s = res[i].attendance[j].date.split(' ')
                    let string = tableHeadingTemplate(s[0])
                    $('#heading').append(string)
                    j--
                }
                j = res[i].attendance[0].values.length - 1
                while (j > -1) {
                    let s = '<tr>'
                    s += `<th scope="column">${res[i].attendance[0].values[j].roll_no}</th>`
                    let k = res[i].attendance.length - 1
                    while (k > -1) {
                        let status = res[i].attendance[k].values[j].status
                        let str = tableRowsTemplate(status)
                        s += str
                        k--
                    }
                    s += '</tr>'
                    $('#tableBody').append(s);
                    j--
                }
                break;
            }
            i++
        }
    })
})


// Roll No. Filter

let searchByRoll = () => {
    let rollVal = document.querySelector("#searchByRoll").value.toUpperCase();
    let rows = document.getElementById("tableBody").getElementsByTagName("tr");

    for (let i = 0 ; i < rows.length ; i++) {
        let roll = rows[i].getElementsByTagName("th")[0].innerHTML;

        if(roll) {
            if(roll.indexOf(rollVal) > -1){
                rows[i].style.display = "";
            }
            else {
                rows[i].style.display = "none";
            }
        }
    }    

}

// Date Filter

let compareDates = (d1 , d2) => {

    let y1 = d1[0];
    let y2 = d2[0];

    if((y1 - y2) > 0){
        return 1;
    }
    else if((y1 - y2) < 0) {
        return -1;
    }
    else {

        let m1 = d1[1];
        let m2 = d2[1];

        if((m1 - m2) > 0){
            return 1;
        }
        else if((m1 - m2) < 0) {
            return -1;
        }
        else {
            let dt1 = d1[2];
            let dt2 = d2[2];

            if((dt1 - dt2) > 0){
                return 1;
            }
            else if((dt1 - dt2) < 0) {
                return -1;
            }
            else {
                return 0;
            }
        }
    }
}

// This is a comment 

let dateSearchbtn = document.querySelector(".date_filter");

dateSearchbtn.addEventListener("click" , () => {

    let fromDateVal = document.getElementById("date_from").value;
    let toDateVal = document.getElementById("date_to").value;

    let tableHead = document.getElementById("heading").getElementsByTagName("th");
    let rows = document.getElementById("tableBody").getElementsByTagName("tr");

    for(let i = 1 ; i < tableHead.length ; i++){


        for(let j = 0 ; j < rows.length ; j++){
            rows[j].getElementsByTagName("td")[i-1].style.display = "";
            
        }
        
        tableHead[i].style.display = "";
    }

    if( !fromDateVal || !toDateVal) {
        return;
    }

    let from = fromDateVal.split("-");
    let to = toDateVal.split("-")


    for(let i = 1 ; i < tableHead.length ; i++){
        
        let reqVal = tableHead[i].innerHTML;
        let dates = reqVal.split("/");
        dates = dates.reverse();

        if(!(compareDates(dates,from) >= 0 && compareDates(dates,to) <= 0)){

            for(let j = 0 ; j < rows.length ; j++){
                rows[j].getElementsByTagName("td")[i-1].style.display = "none";
                
            }
            
            tableHead[i].style.display = "none";
        }

    }
})