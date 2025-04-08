import dotenv from  'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'


import userRoutes from './routes/user_routes.js'
import taskRoutes from './routes/task_routes.js'


const port=process.env.PORT
const DATABASE_URL=process.env.DATABASE_URL

const app=express()

//cross origin resource sharing for react calling the API
app.use(cors())

app.use(express.json())


//DECLARING ROUTES
app.use("/api/user",userRoutes)
app.use("/api/tasks",taskRoutes)




app.listen(port,()=>{
    console.log(`App is listening to you at port ${port}` )
})

