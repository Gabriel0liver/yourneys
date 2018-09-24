const bcrypt = require('bcrypt')
const saltRounds = 10

function encrypt (password) {
  // encrypt password
  const salt = bcrypt.genSaltSync(saltRounds)
  return bcrypt.hashSync(password, salt)
}

const users = [{
  username: 'Axel',
  password: encrypt('Axel'),
  url: 'https://image.flaticon.com/icons/png/512/146/146005.png',
  description: 'For this reason, we want to log in and establish a session with the user. The session will be stored in the database, it will reference a particular user profile, and it will expire and be automatically removed from the database.'
},
{
  username: 'Yendy',
  password: encrypt('1234'),
  url: 'https://image.flaticon.com/icons/png/512/146/146005.png',
  description: 'For this reason, we want to log in and establish a session with the user. The session will be stored in the database, it will reference a particular user profile, and it will expire and be automatically removed from the database.'
}]

module.exports = users
