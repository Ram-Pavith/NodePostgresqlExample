const express = require("express")
const cors = require("cors")
const redis = require("redis")
const fetch = import('node-fetch')
const Pool = require("pg").Pool
const router = express.Router()
const redisPort = 6379
const port = 5001
const client = redis.createClient({ socket: { port: redisPort } });

client.connect();

client.on('connect', () => {
    console.log('Redis connected');
});
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
        res.status(200)
    }catch(ex){
        console.log("error in get|"+err.message)
        res.status(400)
    }
    

})
app.post("/api/PostUserId",async (req,res)=>{
    const{id,name} = req.body
    const out = req.body
    res.setHeader("Content-Type", "application/json")
    console.log(out)
    res.send(out)
    res.status(200)
    try{
        pool.query(`insert into ids values($1,$2)`,[id,name])
        res.send("inserted successfully")
        res.status(200)
    }catch(ex){
        console.log("post error |"+ex.message)
        res.status(400)
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
    res.status(200)
    try{
        pool.query(`update ids set name=$2 where id=$1`,[id,name])
    }
    catch(ex){
        console.log("Put error |"+ex.message)
        res.status(400)
    }
    
})

app.delete("/api/RemoveUserId",async (req,res)=>{
    const {id} = req.body
    try{
        console.log("Deleting id:"+id+" from the database")
        pool.query(`delete from ids where id=$1`,[id])
        res.send("Deleting id:"+id+" from the database")
        res.status(200)
    }catch(ex){
        console.log("Delete error|"+ex.message)
        res.status(400)
    }
})

app.get('/repos/:username',cache, getRepos)


function setResponse(username,repos){
    return `<h2>${username} has ${repos} Github repos</h2>`
}

// Cache middleware
function cache(req, res, next) {
    const { username } = req.params;
  
    client.get(username, (err, data) => {
      if (err) throw err;
  
      if (data !== null) {
        res.send(setResponse(username, data));
      } else {
        next();
      }
    });
  }

async function getRepos(req,res,next){
    try{
        console.log("fetching github repos")
        const {username} = req.params
        const response = await fetch(`https://api.github.com/users/${username}`)
        const data = response.json()
        res.send(data)
        const repos = data.public_repos

        //setting data in redis
        client.setEx(username,3600,repos)
        res.send(setResponse())
    }
    catch(error){
        console.log("error fetching github data|"+error.message)
        res.status(500)
    }
}
app.listen(port,console.log("listening in port "+port))
