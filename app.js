const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000
const STATIC_PATH = path.join(__dirname + '/public')
const Student = require('./public/models/student')
const Teacher = require('./public/models/teacher')
const Class = require('./public/models/class')
const cookieParser = require('cookie-parser')
const { CONNECTION_URL } = require('./public/db/conn')
const { setCookie } = require('./public/scripts/cookies')
const { config } = require('process')

app.use(express.static(STATIC_PATH));
app.use(cookieParser())

// I was not able to save the data from html to db so after adding these two lines I was able to save it
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(PORT, (req, res) => {
    console.log(`Server started at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html')
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/html/register.html')
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

    // check if password and confirm password are matching or not
    // if (password === confirm_password) {
        if (user_type == 'Student') {
            try {
                let student = await Student.findOne({email})
                if(student) {
                    // alert('Email already registered');
                    return res.redirect('/register')
                }
                // creating a new object of type Student whose model is defined
                const registerStudent = new Student({
                    name: full_name,
                    roll_number: roll_number,
                    email: email,
                    password: password
                })

                // saving the above created object to the database
                const registeredStudent = await registerStudent.save()
                // console.log(registeredStudent);

                res.redirect('/login')

                // // setting cookie for the login session
                // setCookie(email, password);

                // redirecting to the next page
                // res.sendFile(__dirname + '/public/html/dashboard.html')
            } catch (error) {
                console.log(error);
            }
        } else if (user_type == 'Teacher') {
            try {
                let teacher = await Teacher.findOne({email})
                if(teacher) {
                    // alert('Email already registered');
                    return res.redirect('/register')
                }

                const registerTeacher = new Teacher({
                    name: full_name,
                    email: email,
                    password: password
                })
                const registeredTeacher = await registerTeacher.save()
                console.log(registeredTeacher);
                // res.cookie('user_creds', setCookie(email, password), {
                //     maxAge: 20000,
                //     httpOnly: true
                // })
                res.sendFile(__dirname + '/public/html/dashboard.html')
            } catch (error) {
                console.log(error);
            }
        } else {
            // alert('User type is not correct');
        }
    // } else {
    //     // alert('password and confirm password does not match');
    // }
});

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/public/html/login.html');
})

app.post('/login', async (req,res) => {
    const {email, password} = req.body

    let student = await Student.findOne({email})
    let teacher = await Teacher.findOne({email})

    if(!student && !teacher) {
        // alert('Email not registered');
        return res.redirect('/login')
    }

    if(student != null) {
        if(password == student.password) {
            return res.redirect('/dashboard')
        } else {
            // alert('password does not match');
            return res.redirect('/login')
        }
    }else if(teacher != null) {
        if(password == teacher.password) {
            res.redirect('/dashboard')
        } else {
            // alert('password does not match');
            return res.redirect('/login')
        }
    }
})

app.get('/addClass', (req, res) => {
    res.sendFile(__dirname + '/public/html/class.html')
})

app.post('/addClass', async (req, res) => {
    const {name, teacher_email, student_email} = req.body

    let student = await Student.findOne({student_email})
    let teacher = await Teacher.findOne({teacher_email})

    const tID = {
        id: teacher.id
    }
    const sID = {
        id: student.id,
        qrcode_string: `${student.id}_${name}`
    }

    const classObject = new Class({
        name: name,
        teachers: [tID],
        students: [sID],
        attendance: null
    })

    const registeredClass = await classObject.save()
    console.log(registeredClass);
    res.redirect('/')

})

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/html/dashboard.html')
});