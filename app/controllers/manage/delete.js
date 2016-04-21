import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({
  //lets intect  controllers
  appindexController: Ember.inject.controller('manage.index'),
  suitNumber: Ember.computed.reads('appindexController.internalSuitnumber'),


  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  suitInfo : {
    id : "",
    suitNumber :"",
    suitType : "",
    suitDate : "",
    suitTitle : "",
    suitCourt : "",
    suitAccess : "",
    suitStatus : ""
 },
  selectedCourt : "Select One",
  courts : ["","Court Of Appeals","High Court","Supreme Court"],
  accesslevel : ["","Public","Private"],

 actions : {

   next : function(){
     var validate = $("#newSuit").parsley();
      if(validate.validate() == true){
        this.transitionTo("suits.plaintiffs")
      }else{
        this.notify.error("Please Fix Errors")
      }
     // this.transitionTo("suits.plaintiffs")
    }

}
});
