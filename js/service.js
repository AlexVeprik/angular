/**
 * Created by sergey on 10.01.15.
 */
basicApp.service('userAuthenticationModel', function () {
    this.userName = null;
    this.token = null;
    this.tokenExpiry = null;

    this.reset = function () {
        this.userName = null;
        this.token = null;
        this.tokenExpiry = null;
    };

    this.isValid = function () {
        return this.userName && this.token && this.tokenExpiry && this.tokenExpiry * 1000 > Date.now();
    };

    this.apply = function (anotherModel) {
        if (anotherModel) {
            angular.extend(this, anotherModel);
        }
    };
})
    /*.service('user', function () {
     this.id = null;
     this.userName = null;
     this.birthday = new Date(Date.now());
     })*/;

basicApp.service('helperService', ['$locale', function ($locale) {
    this.monthNames = $locale.DATETIME_FORMATS.MONTH ;

    this.isNullOrWhitespace = function (input) {
        if (input == null) return true;
        return input.replace(/\s/g, '').length < 1;
    };

    this.range = function (start, end) {
        var foo = [];
        for (var i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    };

    this.getCurrentAge = function(date) {
        return ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
    };

    this.isMinor = function(date) {
        return this.getCurrentAge(date) <= 16;
    };

    this.validateDate = function(y, m, d) {
        var selDate = new Date(y, m, d);
        if ((selDate.getFullYear() == y) && (selDate.getMonth() == m) && (selDate.getDate() == d)) {
            return true;
        } else {
            return false;
        }
    };

    this.dateToClientTimezone = function (d) {
        var localTime = moment.utc(d).toDate();
        localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
        return localTime;
    };

    this.durationDate = function (d) {
        if (d == null) {
            return null;
        }

        return moment.utc(d).fromNow();
    }

}]);
