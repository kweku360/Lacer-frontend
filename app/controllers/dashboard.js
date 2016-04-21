import Ember from 'ember';

export default Ember.Controller.extend({

  email : "kankam@gmail.com",
  active : "active",
  actions : {
    showIndex :function(){
      this.transitionTo("suits")
    }
  }
});
