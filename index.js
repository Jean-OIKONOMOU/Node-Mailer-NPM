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

  //Timestamp
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  var emailbody = template.generate(env.first).toString();
  //generates a string to send
  //the personalized HTML
  transporter.sendMail({
    from: 'Soloxs <johnsonharris8@gmail.com>',
    to: env.email, //email address of our recipient
    subject: 'Hello, ' + env.name + ' !',
    // Subject of the message
        subject: 'Nodemailer is unicode friendly ✔ Mr.' + env.name,

        // plaintext body
        text: 'Hello to myself!',

        // HTML body
        html: `<p><b>Hello</b> to myself</p>
        <p>Here's a nyan cat for you as an embedded attachment:<br/></p><p>Sent on the </p>`+ ` ` + today + ``,

        // AMP4EMAIL
        amp: `<!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body>
            <p><b>Hello</b> to myself <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
            <p>No embedded image attachments in AMP, so here's a linked nyan cat instead:<br/>
              <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
              <p>Sent on the </p>`+ ` ` + today + `
          </body>
        </html>`,
    // html: emailbody,
  }, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}
