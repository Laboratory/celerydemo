$(document).ready(function() {
	var ws = new SockJS('http://127.0.0.1:15674/stomp');
	var client = Stomp.over(ws);
	// SockJS does not support heart-beat: disable heart-beats
	client.heartbeat.incoming = 0;
	client.heartbeat.outgoing = 0;

	function debugInfo(e, className) {
		$('#console_container').append('<div class=' + (className || '') + '>' + e + '</div>');
		console.log(e);
	}

	client.debug = debugInfo;

	client.connect("guest", "guest", $.proxy(function(client, frame) {
		['celery', '/queue/celery'].forEach(function(sub) {
			client.subscribe(sub, function(d) {
//				var massage_id = d.headers['message-id'];
//				d.ack(d.headers);
				debugInfo(arguments);
			});
		});
	}, null, client), function() {
		debugInfo(arguments, 'error');
	}, "/");

	$.subscribe('/tasks/create', $.proxy(function(client, ps, taskName) {
		var message = TaskMessage({
			task: 'tasks.' + taskName,
			kwargs: {}
		});

		client.send('celery', {
			'content-type': 'application/json',
			'content-encoding': 'utf-8'
		}, message);

		$.publish('/tasks/send', {
			message: message,
			name: taskName
		});

	}, null, client));
});