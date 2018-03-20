exports.handler = (event, context, callback) => {
    console.log(event)
    let payload = JSON.parse(event.Records[0].Sns.Message)

    if (payload) {
        console.log("payload")
        console.log(payload)
    }
    else {
        // if the payload is false
    }

    callback();
};

const startCluster = () => {

}

const stopCluster = () => {

}
