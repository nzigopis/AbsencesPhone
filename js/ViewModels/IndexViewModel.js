IndexViewModel = function () {

    // Console.log('new LoginViewModel()');

    this.userName = ko.observable("");
    this.userPassword = ko.observable("");
    this.loginMessage = ko.observable("");

    this.login = function () {
        var errorLabel = this.loginMessage;
        errorLabel("");

        var user = this.userName();
        var pwd = this.userPassword();

        try
		{
			$.mobile.loading('show');
        	
			DbSync.pull(user, pwd);
			LoggedOnUser.init('nikos', 'zigopis');
			PageStateManager.changePage('class.html', {});
		}
		catch(err)
		{
			this.loginMessage(JSON.stringify(err));
		}
		finally
		{
			$.mobile.loading('hide');
		}
    };

}
