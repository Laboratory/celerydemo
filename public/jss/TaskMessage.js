/*
 * Example message celery protocol
 * docs.celeryproject.org/en/latest/internals/protocol.html
 *
 {
 "id": "4cc7438e-afd4-4f8f-a2f3-f465i67e7ca77",
 "task": "celery.task.PingTask",
 "args": [],
 "kwargs": {},
 "retries": 0,
 "eta": "2009-11-17T12:30:56.527191"
 }
 */

(function(_global) {

	var protocolFields = [
		/*-----Message format-----*/

		/*String*/'task',
		/*String*/'id',
		/*list*/'args',
		/*dictionary*/'kwargs',
		/*int*/'retries',
		/*string (ISO 8601)*/'eta',
		/*string (ISO 8601)*/'expires',

		/*-----Extensions-----*/

		/*String*/'taskset',
		/*subtask*/'chord',
		/*bool*/'utc',
		/*<list>subtask*/'callbacks',
		/*<list>subtask*/'errbacks',
		/*<tuple>(float, float)*/'timelimit'/*{'timelimit': (3.0, 10.0)}*/

	];

	function formatDate(date) {
		new Date(date || new Date()).toISOString().slice(0, -1);
	}

	_global.TaskMessage = function(options) {
		options = options || {};
		var message = {
			id: options.id || uuid.v4()
		};
		for (var field in options) {
			if (!options.hasOwnProperty(field))
				continue;
			if (protocolFields.indexOf(field) > -1) {
				message[field] = options[field];
			}
		}
		if (message.eta) {
			message.eta = formatDate(message.eta);
		}
		if (message.expires) {
			message.expires = formatDate(message.expires);
		}
		return (message);
	}
})(this);