import Ember from 'ember';


export default Ember.Controller.extend({
  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  suitNumber : "",
 actions : {
    findSuit : function(){
      var self = this;
      var res = encodeURIComponent(this.get("suitNumber"));
      $.ajax({
       //url: this.get("ApiUrl")+"suits?id="+this.get("suitNumber"),
        url: this.get("ApiUrl")+"suits/"+res,
        type: 'GET',
        success: function(response) {
          var obj = JSON.parse(response)
          if(obj.suits == "{}"){
            self.notify.error("Wrong Suit Number  - please enter again")
         }else{
            self.set("internalSuitnumber",self.get("suitNumber"))
            self.transitionToRoute("manage.info")
        }
        },
        error: function (model, response) {
          self.notify.error("Please Enter a Suit Number")
        }
      });
    }

  }
});
