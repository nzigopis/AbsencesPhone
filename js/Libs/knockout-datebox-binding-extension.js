ko.bindingHandlers.dateBoxValue = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		$(element).bind('datebox', function (e, p) {
			if ( p.method === 'set' ) {
				var observable = valueAccessor();
	            observable( p.date );
			};
		});
	},
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).val( (new JsSimpleDateFormat("yyyy-MM-dd")).format(value) );
    }
};