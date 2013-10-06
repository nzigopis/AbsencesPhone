describe("StudentAbsencesForDateViewModel Tests", function () {
    beforeEach(function () {
        
        d1 = new Date(2013, 0, 1);
        s1 = new Student(100, 'nikos', 'zigo');
        a1 = new Absences(s1.studentId, s1, 0, 0, 0, 0, 0, 0, 0);
        
        DbFuncs = {
            saveNewAbsences: function(a,s,f) {
                s();
            },
            updateAbsences: function(a,s,f) {
                s();
            },
            deleteAbsences: function(a,s,f) {
                s();
            },
            loadStudentAbsencesForDate: function (student, forDate, successCallback) {
                successCallback(a1);
            }
        };
        $ = function() {};
        $.mobile = { loading: function() {} };

    });
    
    describe("Absence Type Modification Tests", function () {

        it("setting 2nd hour as first absence, should set 1st hour as not absent", function () {
            a1.h1 = AbsenceEnum.UNEXCUSED_FIRST;
            var svm = new StudentAbsencesForDateViewModel(d1, s1, undefined, true);

            // Set second absence as first hour 
            svm.absences[1](AbsenceEnum.UNEXCUSED_FIRST);

            expect(svm.absences[0]()).toEqual(0);
            expect(svm.absences[1]()).toEqual(AbsenceEnum.UNEXCUSED_FIRST);
        });

        it("setting 2nd hour as EXPELLED_DAILY should set 3..7th hours as EXPELLED_DAILY, too", function () {
            a1.h3 = AbsenceEnum.UNEXCUSED_MIDDLE;
            a1.h6 = AbsenceEnum.UNEXCUSED_MIDDLE;
            var svm = new StudentAbsencesForDateViewModel(d1, s1, undefined, true);

            // Set second absence as daily expulsion
            svm.absences[1](AbsenceEnum.EXPELLED_DAILY);

            for (var i = 1; i < 7; i++)
                expect(svm.absences[i]()).toEqual(AbsenceEnum.EXPELLED_DAILY);
        });

    });

    describe("Save Absences to Db Tests", function () {

        it("should update absencesOriginal variable after successful DbFuncs.saveNewAbsences()", function () {
            var svm = new StudentAbsencesForDateViewModel(d1, s1, undefined, true);

            var o = svm.getOriginal();
            expect(o.h1).toEqual(AbsenceEnum.NOT_ABSENT);

            self.absences[0](AbsenceEnum.UNEXCUSED_FIRST);

            svm.save();

            o = svm.getOriginal();
            expect(o.h1).toEqual(AbsenceEnum.UNEXCUSED_FIRST);
        });

    });
    
    describe("Absences State Tests", function () {

        it("Absences should be unmodified", function () {
            a1.h1 = AbsenceEnum.UNEXCUSED_FIRST;
            var svm = new StudentAbsencesForDateViewModel(d1, s1, undefined, true);
            expect(svm.isNewEntity()).toBe(false);
            expect(svm.isDeletedEntity()).toBe(false);
            expect(svm.isModifiedEntity()).toBe(false);
        });

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
