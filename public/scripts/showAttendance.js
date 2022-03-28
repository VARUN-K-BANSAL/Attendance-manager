function exportTable() {
    $("#sheet").table2excel({
        name: "Class Attendance",
        filename: "attendance.xls",
        preserveColors: true
    });
}

(function() {
    
})()