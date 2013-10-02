IndexViewModel = function () {

    var self = this;
	
    self.userName = ko.observable("");
    self.userPassword = ko.observable("");
    self.loginMessage = ko.observable("");
    self.log = ko.observable("");
    var errorLabel = self.loginMessage;
        
    self.login = function () {
        errorLabel("");

        var user;
        if (self.userName)
            user = self.userName();
        else
            user = PageStateManager.userName;
		
        var pwd;
        if (self.userPassword)
            pwd = self.userPassword();
        else
            pwd = PageStateManager.userPassword;

        $.mobile.loading('show');

        DbFuncs.login(user, pwd, 
            function () {
                $.mobile.loading('hide');
                errorLabel("");
                PageStateManager.changePage('classes.html', new ClassesViewModel()); 
            },
            function (error) {
                $.mobile.loading('hide');
                var current = self.log(); 
                self.log(current + "\n" + error);
            });
            
    };

};

	
//	self.items = [0,1,2,3];
//	self.anItem = ko.observable(3);
//	self.secItem= ko.observable();
//	self.names = function (n) {
//		switch (n) {
//			case 0:
//				return "";
//			case 1:
//				return "one";
//			case 2:
//				return "two";
//			case 3:
//				return "three";
//			default:
//				return "more";
//		};
//	};
//	
//	window.setTimeout(function() { 
//		self.anItem(self.items()[2]); 
//		self.secItem(self.items()[3]); 
////		var myselect = $("#s1");
////		myselect[0].selectedIndex = 3;
////		$("#s1").selectmenu();
//		$("#s1").selectmenu("refresh");
//		$("#s2").selectmenu("refresh");
//	}, 100)
	
