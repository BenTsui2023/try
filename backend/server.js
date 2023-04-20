import express from 'express';
import parser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import apiRoutes from './routes/api/index.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();


app.use(parser.urlencoded({
    extended: false
}));

app.use(cors());

app.use(express.json());
app.use('/api', apiRoutes);

const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI;

mongoose.connect("mongodb://127.0.0.1:27017/try", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const connection = mongoose.connection;

connection.once("open", () => {
    console.log('Connected to the Mongodb')
})

app.get('/', (req, res) => {
    return res.send('Connected to the server');
});

app.listen(4000, () => {
    console.log(`starting server at port: ${port}`)
}); 