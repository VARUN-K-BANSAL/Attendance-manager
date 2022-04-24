const bcrypt = require('bcryptjs')
let encrypted

async function encrypt(password) {
    const salt = await bcrypt.genSalt(6);
    const hashed = await bcrypt.hash(password, salt);
    return hashed
}

async function comparePasswords(hash, password) {
    const isValid = await bcrypt.compare(password, hash)
}

module.exports = { encrypt, comparePasswords };