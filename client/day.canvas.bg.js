Meteor.startup(function() {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = workingHours.dayEnd - workingHours.dayStart;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(250,0,0,0.5)';
    
    drawSlot = function(slot, date) {
        var minuteOfDay = slot * SLOT_MIN;
        ctx.fillRect(0,
                (minuteOfDay) / 60.0 - workingHours.dayStart,
                canvas.width,
                SLOT_MIN / 60.0);
    };
    
    getDayBGDataURL = function() {
        return canvas.toDataURL();
    };
    
    clearDayBgCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
});