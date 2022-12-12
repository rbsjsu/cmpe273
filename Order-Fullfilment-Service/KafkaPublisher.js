
const kafka = require('kafka-node');
const Client = kafka.KafkaClient;
const Producer = kafka.Producer;
const config = require('./config').kafka;

const kafkaHost = config.hostName;

module.exports.publish=function(topic, msg ){
  
 
    // The client connects to a Kafka broker
   let message = JSON.stringify(msg)
    const client = new Client({ kafkaHost });
    // The producer handles publishing messages over a topic
    const producer = new Producer(client);

    // First wait for the producer to be initialized
    producer.on(
        'ready',
        ()=> {
            // Update metadata for the topic we'd like to publish to
             client.refreshMetadata(
                [topic],
                (err)=> {
                    if (err) {
                        throw err;
                    }

                    console.log(`Sending message to ${topic}`);
                    producer.send(
                        [{ topic, messages: [message] }],
                        (err, result) => {
                         if(err){
                         //res.status(500).send({message:err})
                            console.log(err);
                         }else{
                           console.log(msg.eventType + " event published !");
                            //res.send(result);
                         }
                           
                            // process.exit();
                        }
                    );
                }
            );
        }
    );
    
    producer.on(
        'error',
        (err) => {
            console.log('error', err);
        }
    );


   
}

