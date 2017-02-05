'use strict';

const validator = require("email-validator");
const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_TO = process.env.EMAIL_TO;
const TABLE = process.env.TABLE_NAME;
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN}); // emailing service
const mailcomposer = require('mailcomposer');
const Hogan = require('hogan.js');
const fs = require('fs');
const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();
const uuid = require('uuid');
const RESPONSES = require('./models/responses');
const template = fs.readFileSync('./views/email.hjs', 'utf-8');
const compiledTemplate = Hogan.compile(template);

let model = {};

module.exports.contact = (event, context, callback) => {

  // data from user
  const spam = event.queryStringParameters.company;
  const name = event.queryStringParameters.name;
  const number = event.queryStringParameters.number;
  const subject = event.queryStringParameters.subject;
  const user_message = event.queryStringParameters.message;
  const email = event.queryStringParameters.email;

  // spam protection
  if (spam) {
    callback(null, RESPONSES.SPAM)
    return;
  }

  // check email
  if (email) {
    const isValidEmail = validator.validate(email);
    if (!isValidEmail) {
      callback(null, RESPONSES.EMAIL);
      return;
    }
  }

  if (name && number && subject && user_message) {

      const mail = mailcomposer({
        from: EMAIL_FROM,
        to: EMAIL_TO,
        subject: name + '::' + subject,
        body: 'Test email subject',
        html: compiledTemplate.render({name: name, email: email, number: number, subject: subject, message: user_message})
      });

      mail.build(function (mailBuildError, message) {

        const dataToSend = {
          to: EMAIL_TO,
          message: message.toString('ascii')
        };

        mailgun.messages().sendMime(dataToSend, function (sendError, body) {
          if (sendError) {
            console.log(sendError);
            return;
          }
          const timestamp = new Date().getTime();

          model.id = uuid.v1();
          model.number = number;
          model.name = name;
          model.email = email;
          model.subject = subject;
          model.message = user_message;
          model.createdAt = timestamp;
          model.ip = event.requestContext.identity.sourceIp;

          db.put({
            TableName: TABLE,
            Item: model,
            Expected: {
              number: { Exists: false }
            }
          }, (error, result) => {
            // handle potential errors
            if (error) {
              console.error(error); // eslint-disable-line no-console
              callback(new Error('Couldn\'t create the client item.'));
              return;
            }

            // create a response
            const response = {
              statusCode: 200,
              body: JSON.stringify(result.Item),
            };
            callback(null, response);
          });

          callback(null, RESPONSES.OK);

        });
      });
      return;
    }


  callback(null, RESPONSES.ERROR);

};
