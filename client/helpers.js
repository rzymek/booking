UI.registerHelper('session', function(key){
    return Session.get(key);
});
UI.registerHelper('show', function(key){
    return JSON.stringify(Session.get(key),' ',null);
});

UI.registerHelper('equals', function(key,value){
    return Session.equals(key, value) ? true : undefined;
});