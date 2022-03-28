const express = require('express')
const path = require('path')
const app = express()
const PORT = 80
const STATIC_PATH = path.join(__dirname + '/public')
const Student = require('./public/models/student')
const Teacher = require('./public/models/teacher')
const Class = require('./public/models/class')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const COOKIE_NAME = 'user'
const { CONNECTION_URL } = require('./public/db/conn')//used
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

    if (user_type == 'Student') {
        try {
            let student = await Student.findOne({ email })
            if (student) {
                return res.redirect('/register')
            }
            const registerStudent = new Student({
                name: full_name,
                roll_number: roll_number,
                email: email,
                password: password
            })

            const registeredStudent = await registerStudent.save()

            res.cookie(COOKIE_NAME, registeredStudent)
            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    } else if (user_type == 'Teacher') {
        try {
            let teacher = await Teacher.findOne({ email })
            if (teacher) {
                // alert('Email already registered');
                return res.redirect('/register')
            }

            const registerTeacher = new Teacher({
                name: full_name,
                email: email,
                password: password
            })
            const registeredTeacher = await registerTeacher.save()
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
    if(req.cookies == undefined || req.cookies == null || req.cookies[COOKIE_NAME] == null) {
        res.render('login')
    }
    res.redirect('/dashboard');
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    let student = await Student.findOne({ email })
    let teacher = await Teacher.findOne({ email })

    if (!student && !teacher) {
        return res.redirect('/login')
    }

    if (student != null) {
        if (password == student.password) {
            res.cookie(COOKIE_NAME, student)
            return res.redirect('/dashboard')
        } else {
            return res.redirect('/login')
        }
    } else if (teacher != null) {
        if (password == teacher.password) {
            res.cookie(COOKIE_NAME, teacher)
            return res.redirect('/dashboard')
        } else {
            return res.redirect('/login')
        }
    }
})

app.get('/aboutus' , (req,res) => {
    res.render('aboutus')
})

app.get('/info' , (req,res) => {
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
        qrcode_string: `${student.id}%%${name}%%${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    }

    const classObject = new Class({
        name: name,
        teachers: [tID],
        students: [sID],
        attendance: []
    })

    const registeredClass = await classObject.save()
    console.log(registeredClass);
    res.redirect('/')

})

app.get('/dashboard', (req, res) => {
    if(req.cookies == undefined || req.cookies == null || req.cookies['user'] == null) {
        res.redirect('login')
    } else {
        res.render('dashboard', req.cookies[COOKIE_NAME])
    }
});

app.get('/scanQrCode', (req, res) => {
    res.render('scanQrCode')
});

app.get('/showAttendance', (req, res) => {
    res.render('showAttendance')
});

app.get('/markAttendance', (req, res) => {
    res.render('markAttendance')
})

app.post('/markAttendance', async (req, res) => {
    const {roll_no, status, date, className} = req.body;

    let classObject = await Class.findOne({name: className})

    if(classObject != null) {
        isFound = false
        classObject.attendance.forEach(element => {
            if(element.date == date) {
                element.values.push({
                    roll_no,
                    status
                })
                classObject.save()
                isFound = true
            }
        });

        if(!isFound) {
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

app.get('/profile', (req, res) => {
    res.render('profile')
})

app.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
})