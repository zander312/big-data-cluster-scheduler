const ENV = require('dotenv').config()
const axios = require('axios')
const moment = require('moment')
const AWS = require('aws-sdk')
const sns = new AWS.SNS()

exports.handler = (event, context, callback) => {

  axios(axiosConfig)
    .then((res) => {
      return res.data
    })
    .then(checkScheduleForEvents)
    .then(publishEventToSNS)

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

//publish to SNS
const publishEventToSNS = (events) => {
  console.log(events)
  snsPayload.Message.default = JSON.stringify(events)
  snsPayload.Message = JSON.stringify(snsPayload.Message)
  console.log(snsPayload.Message)
  sns.publish(snsPayload, (err, res) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log(res)
    }
  })
}

let snsPayload = {
  "Message": { "default": "test" },
  "MessageStructure": 'json',
  "TargetArn": ENV.parsed.SNS_TOPIC_ARN
}
