const Eureka = require('eureka-js-client').Eureka;
const conf = require("./config.json").eureka;
const app = require("./config.json").application;
const server = require("./config.json").server;

const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || conf.host);
const eurekaPort = conf.port;
const hostName = (process.env.HOSTNAME || conf.hostname)
const ipAddr =conf.ipAddress;
var client;

   client = new Eureka({
    instance: {
      app: app.name,
      hostName: hostName,
       instanceId:hostName+":"+server.port,
      ipAddr: ipAddr,
      port: {
        '$': server.port,
        '@enabled': conf.enabled,
      },
      vipAddress: app.name,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: conf.dataCenter.name,
      },
    },
    
    eureka: {
      host: eurekaHost,
      port: eurekaPort,
      servicePath: conf.servicePath,
      maxRetries: conf.maxRetries,
      requestRetryDelay: conf.requestRetryDelay,
    },
  })

client.logger.level('debug')


// client.start( error => {
//     console.log(error || "This service registered")
// });



function exitHandler(options, exitCode) {
    if (options.cleanup) {
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
        client.stop();
    }
}

client.on('deregistered', () => {
    process.exit();
    console.log('after deregistered');
})

client.on('started', () => {
  console.log("eureka host  " + eurekaHost + ":" + eurekaPort);
})

process.on('SIGINT', exitHandler.bind(null, {exit:true}));


module.exports.client=client;



