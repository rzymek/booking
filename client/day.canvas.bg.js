Meteor.startup(function() {
    canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = (workingHours.dayEnd - workingHours.dayStart)*100;
    var ctx = canvas.getContext('2d');
        
    drawSlot = function(slot) {
        var minuteOfDay = slot * SLOT_MIN;
        ctx.fillRect(0,
                ((minuteOfDay) / 60.0 - workingHours.dayStart)*100,
                canvas.width,
                (SLOT_MIN / 60.0)*100);
    };
    
    getDayBGDataURL = function() {
        return canvas.toDataURL();
    };
    
    clearDayBgCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(250,0,0,0.5)';
    };
    
    getDayBgCtx = function() {
        return ctx;
    }; 
    
    clearDayBgCanvas();
});