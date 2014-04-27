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
        dayClick: function(date){
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

    Deps.autorun(function() {
        dayCal.fullCalendar('option', 'contentHeight', Session.get('height'));
    });

    Meteor.subscribe("events");
    Deps.autorun(function() {
        Events.find();
        $('#dayCal').fullCalendar('refetchEvents');
    });
};