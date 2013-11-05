Meteor.publish("events", function() {
    return Events.find();
});

Meteor.methods({
    addEvent: function(start) {
        Events.insert({
            user: this.userId,
            start: start
        });        
    },
    reset: function() {
        Events.remove({});
    }
});

//Events.deny({
//    insert: function(userId, event) {
//        event.user = userId;
//        return true;
//    }
//});