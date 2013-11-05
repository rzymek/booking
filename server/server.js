Meteor.publish("events", function() {
    return Events.find();
});

Meteor.methods({
    addEvent: function(start) {
//        var db = MongoInternals.defaultRemoteCollectionDriver().mongo._getCollection('events');
//        db.findAndModify()
        Events.insert({
            user: this.userId,
            start: start
        });        
    },
    reset: function() {
        Events.remove({});
    }
});
