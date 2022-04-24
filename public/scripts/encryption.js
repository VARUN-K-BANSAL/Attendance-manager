const bcrypt = require('bcryptjs')

async function encrypt(password) {
    const salt = await bcrypt.genSalt(6);
    const hashed = await bcrypt.hash(password, salt);
    return hashed
}

async function comparePasswords(hash, password) {
    let val
    await bcrypt.compare(password, hash)
        .then((isValid) => {
            val = isValid
        })
    return val
}

module.exports = { encrypt, comparePasswords };