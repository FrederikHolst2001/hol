
const axios=require('axios');
const L=require('./logic');
const API_KEY=process.env.DATA_KEY;

exports.run=async(symbol,from,to)=>{
 symbol = symbol.replace("/", "").toUpperCase();
 try{
  symbol = symbol.replace("/", ""); // FIX

  let r = await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&outputsize=2000&apikey=${API_KEY}`);
  let vals=r.data.values.reverse();
  let candles=vals.map(v=>({t:new Date(v.datetime),h:+v.high,l:+v.low,c:+v.close}));

  let f=new Date(from), t=new Date(to);
  candles=candles.filter(x=>x.t>=f && x.t<=t);

  let wins=0,losses=0,equity=0,peak=0,maxDD=0;

  for(let i=25;i<candles.length-1;i++){
    let slice=candles.slice(i-25,i);
    let closes=slice.map(x=>x.c);
    let highsLows=slice.map(x=>({high:x.h,low:x.l}));

    let trend=L.HTFTrend(closes);
    let bos=L.BOS(closes);
    let mss=L.MSS(highsLows);
    let liq=L.liquidity(closes);
    let ind=L.inducement(closes);
    let z=L.zone(closes);

    if(!(bos&&mss&&liq&&ind)) continue;

    let entry=candles[i].c;
    let sl,tp;
    if(trend==="up"&&z==="discount"){ sl=entry*0.997; tp=entry*1.006; }
    else if(trend==="down"&&z==="premium"){ sl=entry*1.003; tp=entry*0.994; }
    else continue;

    let rr=Math.abs(tp-entry)/Math.abs(entry-sl);
    if(rr<2.5) continue;

    let next=candles[i+1];
    let result=0;
    if(trend==="up"){
      if(next.h>=tp) result=rr;
      else if(next.l<=sl) result=-1;
    }else{
      if(next.l<=tp) result=rr;
      else if(next.h>=sl) result=-1;
    }
    if(result===0) continue;

    if(result>0) wins++; else losses++;
    equity+=result;

    if(equity>peak) peak=equity;
    let dd=peak-equity; if(dd>maxDD) maxDD=dd;
  }

  let trades=wins+losses;
  let winrate=trades?((wins/trades)*100).toFixed(1):0;

  return `📊 ${symbol}
Trades:${trades} Winrate:${winrate}%
Profit:${equity.toFixed(2)}R MaxDD:-${maxDD.toFixed(2)}R`;
 }catch{ return "error"; }
};
