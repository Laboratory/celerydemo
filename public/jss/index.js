$(document).ready(function() {
	var ws = new SockJS('http://127.0.0.1:15674/stomp');
	var client = Stomp.over(ws);
	// SockJS does not support heart-beat: disable heart-beats
	client.heartbeat.incoming = 0;
	client.heartbeat.outgoing = 0;
	document.__client = client;

	client.connect("guest", "guest", function() {
		console.log("connected");
//		document.__client.send('celery', null, TaskMessage({
//		  task: 'tasks.time'
//		}))
	}, function() {
		console.error("error");
	}, "/");
});