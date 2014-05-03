Session.set('month.view.ready', false);
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
            Session.set('selectedDay', date);
            $('#dayCal').fullCalendar('gotoDate', date);
        }
    }, FC_PL_OPTIONS));
    Session.set('height', monthCal.height());


    mergeSlotsByDay = function (days, event) {
        var day = days[event.day] || [];
        day.push(event.slot);
        days[event.day] = day;
        return days;
    };
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
    Session.set('month.view.ready', true);
};

Template.month.destroyed = function() {
    Session.set('visibleMonth', null);
};
