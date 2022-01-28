import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cron from 'cron';
import { Position } from './models/positions.js';
import { HandlePairs } from './priceMonitor.js';

dotenv.config();

const USDCETTH = "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4"
const BTCETH = "0xdeb288F737066589598e9214E782fa5A8eD689e8"
const ETHUSD = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
const BTCUSD = "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"
const DAIUSD = "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9"


const app = express();
app.use(
    express.urlencoded({
      extended: true
    })
)
  
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const dbURI = process.env.DB_URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })  
    .then((result) => {
        console.log('Connected to MongoDB Atlas');
        app.listen(process.env.PORT)
    })
    .catch((err) => console.log(err));

//add new position
app.post('/newlp', (req, res) => {
    const position = new Position(req.body)
    console.log(req.body)
    position.save()
        .then((result) => {
            res.status(200).send(result)
            console.log('Position saved')
        })
        .catch((err) => {
            res.status(400).send(err)
            console.log(err)
        });
})

//get all positions for a user
app.get('/userlps', async (req, res) => {
    const reqEmail = req.body.email
    //const reqBody = req.body
    const userpositions = await Position.findOne({email: reqEmail})
        .then((result) => {
            res.status(200).send(result)
            console.log('Position retrieved for', reqEmail)
        })
        .catch((err) => {
            res.status(400).send(err)
            console.log(err)
        });
})

//update liquidity position
app.put('/updatelp', async (req, res) => {
    const reqEmail = req.body.email
    const updatepositions = await Position.findOneAndUpdate(reqEmail, req.body)
        .then((result) => {
            res.status(200).redirect('/userlps')
            console.log('Position updated for', reqEmail)
        })
        .catch((err) => {
            res.status(400).send(err)
            console.log(err)
        });
})

app.delete('/deletelp', async (req, res) => {
    const reqEmail = req.body.email
    const deletepositions = await Position.findOneAndDelete(reqEmail)
        .then((result) => {
            res.status(200)
            console.log('Position deleted for', reqEmail)
        })
        .catch((err) => {
            res.status(400).send(err)
            console.log(err)
        });
})

async function setUpJobs() {
    await cron.schedule('00 12 * * *', HandlePairs(USDCETTH))
    await cron.schedule('00 13 * * *', HandlePairs(BTCETH))
    await cron.schedule('00 14 * * *', HandlePairs(ETHUSD))
    await cron.schedule('00 15 * * *', HandlePairs(BTCUSD))
    await cron.schedule('00 16 * * *', HandlePairs(DAIUSD))
}

setUpJobs();