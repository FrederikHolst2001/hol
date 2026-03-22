
const axios=require('axios');
const telegram=require('./telegram');
const L=require('./logic');

const API_KEY=process.env.DATA_KEY;
const pairs=["EUR/USD","GBP/USD","USD/JPY","XAU/USD"];

function killzone(){ let h=new Date().getUTCHours(); return (h>=7&&h<=10)||(h>=13&&h<=16); }

exports.run=async()=>{
 if(!killzone()) return;

 for(let pair of pairs){
  try{
   let r=await axios.get(`https://api.twelvedata.com/time_series?symbol=${pair}&interval=5min&outputsize=100&apikey=${API_KEY}`);
   let closes=r.data.values.reverse().map(x=>+x.close);
   let candles=r.data.values.reverse().map(x=>({high:+x.high,low:+x.low}));

   let trend=L.HTFTrend(closes);
   let bos=L.BOS(closes);
   let mss=L.MSS(candles);
   let liq=L.liquidity(closes);
   let ind=L.inducement(closes);
   let z=L.zone(closes);

   if(!(bos&&mss&&liq&&ind)) continue;

   let price=closes[closes.length-1];
   let sl,tp;
   if(trend==="up"&&z==="discount"){ sl=price*0.997; tp=price*1.006; }
   else if(trend==="down"&&z==="premium"){ sl=price*1.003; tp=price*0.994; }
   else continue;

   let rr=Math.abs(tp-price)/Math.abs(price-sl);
   if(rr<2.5) continue;

   await telegram.send(`🏦 ${pair} ${trend==="up"?"BUY":"SELL"}
Entry:${price.toFixed(5)} SL:${sl.toFixed(5)} TP:${tp.toFixed(5)} RR:${rr.toFixed(2)}`);
  }catch{}
 }
};
