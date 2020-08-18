function samePasswords(password, c_password) {
    return password === c_password
}

function stringLengthIsCorrect(stringValues, maxLength) {
    if (typeof stringValues === 'string') {
        console.log('___', stringValues)
        return stringValues.length <= maxLength
    }
    for (const value of stringValues) {
        console.log('--', value)
        if (value)
            return false
    }
    return true
}

module.exports = {
    samePasswords,
    stringLengthIsCorrect,
}