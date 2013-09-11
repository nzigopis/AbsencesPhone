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
            else
                throw('Error moving to page ' + page[0] + '. No view model provided !');
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
        //Console.log('Enter onPageChange=' + info.toPage);
        initPage(info.toPage, info.options.viewModel);
        //Console.log('Exit onPageChange');
    };

    $(document).bind("pagechange", onPageChange);

    return {
        initPage: initPage,
        changePage: changePage
    };
})();