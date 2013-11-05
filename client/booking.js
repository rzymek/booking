var workingHours = {
  mon: [],
  tue: [8,16],
  wed: [8,10],
  wed: [12,18],
  fri: ['8:15',17]
}

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
}
Template.month.rendered = function () {

    var cal = $('#monthCal');
    cal.fullCalendar($.extend({
        windowResize: function(view) {
          Session.set('height', cal.height())
        },
        dayClick: function () {
            console.log(this);
        }        
    }, localOptions));
    Session.set('height', cal.height())
}

function getDynamicStyleSheet() {
  var sheets = document.styleSheets;
  for(var i=0;i<sheets.length;i++) {
    if(sheets[i].title === 'dynamic') {
      return sheets[i];
    }
  }
}

function showWorkingHours() {
      console.log('showWorkingHours');
      var c = document.createElement('canvas');
      var ctx = c.getContext('2d');
      c.width = 10;
      c.height = 24;
      ctx.fillStyle = 'rgba(100,255,100,0.5)'  ;
      ctx.fillRect(0, 8, c.width, 23-8);
      var data = c.toDataURL();
      // $('.fc-day[data-date="2013-11-21"]').css('background-image', "url('"+data+"')"); 
      css = getDynamicStyleSheet();
      while(css.rules.length > 0) {
        css.removeRule(0);
      }
      css.insertRule(".fc-wed { background-image: url('"+data+"') }",0);
}

Template.day.rendered = function () {
    var cal = $('#dayCal');
    cal.fullCalendar($.extend({
        columnFormat: { day: 'dddd d.MM' },
        allDaySlot:false,
        header:{left:'', center:'', right:''},
        axisFormat: 'H:mm',
        defaultView: 'agendaDay'
    }, localOptions));

    Deps.autorun(function(){
        cal.fullCalendar('option','contentHeight', Session.get('height'));
    });

    Deps.autorun(showWorkingHours);
}