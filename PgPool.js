const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const Pool = require("pg").Pool
const router = express.Router()
const pool = new Pool({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"postgres",
    database:"TestDB"
})

const app = express()
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get("/api/GetUserIds",async (req,res)=>{
    try{
        const ids = await pool.query("select * from ids")
        res.json(ids.rows)
    }catch(ex){
        console.log("error in get|"+err.message)
    }
    

})
app.post("/api/PostUserId",async (req,res)=>{
    const{id,name} = req.body
    const out = req.body
    res.setHeader("Content-Type", "application/json")
    console.log(out)
    res.send(out)
    try{
        pool.query(`insert into ids values($1,$2)`,[id,name])
    }catch(ex){
        console.log(ex.message)
    }
    //res = res.json
    //console.log(req.params)

})
app.post("/post",async (req,res)=>{
    const out = req.body
    console.log(out)
    res.send(req.body)
})

app.listen(5001,console.log("listening in port 5000"))