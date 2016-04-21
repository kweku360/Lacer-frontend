import Ember from 'ember';

export default Ember.Route.extend({
  actions : {
    logSuccess :function(){
      this.transitionToRoute("suits.new")
    }
  }

});
