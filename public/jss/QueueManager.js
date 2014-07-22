(function(_global) {
	var QueueManager = function(client) {
		this.client = client;
		this.QUEUE_NAME = '/queue/celery';
		this.CELERY_RESULT_EXCHANGE = '/exchange/celeryresults/';
		this.CELERY_DEFAULT_EXCHANGE = 'celery';
		this.queue = {};
		//save global singleton manager
		_global.queueManager = this;
//		this.addQueue(this.queueName, function(message) {
//			console.log(arguments);
//			message.nack(message.headers);
//		});
	};

	QueueManager.prototype.addQueue = function(name, callback) {
		this.client.subscribe(name || this.QUEUE_NAME, callback, {
			id: uuid.v1()
		});
	};

	QueueManager.prototype.getArgsByTask = function(taskName) {
		var args = [];
		if (taskName == 'sleep') {
			args = [Math.floor(Math.random() * 10) + 1];
		}
		return (args);
	};

	QueueManager.prototype.sendMessage = function(taskName, params) {
		var message = TaskMessage({
			task: 'tasks.' + taskName,
			args: this.getArgsByTask(taskName),
			kwargs: {}
		});

		this.queue[message.id] = message;
		var subscribeUrl = this.CELERY_RESULT_EXCHANGE + message.id.replace(/\-/g, '');
		this.addQueue(subscribeUrl, function(message) {
			var body = message.body;
			var result = JSON.parse(body);
			if (result && result.status) {
				$.publish('/message/recive', result);
			}
		});

		this.client.send(this.CELERY_DEFAULT_EXCHANGE, {
			'content-type': 'application/json',
			'content-encoding': 'utf-8'
		}, JSON.stringify(message));

		return (message);
	};

	QueueManager.prototype.getTaskResult = function(task) {
		var status = task.status.toLowerCase();
		var message = this.queue[task.task_id];
		var result = '';
		if (status == 'failure') {
			result = task.result.exc_message;
		} else if (message.task == 'tasks.sleep') {
			result = task.result;
		} else if (message.task == 'tasks.time') {
			result = new Date(task.result * 1000);
		}
		return (result);
	};

	_global.QueueManager = QueueManager;
})(this);