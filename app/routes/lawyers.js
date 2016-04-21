import Ember from 'ember';

export default Ember.Route.extend({
  model : function(){
    var auth = this.controllerFor("application").authCheck()
    $.when(auth).then(function(data) {

    });

  }

});
