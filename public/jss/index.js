(function(_global) {
	$(document).ready(function() {
		var ws = new SockJS('http://127.0.0.1:15674/stomp');
		var client = Stomp.over(ws);
		var queueManager;
		// SockJS does not support heart-beat: disable heart-beats
		client.heartbeat.incoming = 0;
		client.heartbeat.outgoing = 0;

		function debugInfo(e, className) {
			$('#console_container').append('<div class=' + (className || '') + '>' + e + '</div>');
			console.log(e);
		}

		client.debug = debugInfo;

		client.connect("guest", "guest", $.proxy(function(client) {
			debugInfo('CONNECT to STOMP', 'success');
			queueManager = new QueueManager(client);
		}, null, client), function(err) {
			debugInfo(err, 'error');
			$.publish('/error/text', err);
		}, "/");

		$.subscribe('/tasks/create', function(ps, taskName) {
			$.publish('/tasks/send', {
				message: queueManager.sendMessage(taskName),
				name: taskName
			});
		});
	});
})(this);
