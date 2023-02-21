'use strict';
// These lines make "require" available 
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const port =  process.env.PORT || 3000;
import connect from './database/conn.js';

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
// routes
app.use('/profile', require('./routes/profile.cjs')());
app.use('/comment', require('./routes/comment.cjs')());

//start db connection
connect().then(()=>{
    try {
        // start server
        const server = app.listen(port);
        console.log('Express started. Listening on %s', port);  
    } catch (error) {
        console.log(`Can't connect to the server. `);
    }
}).catch((error)=>{
    console.log(`Can't connect to the server. `+ error.message);
})

