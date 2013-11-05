Meteor.publish("events", function() {
    return Events.find();
});

Meteor.methods({
    addEvent: function(timestamp) {
//        var db = MongoInternals.defaultRemoteCollectionDriver().mongo._getCollection('events');
//        db.findAndModify()
        var start = moment(timestamp);
        var minuteOfDay = start.hour()*60 + start.minute();
        var slot = minuteOfDay / SLOT_MIN;
        var data = {
            user: this.userId,
            year: start.year(),
            month: start.month(),
            day: start.date(),
            slot: slot
        };
        var id = Events.insert(data);
        delete data.user;
        if(Events.find(data).count() > 1) {
            console.log("double booking");
            Events.remove(id);
        }
    },
    reset: function() {
        Events.remove({});
    }
});
