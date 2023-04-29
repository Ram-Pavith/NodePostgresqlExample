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
        console.log("post error |"+ex.message)
    }
    //res = res.json
    //console.log(req.params)

})


app.put("/api/PutUserId",async (req,res)=>{
    const {id,name} = req.body
    const out = req.body
    console.log(out)
    res.setHeader("Content-Type", "application/json")
    res.send(req.body)
    try{
        pool.query(`update ids set name=$2 where id=$1`,[id,name])
    }
    catch(ex){
        console.log("Put error |"+ex.message)
    }
    
})

app.delete("/api/RemoveUserId",async (req,res)=>{
    const {id} = req.body
    try{
        console.log("Deleting id:"+id+" from the database")
        pool.query(`delete from ids where id=$1`,[id])
        res.send("Deleting id:"+id+" from the database")
    }catch(ex){
        console.log("Delete error|"+ex.message)
    }
})
app.listen(5001,console.log("listening in port 5000"))