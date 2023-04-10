const express = require('express')
const app = require('./app')
const cors = require('cors')
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE"]
}))
const cloudinary = require('cloudinary').v2

const port = 5000
app.use(express.json())

cloudinary.config({
    cloud_name: "dmsmxdh1n",
    api_key: "344719853633286",
    api_secret: "awBGqmdZFUteuBf4L0V2OppcWSA"
})

app.listen(port, () => {
    console.log(`App is listing on port ${port}`)
})