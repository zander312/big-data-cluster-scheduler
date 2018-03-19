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
    .then(checkScheduleForEvent)
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
const checkScheduleForEvent = (data) => {
  return new Promise((resolve, reject) => {
    const now = moment()
    data.events.map((event) => {
      if (now > moment(event.start_dt) && now < moment(event.end_dt)) {
        resolve(event)
      }
      else {
        resolve(false)
      }
    })
  })
}

//publish to SNS
const publishEventToSNS = (event) => {
  snsPayload.Message.default = JSON.stringify(event)
  snsPayload.Message = JSON.stringify(snsPayload.Message)
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
