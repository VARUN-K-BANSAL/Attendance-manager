/*Varun Bansal */
const csv = require('csv-parser')
const fs = require('fs')
const express = require('express')
const path = require('path')
const app = express()
const PORT = 80
const STATIC_PATH = path.join(__dirname + '/public')

const Student = require('./public/models/student')
const Teacher = require('./public/models/teacher')
const Class = require('./public/models/class')
const Admin = require('./public/models/Admin')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const COOKIE_NAME = 'user'
require('./public/db/conn')
const encryption = require('./public/scripts/encryption')

/**Saket Ranjan */
const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/Files')
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname)
    }
})
const upload = multer({ storage: fileStorageEngine })

app.set("view engine", "ejs")
app.set("views", __dirname + "/public/views")

app.use(express.static(STATIC_PATH));
app.use(cookieParser())

/**Varun Bansal */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(PORT, (req, res) => {
    console.log(`Server started at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) => {
    const {
        full_name,
        roll_number,
        email,
        password,
        user_type,
    } = req.body

    let encryptedPassword = String(await encryption.encrypt(password))
    // console.log(encrypt(password));

    let student = await Student.findOne({ email })
    let teacher = await Teacher.findOne({ email })
    if (student || teacher) {
        return res.redirect('/register') //if student already exist then redirect to register
    }

    if (user_type == 'Student') {
        try {
            const registerStudent = new Student({
                name: full_name,
                roll_number: roll_number,
                email: email,
                password: encryptedPassword
            })
            let registeredStudent = await registerStudent.save()
            registeredStudent.userType = "student"
            res.cookie(COOKIE_NAME, registeredStudent)

            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    } else if (user_type == 'Teacher') {
        try {
            const registerTeacher = new Teacher({
                name: full_name,
                email: email,
                password: encryptedPassword,
            })
            let registeredTeacher = await registerTeacher.save()
            registeredTeacher.userType = "teacher"
            res.cookie(COOKIE_NAME, registeredTeacher)
            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    } else {
        // alert('User type is not correct');
    }
});

// app.get('/update',(req,res)=>{
//     res.render('login')
// })

app.post('/update', async (req, res) => {
    const { full_name, email, curr_password, new_password, cn_password } = req.body;


    let teacher = await Teacher.findOne({ email })
    let student = await Student.findOne({ email })
    let admin = await Admin.findOne({ email })
    if (teacher != null) {
        if (encryption.comparePasswords(teacher.password, curr_password) && new_password == cn_password) {
            let encryptedPassword = String(await encryption.encrypt(new_password))
            let result = await Teacher.updateOne({ email: email }, {
                $set: { password: encryptedPassword }
            })
            let teacherCookie = {
                name: teacher.name,
                email: teacher.email,
                password: encryptedPassword,
                userType: "teacher",
                __v: teacher.__v
            }
            res.clearCookie(COOKIE_NAME);
            res.cookie(COOKIE_NAME, teacherCookie)
            return res.redirect('/dashboardTeacher')
        }
    }
    if (student != null) {
        if (student.email == email && curr_password == student.password && new_password == cn_password) {
            let encryptedPassword = String(await encryption.encrypt(new_password))
            let result = await Student.updateOne({ email: email }, {
                $set: { password: encryptedPassword }
            })
            let studentCookie = {
                name: student.name,
                email: student.email,
                roll_number: student.roll_number,
                password: encryptedPassword,
                userType: "student",
                __v: student.__v
            }
            res.clearCookie(COOKIE_NAME);
            res.cookie(COOKIE_NAME, studentCookie)
            return res.redirect('/dashboardStudent')
        }
    }
    if (admin != null) {
        if (admin.email == email && curr_password == admin.password && new_password == cn_password) {
            let encryptedPassword = String(await encryption.encrypt(new_password))
            let result = await Admin.updateOne({ email: email }, {
                $set: { password: encryptedPassword }
            })
            let teacherCookie = {
                name: teacher.name,
                email: teacher.email,
                password: encryptedPassword,
                userType: "teacher",
                __v: teacher.__v
            }
            res.clearCookie(COOKIE_NAME);
            res.cookie(COOKIE_NAME, teacherCookie)
            return res.redirect('/dashboardAdmin')
        }
    }

})


app.get('/login', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.render('login')
    }

    const email = req.cookies[COOKIE_NAME].email;
    let student = await Student.findOne({ email })
    let teacher = await Teacher.findOne({ email })
    let admin = await Admin.findOne({ email })

    if (student != null) {
        res.redirect('/dashboardStudent');
    } else if (teacher != null) {
        res.redirect('/dashboardTeacher')
    } else if (admin != null) {
        res.redirect('/admin')
    } else {
        res.render('login')
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    let student = await Student.findOne({ email })
    let teacher = await Teacher.findOne({ email })
    let admin = await Admin.findOne({ email })

    if (student != null) {
        let isValid = await encryption.comparePasswords(student.password, password)
        if (isValid) {
            let studentCookie = {
                name: student.name,
                email: student.email,
                roll_number: student.roll_number,
                password: student.password,
                userType: "student",
                __v: student.__v
            }
            res.cookie(COOKIE_NAME, studentCookie)
            return res.redirect('/dashboardStudent')
        } else {
            return res.redirect('/login')
        }
    } else if (teacher != null) {
        let isValid = await encryption.comparePasswords(teacher.password, password)
        if (isValid) {
            let teacherCookie = {
                name: teacher.name,
                email: teacher.email,
                password: teacher.password,
                userType: "teacher",
                __v: teacher.__v
            }
            res.cookie(COOKIE_NAME, teacherCookie)
            return res.redirect('/dashboardTeacher')
        } else {
            return res.redirect('/login')
        }
    } else if (admin != null) {
        let isValid = await encryption.comparePasswords(admin.password, password)
        if (isValid) {
            let adminCookie = {
                name: admin.name,
                email: admin.email,
                roll_number: admin.roll_number,
                password: admin.password,
                userType: "admin",
                __v: admin.__v
            }
            res.cookie(COOKIE_NAME, adminCookie)
            return res.redirect('/admin')
        } else {
            return res.redirect('/login')
        }
    } else {
        return res.redirect('/login')
    }
})

app.get('/aboutus', (req, res) => {
    res.render('aboutus')
})

app.get('/info', (req, res) => {
    res.render('info')
})

app.post('/addClass', upload.array("Files", 2), async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies['user'] == null) {
        return res.redirect('login')
    }
    let { className, teacherEmail, studentEmail } = req.body
    // console.log(teacherFile);
    // console.log(studentFile);
    // let file1=document.getElementById("Fl1").value
    // let file2=document.getElementById("Fl2").value

    let date = new Date()

    let student = await Student.findOne({ email: studentEmail })
    let teacher = await Teacher.findOne({ email: teacherEmail })

    const tID = {
        email: teacher.email
    }

    const sID = {
        roll_number: student.roll_number,
        qrcode_string: `${student.roll_number}%%${className}%%${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    console.log(sID);
    const uID = {
        email: req.cookies[COOKIE_NAME].email
    }

    const classObject = new Class({
        name: className,
        teachers: [tID, uID],
        students: [sID],
        attendance: []
    })

    // const registeredClass = await classObject.save()



    const results1 = [];
    fs.createReadStream(`public/Files/file1.csv`)
        .pipe(csv({}))
        .on('data', (data) => results1.push(data))
        .on('end', async () => {
            console.log(results1);
            let j = 0;
            while (j < results1.length) {

                try {
                    let detail = `${results1[j].mail}`;
                    let teacObj = await Teacher.findOne({ email: detail })
                    console.log(teacObj);
                    // let classObj = await Class.findOne({ name: req.params.x })
                    if (teacObj == null || classObject == null) res.redirect('/dashboardTeacher')
                    let i = 0
                    while (i < classObject.teachers.length) {
                        if (classObject.teachers[i].email == teacObj.email) {
                            return res.redirect('/dashboardTeacher')
                        }
                        i++
                    }
                    classObject.teachers.push({
                        email: teacObj.email
                    })
                    // res.redirect('/dashboardTeacher')
                } catch (error) {
                    console.log(error);
                }
                // classObject.save();
                j++;
            }

        });




    const results = [];
    fs.createReadStream(`public/Files/file2.csv`)
        .pipe(csv({}))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(results);
            let j = 0;
            while (j < results.length) {
                try {
                    let detail = `${results[j].mail}`;
                    // console.log(detail);
                    let studObj = await Student.findOne({ email: detail })
                    if (studObj == null || classObject == null) res.redirect('/dashboardTeacher')
                    let i = 0
                    while (i < classObject.students.length) {
                        if (classObject.students[i].roll_number == studObj.roll_number) {
                            return res.redirect('/dashboardTeacher')
                        }
                        i++
                    }
                    let newStudObj = {
                        roll_number: studObj.roll_number,
                        qrcode_string: `${studObj.roll_number}%%${className}%%06/04/2022`
                    }
                    classObject.students.push(newStudObj)



                } catch (error) {
                    console.log(error);
                }
                j++;
            }
            classObject.save()
        });
    res.redirect('/dashboardTeacher')
})

//?
app.get('/getClasses', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies['user'] == null) {
        return res.redirect('login')
    }
    const classes = await Class.find()
    // console.log(classes);c
    res.send(classes);
})

app.get('/dashboardStudent', (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "teacher" || req.cookies[COOKIE_NAME].userType == "admin") {
        res.redirect('/pageNotFound')
    } else {
        res.render('dashboardStudent', req.cookies[COOKIE_NAME])
    }
});

app.get('/dashboardTeacher', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "admin") {
        res.redirect('/pageNotFound')
    } else {
        const classes = await Class.find()
        req.cookies[COOKIE_NAME].classes = classes;
        res.render('dashboardTeacher', req.cookies[COOKIE_NAME])
    }
});

app.get('/showAttendance/:name/', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    let className = req.params.name.replace('%20', ' ')
    let dataObj = {
        name: className
    }
    res.render('showAttendance', dataObj)
});

app.get('/profileDashboard', (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    if (req.cookies[COOKIE_NAME].userType == 'student') {
        res.redirect('/dashboardStudent')
    } else if (req.cookies[COOKIE_NAME].userType == 'teacher') {
        res.redirect('/dashboardTeacher')
    } else if (req.cookies[COOKIE_NAME].userType == 'admin') {
        res.redirect('/admin')
    } else {
        res.redirect('/pageNotFound')
    }
})

app.get('/profile', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    try {
        res.render('profile', req.cookies[COOKIE_NAME])
    } catch (error) {
        console.log(error);
    }
})

app.get('/removeClass/:x', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    try {
        let classObj = await Class.deleteOne({ name: req.params.x })
        console.log(classObj);
        res.redirect('/dashboardTeacher')
    } catch (error) {
        console.log(error);
    }
})

app.post('/addStudent/:x', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    try {
        let studObj = await Student.findOne({ email: req.body.studentEmail })
        console.log(studObj);
        let classObj = await Class.findOne({ name: req.params.x })
        if (studObj == null || classObj == null) res.redirect('/dashboardTeacher')
        let i = 0
        while (i < classObj.students.length) {
            if (classObj.students[i].roll_number == studObj.roll_number) {
                return res.redirect('/dashboardTeacher')
            }
            i++
        }
        let newStudObj = {
            roll_number: studObj.roll_number,
            qrcode_string: `${studObj.roll_number}%%${req.params.x}%%06/04/2022`
        }
        classObj.students.push(newStudObj)
        classObj.save();
        res.redirect('/dashboardTeacher')
    } catch (error) {
        console.log(error);
    }
})

app.post('/addTeacher/:x', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    try {
        let teacObj = await Teacher.findOne({ email: req.body.teacherEmail })
        let classObj = await Class.findOne({ name: req.params.x })
        if (teacObj == null || classObj == null) res.redirect('/dashboardTeacher')
        let i = 0
        while (i < classObj.teachers.length) {
            if (classObj.teachers[i].email == teacObj.email) {
                return res.redirect('/dashboardTeacher')
            }
            i++
        }
        classObj.teachers.push({
            email: teacObj.email
        })
        classObj.save();
        res.redirect('/dashboardTeacher')
    } catch (error) {
        console.log(error);
    }
})

app.get('/admin', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        res.redirect('/pageNotFound')
    } else {
        req.cookies[COOKIE_NAME].studentCount = await Student.estimatedDocumentCount();
        req.cookies[COOKIE_NAME].teacherCount = await Teacher.estimatedDocumentCount();
        req.cookies[COOKIE_NAME].courseCount = await Class.estimatedDocumentCount();
        res.render('dashboardAdmin', req.cookies[COOKIE_NAME])
    }
})

app.post('/admin/addAdmin', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    const {
        full_name,
        email,
        password
    } = req.body
    let encryptedPassword = String(await encryption.encrypt(password))
    const registerAdmin = new Admin({
        name: full_name,
        email,
        password : encryptedPassword
    })
    const registeredAdmin = await registerAdmin.save()
    res.redirect('/admin')
})
app.post('/admin/removeAdmin', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    const {
        email
    } = req.body
    let admin = await Admin.deleteOne({ email: email })
    console.log(admin);
    res.redirect('/admin')
})
app.get('/admin/removeStudent/:x', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    const email = req.params.x
    let student = await Student.deleteOne({ email: email })
    console.log(student);
    res.redirect('/admin')
})
app.get('/admin/removeTeacher/:x', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    const email = req.params.x
    let teacher = await Teacher.deleteOne({ email: email })
    console.log(teacher);
    res.redirect('/admin')
})
app.get('/admin/removeCourse/:x', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    const name = req.params.x
    let Course = await Class.deleteOne({ name: name })
    console.log(Course);
    res.redirect('/admin')
})

app.get('/getClasses', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    const classes = await Class.find()
    res.send(classes);
})

app.get('/getCookieDetails', (req, res) => {
    res.send(req.cookies)
})

app.get('/admin/getStudents', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    try {
        let studObj = await Student.find()
        res.send(studObj);
    } catch (error) {
        console.log(error);
    }
})
app.get('/admin/getTeachers', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    try {
        let teachObj = await Teacher.find()
        res.send(teachObj);
    } catch (error) {
        console.log(error);
    }
})
app.get('/admin/getCourses', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    try {
        let classObj = await Class.find()
        res.send(classObj);
    } catch (error) {
        console.log(error);
    }
})
app.get('/admin/getAdmins', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    } else if (req.cookies[COOKIE_NAME].userType == "student" || req.cookies[COOKIE_NAME].userType == "teacher") {
        return res.redirect('/pageNotFound')
    }
    try {
        let adminObj = await Admin.find()
        res.send(adminObj);
    } catch (error) {
        console.log(error);
    }
})

/**Varun Mukherjee */
app.get('/generateQrCode/:x', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    try {
        let classObj = await Class.findOne({ name: req.params.x });
        let studClass = classObj.students;
        let d = new Date();
        let timeStr1 = `${Math.floor(d.getTime() / (1000 * 60))}`
        // let timeStr1 = `${Math.floor(d.getTime()/(1000*60*60))}`
        let timeStr2 = `${Math.floor(d.getTime() / (1000 * 60)) + 5}`
        // let timeStr2 = `${Math.floor(d.getTime()/(1000*60*60)) + 1}`
        let dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        let arr = [];
        // Adding Absent array
        for (let i = 0; i < studClass.length; i++) {
            let tempObj = {
                roll_no: studClass[i].roll_number,
                status: "A"
            }
            arr.push(tempObj);
        }
        let timeStampStr = `${dateStr} ${timeStr1} ${timeStr2}`
        let matchFound = false;
        let attObj = {
            date: timeStampStr,
            values: arr
        }
        for (let i = 0; i < classObj.attendance.length; i++) {
            dateVal = classObj.attendance[i].date.split(" ");
            if ((dateVal[0] == dateStr) && (parseInt(dateVal[1]) >= parseInt(timeStr1)) && (parseInt(dateVal[1]) <= parseInt(timeStr2))) {
                console.log("here")
                matchFound = true;
            }
        }
        if (!matchFound) {
            // Generating Qr Unique String
            studClass.forEach((std) => {
                let roll = std.roll_number;
                let qrStr = `${roll}%%${req.params.x}%%${dateStr}%%${timeStr1}`;

                std.qrcode_string = qrStr;
            });
            classObj.attendance.push(attObj);
            const co = await classObj.save();
        }

        return res.redirect('/dashboardTeacher');

    }
    catch (error) {
        console.log(error);
    }
})

app.post('/markAttendance/:cname', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        return res.redirect('login')
    }
    let val = req.body.qrCodeArr;
    const classObj = await Class.findOne({ name: req.params.cname })
    const stds = classObj.students;
    const attend = classObj.attendance;
    let passStr = val.split(";;")
    for (let i = 0; i < passStr.length; i++) {
        let tempStr = passStr[i];
        for (let j = 0; j < stds.length; j++) {
            if (stds[j].qrcode_string == tempStr) {
                let tempRoll = stds[j].roll_number;
                let tempArr = tempStr.split("%%");
                let dateStr = tempArr[2];
                let timeStr = tempArr[3];
                attend.forEach((att) => {
                    let attDate = att.date.split(" ");
                    if ((attDate[0] == dateStr) && (attDate[1] == timeStr)) {
                        att.values.forEach((stdVal) => {
                            if (stdVal.roll_no == tempRoll) {
                                stdVal.status = "P";
                            }
                        })
                    }
                });
            }
        }
    }
    const co = await classObj.save();
    res.redirect("/dashboardTeacher")
})



/**Saket Ranjan */
app.post('/addClass', upload.array("Files", 2), async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies['user'] == null) {
        return res.redirect('login')
    }
    let { className, teacherEmail, studentEmail } = req.body
    let date = new Date()

    let student = await Student.findOne({ email: studentEmail })
    let teacher = await Teacher.findOne({ email: teacherEmail })

    const tID = {
        email: teacher.email
    }

    const sID = {
        roll_number: student.roll_number,
        qrcode_string: `${student.roll_number}%%${className}%%${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    const uID = {
        email: req.cookies[COOKIE_NAME].email
    }
    const classObject = new Class({
        name: className,
        teachers: [tID, uID],
        students: [sID],
        attendance: []
    })
    const results1 = [];
    fs.createReadStream(`public/Files/file1.csv`)
        .pipe(csv({}))
        .on('data', (data) => results1.push(data))
        .on('end', async () => {
            console.log(results1);
            let j = 0;
            while (j < results1.length) {

                try {
                    let detail = `${results1[j].mail}`;
                    let teacObj = await Teacher.findOne({ email: detail })
                    console.log(teacObj);
                    // let classObj = await Class.findOne({ name: req.params.x })
                    if (teacObj == null || classObject == null) res.redirect('/dashboardTeacher')
                    let i = 0
                    while (i < classObject.teachers.length) {
                        if (classObject.teachers[i].email == teacObj.email) {
                            return res.redirect('/dashboardTeacher')
                        }
                        i++
                    }
                    classObject.teachers.push({
                        email: teacObj.email
                    })
                    // res.redirect('/dashboardTeacher')
                } catch (error) {
                    console.log(error);
                }
                // classObject.save();
                j++;
            }

        });
    const results = [];
    fs.createReadStream(`public/Files/file2.csv`)
        .pipe(csv({}))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(results);
            let j = 0;
            while (j < results.length) {
                try {
                    let detail = `${results[j].mail}`;
                    // console.log(detail);
                    let studObj = await Student.findOne({ email: detail })
                    if (studObj == null || classObject == null) res.redirect('/dashboardTeacher')
                    let i = 0
                    while (i < classObject.students.length) {
                        if (classObject.students[i].roll_number == studObj.roll_number) {
                            return res.redirect('/dashboardTeacher')
                        }
                        i++
                    }
                    let newStudObj = {
                        roll_number: studObj.roll_number,
                        qrcode_string: `${studObj.roll_number}%%${className}%%06/04/2022`
                    }
                    classObject.students.push(newStudObj)
                } catch (error) {
                    console.log(error);
                }
                j++;
            }
            classObject.save()
        });
    res.redirect('/dashboardTeacher')
})



// Clearing cookie on logout
app.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
})

app.get('*', (req, res) => {
    res.render('404NotFound')
})