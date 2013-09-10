LoggedOnUser = (function () {
    var userName = ko.observable("");
    var userPassword = ko.observable("");

    var init = function (user, password) {
		if (userName() !== undefined && userName().length > 0)
            return;

		userName(user);
		userPassword(password);
    };

    // carUses, loadCarUses and carUsesCaption constitute the "public interface" 
    // of singleton ErgoApplicationContext
    //
    var res = {
        userName: function() { return userName(); },
        userPassword: function() { return userPassword(); },
        init: init
    };

    return res;
})();