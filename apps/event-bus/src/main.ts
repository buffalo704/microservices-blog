import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4005;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post('http://comments-srv:4001/events', event).catch((err) => {
    console.log(err.message);
  });
  axios.post('http://query-srv:4002/events', event).catch((err) => {
    console.log(err.message);
  });  
  axios.post('http://moderation-srv:4003/events', event).catch((err) => {
    console.log(err.message);
  });  
  
  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});


app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
