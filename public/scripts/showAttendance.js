function exportTable() {
    $("#sheet").table2excel({
        name: "Class Attendance",
        filename: "attendance.xls",
        preserveColors: true
    });
}

let filterRows = (rows , idx , property) => {
    for(let i = 1 ; i < rows.length ; i++){
        if(i != idx) {
            rows[i].style.display = property;
        }
    }
}

let nameSearchbtn = document.querySelector(".std_search");
let nameSearchEl = document.querySelector("#searchByName");

nameSearchbtn.addEventListener("click" , () => {
    let val = nameSearchEl.value;
    let idx = 0;
    let id = -1;
    
    
    let rows = document.querySelectorAll("#sheet tr");
    
    
    if(val == ""){
        filterRows(rows,-1,"revert");
        return;
    }

    filterRows(rows,-1,"revert");

    rows.forEach((row) => {
        let cellValue = row.cells[0].innerHTML;

        if(cellValue === val){
            id = idx;
        }
        else{
            idx++;
        }
    })

    filterRows(rows,id,"none");
});

