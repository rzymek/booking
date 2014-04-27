Template.month.rendered = function() {
    var monthCal = $('#monthCal');
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
            $('#dayCal').fullCalendar('gotoDate', date);
        }
    }, FC_PL_OPTIONS));
    Session.set('height', monthCal.height());


    function mergeSlotsByDay(days, event) {
        var day = days[event.day] || [];
        day.push(event.slot);
        days[event.day] = day;
        return days;
    }
    Deps.autorun(function() {
        var visible = Session.get('visibleMonth');
        if (!visible)
            return;
        var days = Events.find({month: visible.month, year: visible.year}, {
            sort: {day: 1}
        }).fetch().reduce(mergeSlotsByDay, {});
        var date = moment(Session.get('visibleMonth'));
        _.keys(days).forEach(function(day) {
            date.date(day);
            clearDayBgCanvas();
            days[day].forEach(function(slot) {
                return drawSlot(slot);
            });
            var imgData = "url('" + getDayBGDataURL() + "')";
            var cell = $("td.fc-day[data-date='" + date.format('YYYY-MM-DD') + "']")[0];
            cell.style.backgroundImage = imgData;
        });
    });

    Deps.autorun(function() {
        var date = moment($('#dayCal').fullCalendar('getDate'));

        var days = Events.find({month: date.month(), year: date.year(), day: date.date()})
                .fetch().reduce(mergeSlotsByDay, {});

        var slots = _.chain(days).values().first().value();
        if (slots) {
            clearDayBgCanvas();
            slots.forEach(function(slot) {
                return drawSlot(slot);
            });
        }

        var start = Session.get('visibleHours.start');
        var height = Session.get('visibleHours.height');

        var minuteOfDay = start * SLOT_MIN;
        var heightInMinutes = height * SLOT_MIN;
        var ctx = getDayBgCtx();
        ctx.fillStyle = 'rgba(0,0,250,0.5)';
        ctx.fillRect(0,
                (minuteOfDay / 60.0 - workingHours.dayStart)*100,
                canvas.width,
                (heightInMinutes / 60)*100
        );
          

        var imgData = "url('" + getDayBGDataURL() + "')";
        var cell = $("td.fc-day[data-date='" + date.format('YYYY-MM-DD') + "']")[0];
        cell.style.backgroundImage = imgData;
    });
};

Template.month.destroyed = function() {
    Session.set('visibleMonth', null);
};
