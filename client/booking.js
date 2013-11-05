var workingHours = {
  mon: [7, 15],
  tue: [8, 16],
  wed: [8, 19], 
  thu: [9, 18],
  fri: [9, 17],
  dayStart: 6,
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
  if (arr == null || arr.length == 0)  
    return 'none';
  var ctx = canvas.getContext('2d');   
  canvas.width = 10;       
  canvas.height = workingHours.dayEnd - workingHours.dayStart;
  ctx.fillStyle = 'rgba(100,255,100,0.5)';
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