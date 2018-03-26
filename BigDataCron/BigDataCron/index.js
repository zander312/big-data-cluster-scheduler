const ENV = require('dotenv').config()
const axios = require('axios')
const moment = require('moment')
const AWS = require('aws-sdk')
const sns = new AWS.SNS()
const lambda = new AWS.Lambda()

exports.handler = (event, context, callback) => {

  axios(axiosConfig)
    .then((res) => {
      console.log("retrieving teamup data")
      return res.data
    })
    .then(checkScheduleForEvents)
    .then(invokeBigDataOrchestrator)

  callback();
}

//current date for api call
const currentDate = moment().format('YYYY-MM-DD')

//api call config
const axiosConfig = {
  method: 'get',
  url: `https://api.teamup.com/${ENV.parsed.TEAMUP_ID}/events?startDate=${currentDate}&endDate=2020-01-01`,
  headers: {
    'Teamup-Token': ENV.parsed.API_KEY
  }
}

//check teamup schedule for event 
const checkScheduleForEvents = (data) => {
  return new Promise((resolve, reject) => {
    const now = moment()
    let events = []
    data.events.map((block) => {
      if (now > moment(block.start_dt) && now < moment(block.end_dt)) {
        events.push(block)
      }
    })
    resolve(events)
  })
}

const invokeBigDataOrchestrator = (events) => {
  console.log(events)
  let payload = JSON.stringify(events)
  lambdaParams.Payload = JSON.stringify({ data: events })
  lambda.invoke(lambdaParams, (err, data) => {
    if (err) { console.log(err) }
    else {
      console.log("invoking orchestrator lambda")
      console.log(data)
    }
  })
}

var lambdaParams = {
  FunctionName: "arn:aws:lambda:us-east-1:338194504807:function:cloud9-BigDataOrchestrator-BigDataOrchestrator-1L2WIF1OGQN3V",
  LogType: "Tail"
};
