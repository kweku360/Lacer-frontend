import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({


  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  getAllData : function(){
    var self = this;
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suits",
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.meta.total == 0){

        }else{


        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Get Suits")
      }
    });
  },

  lawyerInfo : {
    id : "",
    lawyerId :"",
    lawyerName : "",
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : ""
  },

  lawyerType :["","Plaintiff","Defendant"],
  lawyersArray :Ember.A([]),

  pushLawyer : function(){
    var lawyerInfo  = {
      index : this.get("lawyersArray").length,
      lawyerId :this.get("lawyerInfo.lawyerId"),
      lawyerName :this.get("lawyerInfo.lawyerName"),
      lawyerCode :this.get("lawyerInfo.lawyerType"),
      lawyerEmail :this.get("lawyerInfo.lawyerEmail"),
      lawyerAddress : this.get("lawyerInfo.lawyerAddress"),
      lawyerContact1 : this.get("lawyerInfo.lawyerContact1"),
      lawyerContact2 : this.get("lawyerInfo.lawyerContact2")
    }

    this.get("lawyersArray").pushObject(lawyerInfo);
  },

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
