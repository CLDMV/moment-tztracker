/***********************************************
	moment-tztracker.js
	version : 1.0.1
	Copyright (c) Catalyzed Motivation Inc
	license : GUN GPLv3
***********************************************/

;(function ( $, window, document, undefined ) {

	// Create the defaults once
	var pluginName = 'tzTrack'
		self = false,
		defaults = {
			autoupdate:		false,
			autoTimeout:	60000,
			tz:				"America/Phoenix",
			displayTZ:		"America/Los_Angeles",
			displayFormat:	"h:mm A",
			displayZFormat:	"z",
			displayString:	'Hours: M-F %s-%s %s (<span class="%s">%s</span>)',
			days:			[1,2,3,4,5],
			hours: {
				start: "07:00",
				end: "15:00",
			}
		};

	function sprintf() {
	    var args = arguments,
	    string = args[0],
	    i = 1;
	    return string.replace(/%((%)|s|d)/g, function (m) {
	        // m is the matched format, e.g. %s, %d
	        var val = null;
	        if (m[2]) {
	            val = m[2];
	        } else {
	            val = args[i];
	            // A switch statement so that the formatter can be extended. Default is %s
	            switch (m) {
	                case '%d':
	                    val = parseFloat(val);
	                    if (isNaN(val)) {
	                        val = 0;
	                    }
	                    break;
	            }
	            i++;
	        }
	        return val;
	    });
	}

	function tzTrack( element, options ) {
		if (typeof window.moment === "undefined") {
			self.console.error('moment.js is required for this plugin. Please install from https://momentjs.com/');
			return false;
		}
		this.element = element;

		this.options = $.extend( {}, defaults, options);

		this.data = {
			parsed: {
				start:	"",
				end:	"",
				abr:	"",
				class:	"CLOSED",
			}
		};

		this._defaults = defaults;
		this._name = pluginName;
		self = this;

		self.init();
		return this;
	};

	tzTrack.prototype.setup = {
		parse: function () {
			self.data.userTZ = moment.tz.guess();
			var displayZone = moment.tz(self.data.userTZ);
			displayZone.tz(self.options.displayTZ);

			var startTime = self.parse.timeDisplay(self.options.displayTZ, self.options.hours.start);
			self.data.parsed.start = startTime.format(self.options.displayFormat);

			var endTime = self.parse.timeDisplay(self.options.displayTZ, self.options.hours.end);
			self.data.parsed.end = endTime.format(self.options.displayFormat);
			self.data.parsed.abr = endTime.format(self.options.displayZFormat);
		}
	};

	tzTrack.prototype.parse = {
		timeToMins: function (offset) {
			var s = offset.split(':');
			var h = parseInt(s[0],10);
			var m = parseInt(s[1],10);
			h = h * 60;
			return (h + m);
		},
		timeDisplay: function (tz, target) {
			var t = self.parse.timeToMins(target);
			var h = Math.floor(t / 60);
			var m = t - (h * 60);

			var dObject = {
				hour:	h,
				minute:	m
			};
			return moment(dObject).tz(tz);
		},
		getFormattedString: function () {
			var m = moment.tz(self.data.userTZ);
			m.tz(self.options.tz);
			var dayOfWeek = parseInt(m.format("e"),10);
			if (self.options.days.indexOf(dayOfWeek) !== -1) {
				var currentHourMin = m.format(moment.HTML5_FMT.TIME);
				currentHourMin = self.parse.timeToMins(currentHourMin);
				var start = self.parse.timeToMins(self.options.hours.start);
				var end = self.parse.timeToMins(self.options.hours.end);

				if (currentHourMin > start) {
					if (currentHourMin < end) {
						self.data.parsed.class = "OPEN";
					}
				}
			}
			// displayString:	'Hours: M-F %s-%s %s (<span class="%s">%s</span>)',
			return sprintf(self.options.displayString, self.data.parsed.start, self.data.parsed.end, self.data.parsed.abr, self.data.parsed.class, self.data.parsed.class);
		}
	};

	tzTrack.prototype.update = {
		auto: function () {
			if (self.options.autoupdate) {
				var formattedString = self.parse.getFormattedString();
				$(self.element).html(formattedString);
				setTimeout(function() {
					self.update.auto();
				}, self.options.autoTimeout | 60000);
			}
		},
		set: function (trueOrFalse) {
			self.options.autoupdate = trueOrFalse;
			self.update.auto();
		}
	};

	tzTrack.prototype.init = function () {
		self.setup.parse();
		self.update.auto();
	};

	tzTrack.prototype.console = {
		log: function (message) {
			if(typeof console!="undefined"&&console.log)
				console.log.apply(console,arguments);
		},
		warn: function (message) {
			if(typeof console!="undefined"&&console.warn)
				console.warn.apply(console,arguments);
		},
		error: function (msg,data) {
			var e=new Error(msg);
			e.data=data;
			if(typeof console=="object"&&console.error)
				console.error(e);
			setTimeout(function(){
				throw e;
			});
		}
	};

    tzTrack.prototype.processOptions = function (optionsMethod, arg1, arg2) {
		// self.console.log("typeof optionsmethod ["+optionsMethod+"]:"+typeof(optionsmethod));
		// For some reason when sending a string it comes back as typeof undefined o.O?
		if (typeof optionsmethod == "string" || typeof optionsmethod == "undefined") {
			switch(optionsMethod) {
				case "update":
					switch(arg1) {
						case "set":
							self.update.set(arg2);
							return true;
							break;
						case "auto":
							self.update.auto();
							return true;
							break;
					}
					return false;
					break;
				case "getstring":
					return self.update.getFormattedString();
					break;
				default:
					self.console.warn("Unknown command: "+optionsmethod);
					return false;
					break;
			}
		} else {
			// process new option changes

		}
    };

	$.fn[pluginName] = function ( optionsMethod, arg1, arg2 ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				var ltzTrack = new tzTrack( this, optionsMethod );
				if (ltzTrack) {
					$.data(this, 'plugin_' + pluginName, ltzTrack);
				}
				return ltzTrack;
            } else {
				if (typeof optionsMethod != "string") {
					var tzTracker = $.data(this, 'plugin_' + pluginName);
					tzTracker.processOptions('update', 'set', false);

					var ltzTrack = new tzTrack( this, optionsMethod );
					if (ltzTrack) {
						$.data(this, 'plugin_' + pluginName, ltzTrack);
					}
					return ltzTrack;
				} else {
					var tzTracker = $.data(this, 'plugin_' + pluginName);
					return tzTracker.processOptions(optionsMethod, arg1, arg2);
				}
			}
		});
	}

})( $, window, document );
