describe("Absence Type Modification Tests", function () {
    
    beforeEach(function () {
        status = null;
        data = null;
    });

    it("should set 1..n-1 hours as not absent is n hour is first absence", function () {

		var d = new Date(2013, 0, 1);
		var s = new Student(100, 'nikos', 'zigo');
        vm = new StudentAbsencesForDateViewModel(d, s, function (student, forDate, successCallback) {
			successCallback(new Absences(s.studentId, s, AbsenceEnum.UNEXCUSED_FIRST, 0, 0, 0, 0, 0, 0));
        });

		// Set second absence as first hour 
        vm.absences[1](AbsenceEnum.UNEXCUSED_FIRST);
		
        expect(vm.absences[0]()).toEqual(0);
		expect(vm.absences[1]()).toEqual(AbsenceEnum.UNEXCUSED_FIRST);
    });


});


//    it("should callback(SERVER_FILE_STATUS.MODIFIED, <new html data>) if file on server Modified", function () {
//
//        downloader = new FileDownloader(function () {
//            return getXhrMock(4, 200, new Date(), '<html></html>');
//        });
//
//        runs(function () {
//            downloader.download(callback, 'care.html', 'external_html', new Date(1970, 0, 1));
//        });
//
//        waitsFor(function () {
//            return status != null;
//        }, "AJAX call", 3000);
//
//        runs(function () {
//            expect(status).toEqual(SERVER_FILE_STATUS.MODIFIED);
//            expect(data).toMatch(/<html>/);
//        });
//    });

    // Mocks
    //

//    var downloader, status, data;
//
//    var callback = function (s, d) { status = s; data = d; };
//
//    var getXhrMock = function (mockState, mockStatus, mockFileModificationDate, mockData) {
//        var xhr = {
//            open: function (requestType, url, async) {
//                xhr.mockData = { 'requestType': requestType, 'url': url, 'async': async };
//            },
//            readyState: 0,
//            status: 0,
//            onreadystatechange: null,
//            getResponseHeader: function () { return mockFileModificationDate; },
//            send: function () {
//                xhr.readyState = mockState;
//                xhr.status = mockStatus;
//                xhr.responseText = mockData;
//                // Simulate async call
//                setTimeout(function () { xhr.onreadystatechange(); }, 20);
//            }
//        };
//
//        return xhr;
//    };
