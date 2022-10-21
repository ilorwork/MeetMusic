const timeAgo = (time) => {
    time = Number(time)
    switch (typeof time) {
        case "number":
            break;
        case "string":
            time = +new Date(time);
            break;
        case "object":
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    let time_formats = [
        [60, "seconds", 1], // 60
        [120, "a minute ago", "in a minute"], // 60*2
        [3600, "minutes", 60], // 60*60, 60
        [7200, "an hour ago", "in an hour"], // 60*60*2
        [86400, "hours", 3600], // 60*60*24, 60*60
        [172800, "yesterday", "tomorrow"], // 60*60*24*2
        [604800, "days", 86400], // 60*60*24*7, 60*60*24
        [1209600, "a week ago", "next week"], // 60*60*24*7*4*2
        [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, "a month ago", "next month"], // 60*60*24*7*4*2
        [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, "a year ago", "next year"], // 60*60*24*7*4*12*2
        [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, "last century", "next century"], // 60*60*24*7*4*12*100*2
        [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
        token = "before",
        list_choice = 1;

    if (Math.floor(seconds) === 0) {
        return "at this moment";
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = "while";
        list_choice = 2;
    }
    let i = 0,
        format;
    while ((format = time_formats[i++]))
        if (seconds < format[0]) {
            if (typeof format[2] == "string") return format[list_choice];
            else {
                return token + " " + Math.floor(seconds / format[2]) + " " + format[1];
            }
        }
    return time;
};

module.exports = timeAgo;