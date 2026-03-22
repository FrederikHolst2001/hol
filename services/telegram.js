
const axios=require('axios');
const TOKEN=process.env.TELEGRAM_TOKEN;
const CHAT_ID=process.env.CHAT_ID;

exports.send=async(text)=>{
 await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{chat_id:CHAT_ID,text});
};
exports.reply=async(chatId,text)=>{
 await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{chat_id:chatId,text});
};
