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
const { CONNECTION_URL } = require('./public/db/conn')
const { setCookie } = require('./public/scripts/cookies')
const { config } = require('process')

app.set("view engine", "ejs")
app.set("views", __dirname + "/public/views")

app.use(express.static(STATIC_PATH));
app.use(cookieParser())

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
        confirm_password
    } = req.body

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
                password: password
            })

            const registeredStudent = await registerStudent.save()
            registerStudent.userType = "student";

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
                password: password
            })
            const registeredTeacher = await registerTeacher.save()
            registerTeacher.userType = "teacher";
            res.cookie(COOKIE_NAME, registeredTeacher)
            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    } else {
        // alert('User type is not correct');
    }
});

app.get('/login', (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        res.render('login')
    }
    if (req.cookies[COOKIE_NAME].userType == "student") {
        res.redirect('/dashboardStudent');
    } else if(req.cookies[COOKIE_NAME].userType == "teacher") {
        res.redirect('/dashboardTeacher')
    } else if(req.cookies[COOKIE_NAME].userType == "admin")  {
        res.redirect('/dashboardAdmin')
    } else {
        res.render('404NotFound')
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    let student = await Student.findOne({ email })
    let teacher = await Teacher.findOne({ email })
    let admin = await Admin.findOne({ email })

    // if (!student && !teacher && !admin) {
    //     return res.redirect('/login')
    // }

    if (student != null) {
        if (password == student.password) {
            student.userType = "student"
            res.cookie(COOKIE_NAME, student)
            return res.redirect('/dashboardStudent')
        } else {
            return res.redirect('/login')
        }
    } else if (teacher != null) {
        if (password == teacher.password) {
            teacher.userType = "teacher"
            res.cookie(COOKIE_NAME, teacher)
            return res.redirect('/dashboardTeacher')
        } else {
            return res.redirect('/login')
        }
    } else {
        if(password == admin.password) {
            admin.userType = "admin"
            res.cookie(COOKIE_NAME, admin)
            return res.redirect('/admin')
        } else {
            return res.redirect('/login')
        }
    }
})

app.get('/aboutus', (req, res) => {
    res.render('aboutus')
})

app.get('/info', (req, res) => {
    res.render('info')
})

app.get('/addClass', (req, res) => {
    res.render('class')
})

app.post('/addClass', async (req, res) => {
    const { name, teacher_email, student_email } = req.body
    let date = new Date()

    let student = await Student.findOne({ student_email })
    let teacher = await Teacher.findOne({ teacher_email })

    const tID = {
        id: teacher.id
    }
    const sID = {
        id: student.id,
        qrcode_string: `${student.id}%%${name}%%${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    const classObject = new Class({
        name: name,
        teachers: [tID],
        students: [sID],
        attendance: []
    })

    const registeredClass = await classObject.save()
    // console.log(registeredClass);
    res.redirect('/')
})

app.get('/dashboardStudent', (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies['user'] == null) {
        res.redirect('login')
    } else {
        res.render('dashboardStudent', req.cookies[COOKIE_NAME])
    }
});

app.get('/dashboardTeacher', (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies['user'] == null) {
        res.redirect('login')
    } else {
        res.render('dashboardTeacher', req.cookies[COOKIE_NAME])
    }
});

app.get('/scanQrCode', (req, res) => {
    res.render('scanQrCode')
});

app.get('/showAttendance', async (req, res) => {
    let classObj = await Class.findOne({ name: "FSD-1" })
    console.log(classObj);
    res.render('showAttendance', classObj)
});

app.get('/markAttendance', (req, res) => {
    res.render('markAttendance')
})

app.post('/markAttendance', async (req, res) => {
    const { roll_no, status, date, className } = req.body;

    let classObject = await Class.findOne({ name: className })

    if (classObject != null) {
        isFound = false
        classObject.attendance.forEach(element => {
            if (element.date == date) {
                element.values.push({
                    roll_no,
                    status
                })
                classObject.save()
                isFound = true
            }
        });

        if (!isFound) {
            let obj = {
                date,
                values: [{
                    roll_no,
                    status
                }]
            }
            classObject.attendance.push(obj)
            classObject.save()
        }
    }
    res.redirect('/')
})

app.get('/profile', async (req, res) => {
    try {
        let classObj = await Class.findOne({ name: "FSD-1" })
        let id = ""
        classObj.students.forEach(element => {
            if (element.id == req.cookies[COOKIE_NAME]._id) {
                id = element.id;
            }
        });
        res.render('profile', {
            tempID: id
        })
    } catch (error) {
        console.log(error);
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
})

app.get('/admin', async (req, res) => {
    if (req.cookies == undefined || req.cookies == null || req.cookies['user'] == null) {
        res.redirect('login')
    } else {
        req.cookies[COOKIE_NAME].studentCount = await Student.estimatedDocumentCount();
        req.cookies[COOKIE_NAME].teacherCount = await Teacher.estimatedDocumentCount();
        req.cookies[COOKIE_NAME].courseCount = await Class.estimatedDocumentCount();
        res.render('dashboardAdmin', req.cookies[COOKIE_NAME])
    }
})

app.post('/admin/addAdmin', async (req, res) => {
    const {
        full_name,
        email,
        password,
    } = req.body
    const registerAdmin = new Admin({
        name: full_name,
        email,
        password
    })

    const registeredAdmin = await registerAdmin.save()
    console.log(registeredAdmin);
    res.redirect('/admin')
})