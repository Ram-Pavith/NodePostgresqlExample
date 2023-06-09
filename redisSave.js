const express = require('express');
const fetch = import('node-fetch');
const redis = require('redis');
const axios = require('axios')

const PORT = process.env.PORT || 5004;
const REDIS_PORT = process.env.PORT || 6380;

const client = redis.createClient({ socket: { port: REDIS_PORT } });
(async ()=>{
  await client.connect()
})()
client.on('connect', () => {
    console.log('Redis connected');
});

const app = express();

// Set response
function setResponse(username, repos) {
  return `<h2>${username} has ${repos} Github repos</h2>`;
}

// Make request to Github for data
async function getRepos(req, res, next) {
  try {
    console.log('Fetching Data...');

    const { username } = req.params;

    const response = await axios.get(`https://api.github.com/users/${username}`);

    const data = await response.json();

    const repos = data.public_repos;

    // Set data to Redis
    client.setex(username, 3600, repos);

    res.send(setResponse(username, repos));
  } catch (err) {
    console.error(err);
    res.status(500);
  }
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

app.get(`/repos/:username`, cache,getRepos);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});