Template.day.rendered = function() {
    var dayCal = $('#dayCal');
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
        dayClick: function(date) {
            Meteor.call('addEvent', date);
        },
        editable: false,
        axisFormat: 'H:mm',
        defaultView: 'agendaDay',
        selectable: false,
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
        }
    }, FC_PL_OPTIONS));

    var slotHeight = dayCal.find('.fc-slot0').outerHeight();
    dayCal.find('div').filter(function() {
        return $(this).css('overflow-y') == 'auto';
    }).scroll(function() {
        var top = this.scrollTop;
        var startSlot = Math.ceil(top / slotHeight);
        Session.set('visibleHours.start', startSlot);
    });

    Deps.autorun(function() {
        dayCal.fullCalendar('option', 'contentHeight', Session.get('height'));
        var visibleSlots = Math.ceil(dayCal.height() / slotHeight);
        Session.set('visibleHours.height', visibleSlots);
    });

    Meteor.subscribe("events");
    Deps.autorun(function() {
        Events.find();
        $('#dayCal').fullCalendar('refetchEvents');
    });
};