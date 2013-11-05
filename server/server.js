Meteor.publish("events", function() {
    return Events.find();
});

Meteor.methods({
    addEvent: function(timestamp) {
//        var db = MongoInternals.defaultRemoteCollectionDriver().mongo._getCollection('events');
//        db.findAndModify()
        var start = moment(timestamp);
        var minuteOfDay = start.hour()*60 + start.minute();
        var id = Events.insert({
            user: this.userId,
            year: start.year(),
            month: start.month(),
            day: start.date(),
            slot: minuteOfDay / SLOT_MIN
        });
    },
    reset: function() {
        Events.remove({});
    }
});
