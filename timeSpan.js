/* timeSpan will construct an object with properties and
 * methods for calculating time differences.
 *
 * Input parameters can be of type number or string, 
 * where numbers will be added to the time span starting
 * at hours:
 * 
 * example:
 * timeSpan(0,2,0) is the same as timeSpan(0,2) which will
 * create a timeSpan object with 2 minutes.
 *
 * Input of a string can be in two overloads:
 * Type 1 is timeSpan('12:30:00') is the same as timeSpan('12:30')
 * which will return a timeSpan of 12 hours 30 minutes.
 * Type 2 is timeSpan('12:30','HH:mm') which can be used to specify 
 * the format. This is most useful if not starting at hours.
 * example:
 * timeSpan('02:00','mm:ss') creates a timeSpan of two minutes.
 *
 * @author alex-irvine@hotmail.com
 */
function timeSpan(hours, minutes, seconds) {
    // allow simple string parse HH:mm:ss
    // allow format for string as overload
    hours = typeof hours !== 'undefined' ? hours : 0;
    minutes = typeof minutes !== 'undefined' ? minutes : 0;
    seconds = typeof seconds !== 'undefined' ? seconds : 0;
    if (isNaN(seconds)) {
        console.log('input not in specified format ' +
                    'please use timeSpan(HH,mm,ss) or specify ' +
                    'a format string as timeSpan(\'12:30\',\'HH:mm\')');
        return;
    }
    if (typeof hours == 'string' && typeof minutes == 'string') {
        // parse
        if (!isNaN(hours) && !isNaN(minutes)) {
            // is a string representation of a number
            hours = Number(hours);
            minutes = Number(minutes);
        }
        else {
            // is a time and format
            var timeArr = hours.split(':');
            var formatArr = minutes.split(':');
            // check format matches input
            if (timeArr.length != formatArr.length) {
                console.log('Format string must match input string');
                return;
            }
            // reset variables ready for load
            hours = minutes = seconds = 0;
            // loop and load variables
            for (var i = 0; i < timeArr.length; i++) {
                switch (formatArr[i]) {
                    case 'HH':
                        hours = Number(timeArr[i]);
                        break;
                    case 'mm':
                        minutes = Number(timeArr[i]);
                        break;
                    case 'ss':
                        seconds = Number(timeArr[i]);
                        break;
                    default:
                        console.log('format string is not supported please use:' +
                                    'HH for hours, mm for minutes and ss for seconds');
                }
            }
        }
    }
    else if (typeof hours == 'string') {
        if (!isNaN(hours)) {
            // string rep of hours
            hours = Number(hours);
        }
        else {
            // default format starts at hours
            var timeArr = hours.split(':');
            switch (timeArr.length) {
                case 1:
                    hours = Number(timeArr[0]);
                    break;
                case 2:
                    hours = Number(timeArr[0]);
                    minutes = Number(timeArr[1]);
                    break;
                case 3:
                    hours = Number(timeArr[0]);
                    minutes = Number(timeArr[1]);
                    seconds = Number(timeArr[2]);
                    break;
                default:
                    console.log('the input does not match the default format of HH:mm:ss');
            }
        }
    }
    // cleanup
    if (isNaN(hours)) {
        hours = 0;
    }
    if (isNaN(minutes)) {
        minutes = 0;
    }
    if (isNaN(seconds)) {
        seconds = 0;
    }
    while (seconds >= 60) {
        minutes++;
        seconds -= 60;
    }
    while (minutes >= 60) {
        hours++;
        minutes -= 60;
    }

    this.Hours = hours;
    this.Minutes = minutes;
    this.Seconds = seconds;

    return this;
}
timeSpan.prototype.constructor = timeSpan;
timeSpan.prototype.Add = function (addHours, addMinutes, addSeconds) {
    // validate
    if (isNaN(addHours) || isNaN(addMinutes) || isNaN(addSeconds)) {
        console.log('please input hours,minutes,seconds to add');
        return;
    }

    this.Seconds += addSeconds;
    while (this.Seconds >= 60) {
        this.Minutes++;
        this.Seconds -= 60;
    }

    this.Minutes += addMinutes;
    while (this.Minutes >= 60) {
        this.Hours++;
        this.Minutes -= 60;
    }

    this.Hours += addHours;
    return this;
};
timeSpan.prototype.AddHours = function (addHours) {
    // validate
    if (isNaN(addHours)) {
        console.log('input a number representation of hours to add');
        return;
    }
    this.Hours += addHours;
    return this;
};
timeSpan.prototype.AddMinutes = function (addMinutes) {
    // validate
    if (isNaN(addMinutes)) {
        console.log('input a number representation of minutes to add');
        return;
    }
    this.Minutes += addMinutes;
    while (this.Minutes >= 60) {
        this.Hours++;
        this.Minutes -= 60;
    }
    return this;
};
timeSpan.prototype.AddSeconds = function (addSeconds) {
    // validate
    if (isNaN(addSeconds)) {
        console.log('input a number representation of seconds to add');
        return;
    }
    this.Seconds += addSeconds;
    while (this.Seconds >= 60) {
        this.Minutes++;
        this.Seconds -= 60;
        if (this.Minutes >= 60) {
            this.Hours++;
            this.Minutes -= 60;
        }
    }
    return this;
};
timeSpan.prototype.AddTimeSpan = function (addTimeSpan) {
    this.Seconds += addTimeSpan.Seconds;
    if (this.Seconds >= 60) {
        this.Minutes++;
        this.Seconds -= 60;
        if (this.Minutes >= 60) {
            this.Hours++;
            this.Minutes -= 60;
        }
    }
    this.Minutes += addTimeSpan.Minutes;
    if (this.Minutes >= 60) {
        this.Hours++;
        this.Minutes -= 60;
    }
    this.Hours += addTimeSpan.Hours;
    return this;
};
timeSpan.prototype.SubtractTimeSpan = function (subTimeSpan) {
    this.Seconds -= subTimeSpan.Seconds;
    if (this.Seconds < 0) {
        this.Minutes--;
        this.Seconds = 60 + this.Seconds;
        if (this.Minutes < 0) {
            this.Hours--;
            this.Minutes = 60 + this.Minutes;
        }
    }
    this.Minutes -= subTimeSpan.Minutes;
    if (this.Minutes < 0) {
        this.Hours--;
        this.Minutes = 0 + this.Minutes;
    }
    this.Hours -= subTimeSpan.Hours;
    return this;
};
timeSpan.prototype.MultiplyTimeSpan = function (times) {
    for (var i = 0; i < times; i++) {
        this.AddTimeSpan(this);
    }
    return this;
};
timeSpan.prototype.Difference = function (otherTimeSpan) {
    var hrs;
    var mins;
    var secs;
    secs = this.Seconds - otherTimeSpan.Seconds;
    mins = this.Minutes - otherTimeSpan.Minutes;
    hrs = this.Hours - otherTimeSpan.Hours;
    if (secs < 0) {
        mins--;
        secs = 60 + secs;
    }
    if (mins < 0) {
        hrs--;
        mins = 60 + mins;
    }
    return new timeSpan(Math.abs(hrs),
                        Math.abs(mins),
                        Math.abs(secs))
};
timeSpan.prototype.Equals = function (anotherTimeSpan) {
    return this.Hours == anotherTimeSpan.Hours &&
           this.Minutes == anotherTimeSpan.Minutes &&
           this.Seconds == anotherTimeSpan.Seconds;
};
timeSpan.prototype.IsGreaterThan = function (anotherTimeSpan) {
    return this.Hours > anotherTimeSpan.Hours ||
          (this.Hours >= anotherTimeSpan.Hours &&
           this.Minutes > anotherTimeSpan.Minutes) ||
          (this.Hours >= anotherTimeSpan.Hours &&
           this.Minutes >= anotherTimeSpan.Minutes &&
           this.Seconds > anotherTimeSpan.Seconds);
};
timeSpan.prototype.IsLessThan = function (anotherTimeSpan) {
    return this.Hours < anotherTimeSpan.Hours ||
          (this.Hours <= anotherTimeSpan.Hours &&
           this.Minutes < anotherTimeSpan.Minutes) ||
          (this.Hours <= anotherTimeSpan.Hours &&
           this.Minutes <= anotherTimeSpan.Minutes &&
           this.Seconds < anotherTimeSpan.Seconds);
};
timeSpan.prototype.Clone = function () {
    return new timeSpan(this.Hours, this.Minutes, this.Seconds);
}
timeSpan.prototype.ToString = function (format) {
    if (!format) {
        var returnString = '';
        if (this.Hours < 10) {
            returnString += '0' + String(this.Hours) + ':';
        }
        else {
            returnString += String(this.Hours) + ':';
        }
        if (this.Minutes < 10) {
            returnString += '0' + String(this.Minutes) + ':';
        }
        else {
            returnString += String(this.Minutes) + ':';
        }
        if (this.Seconds < 10) {
            returnString += '0' + String(this.Seconds);
        }
        else {
            returnString += String(this.Seconds);
        }
        return returnString;
    }
    try {
        var formArr = format.split(':');
        var returnString = '';
        for (var i = 0; i < formArr.length; i++) {
            switch (formArr[i]) {
                case 'HH':
                    if (i == formArr.length - 1) {
                        if (this.Hours < 10) {
                            returnString += '0' + String(this.Hours);
                        }
                        else {
                            returnString += String(this.Hours);
                        }
                    }
                    else {
                        if (this.Hours < 10) {
                            returnString += '0' + String(this.Hours) + ':';
                        }
                        else {
                            returnString += String(this.Hours) + ':';
                        }
                    }
                    break;
                case 'mm':
                    if (i == formArr.length - 1) {
                        if (this.Minutes < 10) {
                            returnString += '0' + String(this.Minutes);
                        }
                        else {
                            returnString += String(this.Minutes);
                        }
                    }
                    else {
                        if (this.Minutes < 10) {
                            returnString += '0' + String(this.Minutes) + ':';
                        }
                        else {
                            returnString += String(this.Minutes) + ':';
                        }
                    }
                    break;
                case 'ss':
                    if (i == formArr.length - 1) {
                        if (this.Seconds < 10) {
                            returnString += '0' + String(this.Seconds);
                        }
                        else {
                            returnString += String(this.Seconds);
                        }
                    }
                    else {
                        if (this.Seconds < 10) {
                            returnString += '0' + String(this.Seconds) + ':';
                        }
                        else {
                            returnString += String(this.Seconds) + ':';
                        }
                    }
                    break;
                default:
                    console.log('format string was not recognised use HH:mm:ss');
                    return
            }
        }
        return returnString;
    }
    catch (ex) {
        console.log(ex);
    }

};
