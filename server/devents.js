const DockerEvents = require("docker-events")
const Dockerode = require('dockerode');

var emitter = new DockerEvents({
  docker: new Dockerode({socketPath: '/var/run/docker.sock'}),
});

emitter.start();

emitter.on("connect", function() {
  console.log("connected to docker api");
});

emitter.on("disconnect", function() {
  console.log("disconnected to docker api; reconnecting");
});

emitter.on("_message", function(message) {
  console.log("got a message from docker: %j", message);
});