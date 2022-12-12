//import { KafkaClient as Client, Consumer, Message, Offset, OffsetFetchRequest, ConsumerOptions } from 'kafka-node';
const kafka = require('kafka-node');
const config = require("../config").kafka;
const {consumeMessage} =require('./kafkaService');
const Client = kafka.KafkaClient;
const Consumer = kafka.Consumer;
 const Offset = kafka.Offset;
const kafkaHost = config.hostName;

module.exports.kafkaSubscribe= function(topic) {
    const client = new Client({ kafkaHost });
    const topics = [{ topic: topic, partition: 0 }];
    const options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024, fromOffset:false };

    const consumer = new Consumer(client, topics, options);

    consumer.on('error', function(err) {
        console.log('error', err);
    });

    client.refreshMetadata(
        [topic],
        (err) => {
            const offset = new Offset(client);

            if (err) {
                throw err;
            }

            consumer.on('message', function(message) {
              consumeMessage(message);
            });

            /*
             * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
             */
            consumer.on(
                'offsetOutOfRange',
                (topic)=> {
                    offset.fetch([topic], function(err, offsets) {
                        if (err) {
                            return console.error(err);
                        }
                        const min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
                        console.log(min);
                        consumer.setOffset(topic.topic, topic.partition, min);
                    });
                }
            );
        }
    );
}




