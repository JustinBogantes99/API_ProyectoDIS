const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

/* Configuración de las Variables del Entorno  (.env)*/
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* Mongo Database */

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database conected!")
});

/*  */

const securityRouter = require('./routes/Security');
const salaRouter = require('./routes/Sala');
const usuarioRouter = require('./routes/Usuario');

app.use('/Seguridad', securityRouter);
app.use('/Sala', salaRouter);
app.use('/Usuario', usuarioRouter);

app.listen(port, () => {
    console.log(`Server is online on port: ${port}`);
})