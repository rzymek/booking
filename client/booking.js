var workingHours = {
    mon: [7, 15],
    tue: [8, 16],
    wed: [8, 19],
    thu: [9, 18],
    fri: [9, 17],
    dayStart: 7,
    dayEnd: 20
};

var localOptions = {
    buttonText: {
        today: 'Dzisiaj',
        month: 'Miesiąc',
        day: 'Dzień',
        week: 'Tydzień'
    },
    monthNames: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
    monthNamesShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
    dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
    dayNamesShort: ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'],
    firstDay: 1
};
var monthCal = undefined;
var dayCal = undefined;
Template.month.destroyed = function() {
    Session.set('visibleMonth', null);
};
Template.month.rendered = function() {
    monthCal = $('#monthCal');
    monthCal.fullCalendar($.extend({
        windowResize: function(view) {
            Session.set('height', monthCal.height());
        },
        viewRender: function(view) {
            with (moment(view.start)) {
                Session.set('visibleMonth', {
                    month: month(),
                    year: year()
                });
            }
        },
        dayClick: function(date) {
            dayCal.fullCalendar('gotoDate', date);
        }
    }, localOptions));    
    Session.set('height', monthCal.height());
    
    Deps.autorun(function() {
        var visible = Session.get('visibleMonth');
        if (!visible)
            return;
        var days = Events.find({month: visible.month, year: visible.year}, {
            sort: {day: 1}
        }).fetch().reduce(function(days, event) {
            var day = days[event.day] || [];
            day.push(event.slot);
            days[event.day] = day;
            return days;
        }, {});
        var date = moment(Session.get('visibleMonth'));
        _.keys(days).forEach(function(day) {
            var ctx = canvas.getContext('2d');
            canvas.width = 1;
            canvas.height = workingHours.dayEnd - workingHours.dayStart;
            ctx.fillStyle = 'rgba(250,0,0,0.5)';

            days[day].forEach(function(slot) {
                var minuteOfDay = slot * SLOT_MIN;
                ctx.fillRect(0,
                        (minuteOfDay) / 60.0 - workingHours.dayStart,
                        canvas.width,
                        SLOT_MIN / 60.0);
            });
            var imgData = "url('" + canvas.toDataURL() + "')";
            date.date(day);
            var cell = $("td.fc-day[data-date='" + date.format('YYYY-MM-DD') + "']")[0];
            cell.style.backgroundImage = imgData;
        });
    });
};

var canvas = document.createElement('canvas');
function hoursToDataURL(arr) {
    if (arr === null || arr.length === 0)
        return 'none';
    var ctx = canvas.getContext('2d');
    canvas.width = 10;
    canvas.height = workingHours.dayEnd - workingHours.dayStart;
    ctx.fillStyle = 'rgba(180,180,180,0.5)';
    ctx.fillRect(0, arr[0] - workingHours.dayStart, canvas.width, arr[1] - arr[0]);
    return "url('" + canvas.toDataURL() + "')";
}

function hoursConfigToDataURL(workingHours) {
    var s = '';
    for (var key in workingHours) {
        var data = hoursToDataURL(workingHours[key]);
        s += '#monthCal .fc-' + key + " { background-image: " + data + " }\n";
    }
    return s;
}

function showWorkingHours() {
    var styles = document.head.getElementsByTagName('style');
    var css = styles[styles.length - 1];
    css.textContent = hoursConfigToDataURL(workingHours);
}

Template.day.rendered = function() {
    dayCal = $('#dayCal');
    dayCal.fullCalendar($.extend({
        columnFormat: {
            day: 'dddd d.MM'
        },
        allDaySlot: false,
        firstHour: workingHours.dayStart,
        header: {
            left: '',
            center: '',
            right: ''
        },
        editable: false,
        axisFormat: 'H:mm',
        defaultView: 'agendaDay',
        selectable: true,
        slotMinutes: SLOT_MIN,
        defaultEventMinutes: SLOT_MIN,
        events: function(start, end, callback) {
            var events = Events.find().map(function(data) {
                var minuteOfDay = data.slot * SLOT_MIN;
                var hour = minuteOfDay / 60;
                var minute = minuteOfDay % 60;
                var start = moment([data.year, data.month, data.day, hour, minute]);
                return {
                    title: '',
                    start: start.toDate(),
                    allDay: false
                };
            });
            callback(events);
        },
        select: function(start) {
            Meteor.call('addEvent', start);
            dayCal.fullCalendar('unselect');
        }
    }, localOptions));

    Deps.autorun(function() {
        dayCal.fullCalendar('option', 'contentHeight', Session.get('height'));
    });

//    Deps.autorun(showWorkingHours);
    Meteor.subscribe("events");
    Deps.autorun(function() {
        Events.find();
        $('#dayCal').fullCalendar('refetchEvents');
    });
};
function getVisibleDate(cal) {
    with (moment(cal.fullCalendar('getDate'))) {
        return {
            month: month(),
            year: year()
        };
    }
}

Meteor.startup(function() {
    Events.find().observe({
        added: function(data) {
            var minuteOfDay = data.slot * SLOT_MIN;
            var visibleDate = getVisibleDate(monthCal);
            if (!(data.year === visibleDate.year && data.month === visibleDate.month))
                return;
            var ctx = canvas.getContext('2d');
            canvas.width = 10;
            canvas.height = workingHours.dayEnd - workingHours.dayStart;
            ctx.fillStyle = 'rgba(250,0,0,0.5)';

            ctx.fillRect(0,
                    (minuteOfDay) / 60.0 - workingHours.dayStart,
                    canvas.width,
                    SLOT_MIN / 60.0);
            var imgData = "url('" + canvas.toDataURL() + "')";
            var cell = $("td.fc-day[data-date='" + moment(data).format('YYYY-MM-DD') + "']")[0];
            cell.style.backgroundImage = imgData;
        },
        removed: function(data) {
            console.log("removed", data);
        },
        changed: function(data) {
            console.log("change", data);
        }
    });
});