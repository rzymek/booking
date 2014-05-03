var div;
Deps.autorun(function() {
    if (!Session.equals('month.view.ready', true))
        return;
    if (!div)
        div = byId('hour_view');
    if (!Session.get('selectedDay'))
        return;
    var date = moment($('#dayCal').fullCalendar('getDate'));

    var start = Session.get('visibleHours.start');
    var height = Session.get('visibleHours.height');

    var minuteOfDay = (start * SLOT_MIN) - (workingHours.dayStart * 60);
    var heightInMinutes = height * SLOT_MIN;

    var cell = q1("td.fc-day[data-date='" + date.format('YYYY-MM-DD') + "']");
    div.style.width = $(cell).width() + 'px';
    div.style.height = $(cell).height() * heightInMinutes / ((workingHours.dayEnd - workingHours.dayStart) * 60) + 'px';
    div.style.top = $(cell).height() * minuteOfDay / ((workingHours.dayEnd - workingHours.dayStart) * 60) + 'px';
    cell.appendChild(div);
});