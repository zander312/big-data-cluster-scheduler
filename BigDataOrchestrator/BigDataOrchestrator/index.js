const ENV = require('dotenv').config()
const AWS = require('aws-sdk')
const ec2 = new AWS.EC2()
const axios = require('axios')

exports.handler = (event, context, callback) => {
  let payload = event.data
  //let payload = payloadOne
  //let payload = payloadZero
  //let payload = payloadMulti
  //let payload = undefined

  if (payload) {
    const clusters = parseClusters(payload)
    payload.length !== 0 ? startClusters(clusters) : null
    stopClusters(clusters)
  }
  callback()
}

//parse cluster ids from event objects
const parseClusters = (events) => {
  let clusters = events.map((e) => {
    if (!events.includes(e.subcalendar_id)) {
      return e.subcalendar_id.toString()
    }
  })
  return clusters
}

//map cluster ids to cluster start functions
const startClusters = (clusters) => {
  clusters.map((cluster) => {
    switch (cluster) {
      case "4734111":
        startTaxi()
        break
      case "4734113":
        startHgos()
        break
    }
  })
}

// stop cluster
const stopClusters = (scheduledClusters) => {
  Object.keys(clusterMap).map((cluster) => {
    if (!scheduledClusters.includes(cluster)) {
      ec2.stopInstances({
        InstanceIds: clusterMap[cluster],
        DryRun: false
      }, function(err, data) {
        if (err) console.log(err, err.stack)
        else {
          console.log(`stopping cluster ${cluster}`)
          console.log(data)
        }
      })
    }
  })
}

// start taxi cluster
const startTaxi = () => {
  ec2.startInstances({
    InstanceIds: clusterMap["4734111"],
    DryRun: false
  }, function(err, data) {
    if (err) console.log(err, err.stack)
    else {
      console.log("starting taxihdp ec2 instances")
      console.log(data.StartingInstances[0].CurrentState)
    }
  })
  axios({
      url: `http://${ENV.parsed.TAXIHDP_HOSTNAME}:8080/api/v1/clusters/${ENV.parsed.TAXIHDP_CLUSTERNAME}/services`,
      method: 'put',
      headers: { 'X-Requested-By': 'ambari' },
      auth: {
        username: ENV.parsed.AMBARI_USER,
        password: ENV.parsed.AMBARI_PASS
      },
      data: `{"RequestInfo":{"context":"_PARSE_.START.ALL_SERVICES","operation_level":{"level":"CLUSTER","cluster_name":"${ENV.parsed.TAXIHDP_CLUSTERNAME}"}},"Body":{"ServiceInfo":{"state":"STARTED"}}}`
    })
    .then((res) => {
      console.log("starting taxihdp services")
      console.log(res.data)
    })
    .catch((err) => {
      console.log("error starting taxihdp services")
      console.log(err.response.data)
    })
}

// start taxi cluster
const startHgos = () => {
  ec2.startInstances({
    InstanceIds: clusterMap["4734113"],
    DryRun: false
  }, function(err, data) {
    if (err) console.log(err, err.stack)
    else {
      console.log("starting hgos ec2 instances")
      console.log(data.StartingInstances[0].CurrentState)
    }
  })
  axios({
      url: `http://${ENV.parsed.HGOS_HOSTNAME}:8080/api/v1/clusters/${ENV.parsed.HGOS_CLUSTERNAME}/services`,
      method: 'put',
      headers: { 'X-Requested-By': 'ambari' },
      auth: {
        username: ENV.parsed.AMBARI_USER,
        password: ENV.parsed.AMBARI_PASS
      },
      data: `{"RequestInfo":{"context":"_PARSE_.START.ALL_SERVICES","operation_level":{"level":"CLUSTER","cluster_name":"${ENV.parsed.HGOS_CLUSTERNAME}"}},"Body":{"ServiceInfo":{"state":"STARTED"}}}`
    })
    .then((res) => {
      console.log("starting hgos services")
      console.log(res.data)
    })
    .catch((err) => {
      console.log("error starting hgos services")
      console.log(err.response.data)
    })
}

// cluster id: [instances in cluster]
const clusterMap = {
  "4734111": ["i-0ff97b10c21d2ab14", "i-0f7943945cea2cef1", "i-00bbc8fb43adbcc76", "i-018a42946e8afff32", "i-04ef2eee18b4f85d5", "i-05423cdc919b8ea75", "i-07fd7510b086d7189", "i-0afd9479aa4df26fc", "i-0b86ce6cd05150122", "i-009f478c4a4d6c89f"],
  "4734113": ["i-054d1fb29655dcc7e", "i-0bfe8524f296ab067", "i-0438c70e68474d6d5", "i-0009679e06735dec5", "i-05f8cc815a420bca6", "i-0f9471f85c1a01b66", "i-0fad567df991f235c"]
}

// payloads
const payloadOne = [{
  id: '177582900',
  series_id: null,
  remote_id: null,
  subcalendar_id: 4734111,
  subcalendar_ids: [4734111],
  all_day: false,
  rrule: '',
  title: 'Taxi',
  who: 'alnelson@microstrategy.com',
  location: '',
  notes: null,
  version: '5ab1243657970',
  readonly: false,
  tz: null,
  start_dt: '2018-03-20T07:30:00-04:00',
  end_dt: '2018-03-20T20:00:00-04:00',
  ristart_dt: null,
  rsstart_dt: null,
  creation_dt: '2018-03-20T10:55:34-04:00',
  update_dt: '2018-03-20T11:09:42-04:00',
  delete_dt: null,
  custom: {}
}]

const payloadMulti = [{
    id: '177627289',
    series_id: null,
    remote_id: null,
    subcalendar_id: 4734113,
    subcalendar_ids: [4734113],
    all_day: false,
    rrule: '',
    title: 'hgos cluster',
    who: 'alnelson@microstrategy.com',
    location: '',
    notes: null,
    version: '5ab14d5ace4dc',
    readonly: false,
    tz: null,
    start_dt: '2018-03-20T06:30:00-04:00',
    end_dt: '2018-03-20T23:15:00-04:00',
    ristart_dt: null,
    rsstart_dt: null,
    creation_dt: '2018-03-20T14:05:14-04:00',
    update_dt: null,
    delete_dt: null,
    custom: {}
  },
  {
    id: '177582900',
    series_id: null,
    remote_id: null,
    subcalendar_id: 4734111,
    subcalendar_ids: [4734111],
    all_day: false,
    rrule: '',
    title: 'Taxi',
    who: 'alnelson@microstrategy.com',
    location: '',
    notes: null,
    version: '5ab1243657970',
    readonly: false,
    tz: null,
    start_dt: '2018-03-20T07:30:00-04:00',
    end_dt: '2018-03-20T20:00:00-04:00',
    ristart_dt: null,
    rsstart_dt: null,
    creation_dt: '2018-03-20T10:55:34-04:00',
    update_dt: '2018-03-20T11:09:42-04:00',
    delete_dt: null,
    custom: {}
  }
]

const payloadZero = []
