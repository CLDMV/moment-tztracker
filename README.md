# moment-tztracker

## Example Usage/Defaults
```javascript
$('#businessHours').tzTrack({
	autoupdate: false,
	autoTimeout: 60000,
	tz: "America/Phoenix",
	displayTZ: "America/Los_Angeles",
	displayFormat: "h:mm A",
	displayZFormat: "z",
	displayString: 'Hours: M-F %s-%s %s (<span class="%s">%s</span>)',
	days: [1,2,3,4,5],
	hours: {
		start: "07:00",
		end: "15:00",
	}
});
```

## Purpose
The purpose of this plugin is to display the business hours relevent to the end user. It also includes the ability to auto update the html of the element attached to.

## Each option explained
### autoupdate
###### default: false
When this option is set to true a timer is ran every x milliseconds to update the html of the element. x is defined as the autoTimeout option.
### autoTimeout
###### default: 60000
Time in milliseconds to run the timer for updating HTML of the element.
#### Caveats
> One caveat of this is you can set the autoupdate to true or false during run time by calling
> ```javascript
> $('#businessHours').tzTrack("update","set",false);
> ```
> or
> ```javascript
> $('#businessHours').tzTrack("update","set",true);
> ```
> If you set it to false during run time it may run once more but will not do anything. If the autoupdate is turned on during run time you will need to call
> ```javascript
> $('#businessHours').tzTrack("update","auto");
> ```
> to re-initialize the timer.
> ```javascript
> $('#businessHours').tzTrack("getstring");
> ```
> Can be used to get the formatted string to manually modify and update at any point in time.
### tz
###### default: America/Phoenix
This setting controls the control time zone. The open days/times are based upon this setting. Valid values are listed [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
### displayTZ
###### default: "America/Los_Angeles
This setting controls the display time zone. It will only effect the class (argument 4 and 5 of the displayString option). Valid values are listed [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
### displayFormat
###### default: "h:mm A"
This setting determines the display format of the hours settings. This is argument 1 and 2 of the displayString option. The default will show "7:00 PM".
### displayZFormat
###### default: "z"
This setting determines the display format of the time zone to display. By default it will show a short format. It is also argument 3 of the displayString option. The default settings will show either PST or PDT.
### displayString
###### default: "Hours: M-F %s-%s %s (<span class="%s">%s</span>)"
| Arguement #   | Description | Controlling Option |
| ------------: |-------------| -------------------|
| 1             | Opening time display | displayFormat for the format and hours.start for the actual number |
| 2             | Closing time display | displayFormat for the format and hours.end for the actual number |
| 3             | Time zone display | displayZFormat for the format and displayTZ for the conversion of time zones |
| 4             | Class of span | Internal hard coded. Either presents as OPEN or CLOSED |
| 5             | Text of span | Internal hard coded. Either presents as OPEN or CLOSED |
### days
###### default: [1,2,3,4,5]
Days of week business is open. Valid values start at 0 (Sunday). A full week example would be [0,1,2,3,4,5,6]
### hours
###### default: { start: "07:00", end: "15:00" }
Both are 24 hour format. Standard HOUR:MIN format. Should be with leading zeros.
