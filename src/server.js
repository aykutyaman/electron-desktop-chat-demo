const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server')

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:bff157cc-fd4e-44b1-955e-6f4fc0954e8f',
  key:
    '8e2b1404-17cb-4b91-ae6b-46feba3aaba9:a9hZf5KuoIEj74UV7UXFoIxFj6Xo0NMb4tZtR7bHPsw='
})
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  const user = { name: username, id: username }
  chatkit
    .createUser(user)
    .then(() => {
      console.log('Created user ', user.name)
      res.status(201).json(user)
    })
    .catch(error => {
      if (error.error === 'services/chatkit/user_already_exists') {
        console.log('User already exists ', user.name)
        res.status(201).json(user)
      } else {
        console.error(error)
        res.status(error.status).json(error)
      }
    })
})

app.listen(3001)
console.log('Running on port 3001')
