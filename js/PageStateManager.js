PageStateManager = (function () {
    
    var initPage = function (page, viewModel) {

        // If binding exists, return
        if (ko.dataFor(page[0]))
            return;

        if (viewModel) {
            // If binding viewModel provided, apply binding
            ko.applyBindings(viewModel, page[0]);
        }
        else {
            // No binding provided, try to create a default from "data-viewModel" attribute
            var viewModelName = page.attr("data-viewModel");

            if (viewModelName) {
                viewModel = eval('new ' + viewModelName + '()');
                ko.applyBindings(viewModel, page[0]);
            }
//            else
//                throw('Error moving to page ' + page[0] + '. No view model provided !');
        };

    };

    var changePage = function (url, viewModel) {
        //Console.log('Enter changePage ' + url);
        $.support.cors = true;
        $.mobile.allowCrossDomainPages = true;

        $.mobile.changePage(url, { viewModel: viewModel });
        //Console.log('Exit changePage ' + url);
    };

    var onPageChange = function (e, info) {
        initPage(info.toPage, info.options.viewModel);
    };

    $(document).bind("pagechange", onPageChange);

	var yearStart;
	var yearEnd;
	var firstDayOfCurrentMonth;
	var currentClass;
	var currentStudent;
	var currentDate;
	var currentStudent;
	var userName;
	var userPassword;
	
	return {
        initPage: initPage,
        changePage: changePage,
		yearStart: yearStart,
		yearEnd: yearEnd,
		firstDayOfCurrentMonth: firstDayOfCurrentMonth,
		currentClass: currentClass,
		currentStudent: currentStudent,
		currentDate: currentDate,
		userName: userName,
		userPassword: userPassword
    };
})();