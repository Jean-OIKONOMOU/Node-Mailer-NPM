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
//all our contacts
var message_increment = 0;
//variable to move to the next
//contact
