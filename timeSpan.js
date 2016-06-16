﻿/* timeSpan will construct an object with properties and
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
 */
var timeSpan = function timeSpan(hours, minutes, seconds) {
    // allow simple string parse HH:mm:ss
    // allow format for string as overload
    hours = typeof hours !== 'undefined' ? hours : 0;
    minutes = typeof minutes !== 'undefined' ? minutes : 0;
    seconds = typeof seconds !== 'undefined' ? seconds : 0;
    //if (typeof hours == 'string' && typeof minutes == 'string')
    //{
    //    // parse
    //    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds))
    //    {
    //        // is a string representation of a number
    //        hours = Number(hours);
    //        minutes = Number(minutes);
    //        seconds = Number(seconds);
    //    }
    //}
    if (isNaN(seconds))
    {
        console.log('input not in specified format ' +
                    'please use timeSpan(HH,mm,ss) or specify ' +
                    'a format string as timeSpan(\'12:30\',\'HH:mm\')');
        return;
    }
    if (typeof hours == 'string' && typeof minutes == 'string')
    {
        // parse
        if(!isNaN(hours) && !isNaN(minutes))
        {
            // is a string representation of a number
            hours = Number(hours);
            minutes = Number(minutes);
        }
        else
        {
            // is a time and format
            var timeArr = hours.split(':');
            var formatArr = minutes.split(':');
            // check format matches input
            if(timeArr.length != formatArr.length)
            {
                console.log('Format string must match input string');
                return;
            }
            // reset variables ready for load
            hours = minutes = seconds = 0;
            // loop and load variables
            for(var i=0;i<timeArr.length;i++)
            {
                switch (formatArr[i])
                {
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
    else if (typeof hours == 'string')
    {
        if(!isNaN(hours))
        {
            // string rep of hours
            hours = Number(hours);
        }
        else
        {
            // default format starts at hours
            var timeArr = hours.split(':');
            switch (timeArr.length)
            {
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
    if (isNaN(hours))
    {
        hours = 0;
    }
    if (isNaN(minutes))
    {
        minutes = 0;
    }
    if (isNaN(seconds))
    {
        seconds = 0;
    }

    this.Hours = hours;
    this.Minutes = minutes;
    this.Seconds = seconds;
    this.Add = function(addHours, addMinutes, addSeconds) {
        // validate
        if (isNaN(addHours) || isNaN(addMinutes) || isNaN(addSeconds))
        {
            console.log('please input hours,minutes,seconds to add');
            return;
        }
            
        this.Seconds += addSeconds;
        if(this.Seconds >= 60)
        {
            this.Minutes++;
            this.Seconds -= 60;
        }

        this.Minutes += addMinutes;
        if(this.Minutes >= 60)
        {
            this.Hours++;
            this.Minutes -= 60;
        }

        this.Hours += addHours;
        return this;
    };
    this.AddHours = function(addHours) {
        // validate
        if (isNaN(addHours))
        {
            console.log('input a number representation of hours to add');
            return;
        }
        this.Hours += addHours;
        return this;
    };
    this.AddMinutes = function(addMinutes) {
        // validate
        if (isNaN(addMinutes)) {
            console.log('input a number representation of minutes to add');
            return;
        }
        this.Minutes += addMinutes;
        if(this.Minutes >= 60)
        {
            this.Hours++;
            this.Minutes -= 60;
        }
        return this;
    };
    this.AddSeconds = function(addSeconds) {
        // validate
        if (isNaN(addSeconds)) {
            console.log('input a number representation of seconds to add');
            return;
        }
        this.Seconds += addSeconds;
        if(this.Seconds >= 60)
        {
            this.Minutes++;
            this.Seconds -= 60;
            if(this.Minutes >= 60)
            {
                this.Hours++;
                this.Minutes -= 60;
            }
        }
        return this;
    };
    this.AddTimeSpan = function(addTimeSpan) {
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
    this.Equals = function(anotherTimeSpan) {
        return this.Hours == anotherTimeSpan.Hours &&
               this.Minutes == anotherTimeSpan.Minutes &&
               this.Seconds == anotherTimeSpan.Seconds;
    };
    this.IsGreaterThan = function(anotherTimeSpan) {
        return this.Hours > anotherTimeSpan.Hours ||
              (this.Hours >= anotherTimeSpan.Hours &&
               this.Minutes > anotherTimeSpan.Minutes) ||
              (this.Hours >= anotherTimeSpan.Hours &&
               this.Minutes >= anotherTimeSpan.Minutes &&
               this.Seconds > anotherTimeSpan.Seconds);
    };
    this.IsLessThan = function (anotherTimeSpan) {
        return this.Hours < anotherTimeSpan.Hours ||
              (this.Hours <= anotherTimeSpan.Hours &&
               this.Minutes < anotherTimeSpan.Minutes) ||
              (this.Hours <= anotherTimeSpan.Hours &&
               this.Minutes <= anotherTimeSpan.Minutes &&
               this.Seconds < anotherTimeSpan.Seconds);
    };
}