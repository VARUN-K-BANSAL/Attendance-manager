function setCookie(email, password) {
    const EXPIRING_DAYS = 0.001;
    const d = new Date()
    // d.setTime(d.getTime() + (EXPIRING_DAYS*24*20*60*1000))
    // const EXPIRE_STRING = 'expires=' + d.toUTCString()
    return `${email}%${password}`
}

// function getCookie() {

// }

module.exports = {setCookie}