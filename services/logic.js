
function HTFTrend(arr){ return arr[arr.length-1] > arr[arr.length-20] ? "up":"down"; }
function MSS(c){ let a=c[c.length-1],b=c[c.length-2]; return a.high>b.high||a.low<b.low; }
function BOS(arr){ return arr[arr.length-1] > arr[arr.length-2]; }
function liquidity(arr){
  let highs=[...arr].sort((a,b)=>b-a), lows=[...arr].sort((a,b)=>a-b);
  let last=arr[arr.length-1];
  return last>highs[1] || last<lows[1];
}
function inducement(arr){
  let last=arr[arr.length-1], prev=arr[arr.length-4];
  return Math.abs(last-prev)<0.0004;
}
function zone(arr){
  let high=Math.max(...arr), low=Math.min(...arr), mid=(high+low)/2;
  let price=arr[arr.length-1];
  return price<mid?"discount":"premium";
}
module.exports={HTFTrend,MSS,BOS,liquidity,inducement,zone};
