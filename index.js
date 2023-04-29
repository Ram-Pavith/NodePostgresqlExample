const express = require("express")
const cors = require("cors")
const {Client} = require("pg")
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"postgres",
    database:"TestDB"
})

const app = express()
app.use(cors())
var userids
client.connect()
function SelectAll(){
    client.query("select * from ids;",(err,res)=>{
        if(!err){
            userids = res.rows
            console.table(userids)
        }else{
            console.log("error message"+err.message)
        }
        client.end
    })
}

function Insert(id){
    client.query(`Insert into ids values(3,'three');`,(err,res)=>{
        if(!err){
            console.log(res.rows)
        }else{
            console.log("error message|"+err.message)
        }
    })
}
//SelectAll()
// Insert()

app.get("/api/GetUserIds",(req,res)=>{
    SelectAll()
    res.json(userids)

})
app.post("/api/PostUserId",(req,res)=>{
    Insert(req.params)
    SelectAll()
    res.json(userids)

})

app.listen(5001,console.log("listening in port 5000"))