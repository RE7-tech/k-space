export default function validateEmail (email) {
    if (!email) return false
    let re = /\S+@\S+\.\S+/
    return re.test(email)
}