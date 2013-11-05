Meteor.publish("events", function() {
   return Events.find(); 
});
Meteor.methods({
   reset: function() {
       Events.remove({});
   } 
});

Events.allow({
    insert: function(userId, event) {
        event.user = userId;
        return true;
    }
});