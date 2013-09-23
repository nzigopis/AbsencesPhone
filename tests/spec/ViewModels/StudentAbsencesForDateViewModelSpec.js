describe("StudentAbsencesForDateViewModel Tests", function () {
    
    beforeEach(function () {
        status = null;
        data = null;
    });

    it("should callback(SERVER_FILE_STATUS.NOT_MODIFIED) if file on server Not Modified", function () {

		var d = new Date(2013, 0, 1);
		var s = new Student(100, 'nikos', 'zigo');
        vm = new StudentAbsencesForDateViewModel(d, s, function (student, forDate) {
			return new Absences(s.studentId, s, 1, 0, 0, 0, 0, 0, 0);
        });

        runs(function () {
            vm.download(callback, 'care.html', 'external_html', new Date());
        });

        waitsFor(function () {
            return status != null;
        }, "AJAX call should complete within 3'' ", 3000);

        runs(function () {
            expect(status).toEqual(SERVER_FILE_STATUS.NOT_MODIFIED);
        });
    });

//    it("should callback(SERVER_FILE_STATUS.NOT_FOUND) if file on server DOES NOT EXIST", function () {
//
//        downloader = new FileDownloader(function () {
//            return getXhrMock(4, 404);
//        });
//
//        runs(function () {
//            downloader.download(callback, 'where is it ?.html', 'external_html', new Date());
//        });
//
//        waitsFor(function () {
//            return status != null;
//        }, "AJAX call not completed within 3''", 3000);
//
//        runs(function () {
//            expect(status).toEqual(SERVER_FILE_STATUS.NOT_FOUND);
//        });
//    });

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


});