#!/usr/bin/env node
const nodemailer = require('nodemailer');
const csv = require('csvtojson/v1');
const schedule = require('node-schedule');
const template = require('./template.js');

const account = {
     user: 'johnsonharris8@gmail.com',
     pass: 'bob99bob'
}
var transporter = nodemailer.createTransport({
     pool: true, //keeps the server connection open
     host: 'smtp.gmail.com', //your email server
     port: 465, //gmail uses SSL
     secure: true, //gmail sends secure
     auth: {
          user: account.user,
          pass: account.pass
     }
});

var testfile = './test_list.csv';
//my test list
var prodfile = './list.csv';
//path to our production list
var sendlist = [];
// empty array where we'll keep
// all our contacts
var message_increment = 0;
//variable to move to the next
//contact

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
    get_list();
    // trigger the whole app once the mail server is ready
  }
});

function get_list(){
  csv().fromFile(testfile) //or your production list
  .on('json', (jsonObj) => {
    sendlist.push(jsonObj);
  })
  .on('done', () => {
    set_message_delays();
  })
}

function set_message_delays(){
     var message_job = schedule.scheduleJob('*/3 * * * * *', function(){
          trigger_sending(sendlist[message_increment]);
          if(message_increment < sendlist.length){
               message_increment++;
              // if our increment is less than our list length,
              // we'll keep sending
          }
          if(message_increment >= sendlist.length){
               message_job.cancel();
               // stop our function when last message is sent
          }
    });
}

function trigger_sending(env){
  //env passes our email and name to
  //customize the message

  var emailbody = template.generate(env.first).toString();
  //generates a string to send
  //the personalized HTML

  //Timestamp
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  transporter.sendMail({
    // Soloxs is the title of notification
    from: 'Soloxs <johnsonharris8@gmail.com>',

    //email address of our recipient
    to: env.email,

    // Subject of the message, comes in second place in the notification box
    subject: 'Hello, ' + env.name + '! ✔',

    // plaintext body, comes in third place in the notification box
    text: 'Sent with Nodemailer !',

    // removes names from the attached files
    attachDataUrls : false,

    //Attachments, those can also be the email's html itself.
    // attachments: [{
    //   filename: 'nice image',
    //   path: 'img\\10.jpg',
    //   cid: 'unique@nodemailer.com' //same cid value as in the html img src
    // }],

    // HTML body
    html: `<!doctype html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <html>
      <head>
        <meta charset="utf-8">
        <style>body{visibility:hidden;} a{color:red;} img{margin:15px 0; padding:0;}</style>
      </head>
      <body>
        <p><b>Greetings,`+ ` ` + env.name + `.</b></p>
        <p>I don't know what I should write, try using <a href="https://beefree.io/templates/">BEE</a> or <a href="https://www.kevinmandeville.com/blog/how-gmail-amp4email-support-impacts-email-design">AMP4EMAIL</a> to create cool newsletters.</p>
        <p>For more information about Node-Mailing: https://nodemailer.com/message/</p>
        <p>For a clear-cut example check out <a href="https://github.com/nodemailer/nodemailer/blob/master/examples/full.js">this example</a>.</p>
        <p>For a look at the code behind this Node mailer check out <a href="https://github.com/Jean-OIKONOMOU/auto-fire">this link</a>.</p>
        <img src="https://t00.deviantart.net/I11X0IozTHbJnYGRw8KHw-e8gZM=/fit-in/300x900/filters:no_upscale():origin()/pre00/8ceb/th/pre/f/2017/269/5/a/marvel_vs__capcom_3__manuel___manny___calavera_by_kingoffiction-dbolxyi.png"/>
        <div>Sent on the </div>`+ ` ` + today + `
      </body>
    </html>`,

  }, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}
