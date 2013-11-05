var workingHours = {
  mon: [],
  tue: [8, 16],
  wed: [8,19],
  fri: [9, 17]
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
Template.month.rendered = function () {
  var cal = $('#monthCal');
  cal.fullCalendar($.extend({
    windowResize: function (view) {
      Session.set('height', cal.height());
    },
    dayClick: function () {
      console.log(this);
    }
  }, localOptions));
  Session.set('height', cal.height());
};

var canvas = document.createElement('canvas');
function hoursToDataURL(arr) {
  if(arr == null || arr.length == 0)
    return 'none';
  var ctx = canvas.getContext('2d');
  canvas.width = 10;
  canvas.height = 24;
  ctx.fillStyle = 'rgba(100,255,100,0.5)';
  ctx.fillRect(0, arr[0], canvas.width, arr[1]-arr[0]);
  return "url('"+canvas.toDataURL()+"')";  
}

function showWorkingHours() {
  console.log('showWorkingHours');
  // $('.fc-day[data-date="2013-11-21"]').css('background-image', "url('"+data+"')"); 
  var styles = document.head.getElementsByTagName('style');
  var css = styles[styles.length - 1];
  
  var s='';
  for(var key in workingHours) {
    console.log(key);
    var data = hoursToDataURL(workingHours[key]);
    s+='#monthCal .fc-'+key+" { background-image: "+data+" }\n";
  }
  css.textContent = s;
}

Template.day.rendered = function () {
  var cal = $('#dayCal');
  cal.fullCalendar($.extend({
    columnFormat: {
      day: 'dddd d.MM'
    },
    allDaySlot: false,
    header: {
      left: '',
      center: '',
      right: ''
    },
    axisFormat: 'H:mm',
    defaultView: 'agendaDay'
  }, localOptions));
  
  Deps.autorun(function () {
    cal.fullCalendar('option', 'contentHeight', Session.get('height'));
  });
  
  Deps.autorun(showWorkingHours);
};