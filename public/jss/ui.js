$(document).ready(function() {
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
		message = JSON.parse(params.message);
		var text = 'tasks.' + params.name + '#' + message.id;
		$('#tasks_info').append('<p class="bg-danger">' + text + '</p>');
	})
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


