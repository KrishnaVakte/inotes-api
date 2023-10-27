import express from "express";
import connectToMongo from "./db.js";
import auth from "./routes/auth.js"
import notes from './routes/notes.js'
import cors from 'cors'

const app=express()
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json())

connectToMongo()

app.get('/', (req,res)=>{
    res.send('app running')
})

app.use('/api/auth',auth);
app.use('/api/notes',notes)

app.listen(port,()=>{
    console.log(`app is listenining on port ${port} : http://localhost:${port}/`)
})