exports.handler = (event, context, callback) => {
    let payload = JSON.parse(event.Records[0].Sns.Message)

    if (payload) {
        console.log("oi")
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
