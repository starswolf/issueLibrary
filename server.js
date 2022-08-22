const express = require('express')
const cors = require('cors')
const app = express()

const path = __dirname + '/app/views/'
const corsOptions = {
    origin: "http://localhost:8081"
}

app.use(express.static(path))
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('./app/routes/auth.route')(app);
require('./app/routes/user.route')(app);
require('./app/routes/issue.route')(app);

app.use('/', (req, res) => {
    // res.json({ message: "Welcome!" })
    res.sendFile(path + 'index.html')
})

const PORT = process.env.PORT || 8123
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

const { sendMessage } = require('./app/messages/sendMessage')

setTimeout(() => {
    // console.log('Start')
    // setInterval(() => {
    //     console.log('OK!')
    // }, 20000)
    sendMessage()
}, 10000)
