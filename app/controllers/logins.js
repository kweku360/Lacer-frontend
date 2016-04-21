import Ember from 'ember';

export default Ember.Controller.extend({

  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  email : "kankam@gmail.com",
  active : "active",
  actions : {
    showRegistrar :function(){
      this.transitionTo("suits")
    },
    showPortal :function(){
      this.transitionTo("portal")
    }
  }
});
