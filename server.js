
const express=require('express');
const bodyParser=require('body-parser');
const webhook=require('./routes/webhook');
const scanner=require('./services/scanner');

const app=express();
app.use(bodyParser.json());
app.use('/webhook',webhook);

setInterval(scanner.run,20000);

app.listen(3000,()=>console.log('Ultimate bot running'));
