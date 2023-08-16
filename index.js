const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require("dotenv")
const path = require("path")
const helmet = require("helmet")
const morgan =  require('morgan')

const authRoutes = require('./controllers/auth')
const userRoutes =  require('./routes/users')
const postRoutes = require('./routes/posts')
const rolesRoutes = require('./routes/roles')

//Configuration
dotenv.config()
const app = express()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//Middleware
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(cors())


//Routes middleware
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/roles', rolesRoutes)


//Mongoose Setup
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> {
    console.log("Database connected successfully")
})
.catch((err)=> {
    console.log(`${err} did not connect`)
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
