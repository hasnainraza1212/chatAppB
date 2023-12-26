// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);
// try{
//     const createService = async () => {
//         await  client.messages 
//             .create({ 
//                body: 'twilio', 
//                from: '+12674607985',       
//                to: '+923172922032' 
//              })
//       }
//       createService()
// }
// catch(err){
//     resizeBy.json({})
// }




const hash = (s) => {
    let h = 0;

    for (let i =0; i<s.length; i++){
        h = 31 * h + s.charCodeAt(i);
    }

    return h;
}


console.log(hash("Osama"));














