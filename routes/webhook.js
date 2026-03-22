
const express=require('express');
const router=express.Router();
const backtest=require('../services/backtest');
const telegram=require('../services/telegram');

router.post('/',async(req,res)=>{
 let m=req.body.message;
 if(!m||!m.text) return res.sendStatus(200);

 if(m.text.startsWith('/backtest')){
  let p=m.text.split(" ");
  let sym=p[1]||"EUR/USD";
  let from=p[2]||"2024-01-01";
  let to=p[3]||"2024-03-01";
  let r=await backtest.run(sym,from,to);
  await telegram.reply(m.chat.id,r);
 }
 res.sendStatus(200);
});
module.exports=router;
