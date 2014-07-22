$(document).ready(function() {
	$.subscribe('/error/text', function(ps, text) {
		$('#error_body').text(text);
		$('#error_modal').modal('show');
	});

	$('.navbar ul.nav li').on('click', function(evt) {
		var node = $(evt.currentTarget);
		var elementSelect = node.attr("ref");
		$(".navbar ul.nav li, body > .container").removeClass("active").addClass(function() {
			if (elementSelect == $(this).attr("ref")) {
				$(this).addClass("active");
			}
		});
	});

	$('#createTaskBtn').on('click', function(evt) {
		var taskName = $('#tasks option:selected').val();
		$.publish('/tasks/create', taskName);
	});

	$.subscribe('/tasks/send', function(ps, params) {
		var message_id = params.message.id;
		var text = 'tasks.' + params.name + '#' + message_id;
		$('#tasks_info').append('<p task_id=' + message_id + ' class="bg-danger">' + text + '</p>');
	});

	$.subscribe('/message/recive', function(ps, task) {
		var task_id = task.task_id;
		var pNode = $('#tasks_info p[task_id=' + task_id + ']');
		pNode.append('<span>' + getTaskResult(task) + '</span>')
				.addClass(task.status.toLowerCase());
	});

	function getTaskResult(task) {
		return queueManager.getTaskResult(task);
	}
});

//https://gist.github.com/addyosmani/1321768
(function($) {
	var o = $({});
	$.subscribe = function() {
		o.on.apply(o, arguments);
	};
	$.unsubscribe = function() {
		o.off.apply(o, arguments);
	};
	$.publish = function() {
		o.trigger.apply(o, arguments);
	};
}(jQuery));


