function exportTable() {
    $("#sheet").table2excel({
        name: "Class Attendance",
        filename: "attendance.xls",
        preserveColors: true
    });
}

let filterRows = (rows, idx, property) => {
    for (let i = 1; i < rows.length; i++) {
        if (i != idx) {
            rows[i].style.display = property;
        }
    }
}

let nameSearchbtn = document.querySelector(".std_search");
let nameSearchEl = document.querySelector("#searchByName");

nameSearchbtn.addEventListener("click", () => {
    let val = nameSearchEl.value;
    let idx = 0;
    let id = -1;


    let rows = document.querySelectorAll("#sheet tr");

    filterRows(rows, -1, "revert");

    if (val == "") {
        // filterRows(rows,-1,"revert");
        return;
    }

    rows.forEach((row) => {
        let cellValue = row.cells[0].innerHTML;

        if (cellValue === val) {
            id = idx;
        }
        else {
            idx++;
        }
    })

    filterRows(rows, id, "none");
});

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

