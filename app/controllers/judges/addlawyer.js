import Ember from 'ember';

function generateId(){
  return Math.floor(100000 + Math.random() * 900000);
};
var myNewSuit = "";

export default Ember.Controller.extend({
  newSuitController: Ember.inject.controller('suits.new'),
  newSuit: Ember.computed.reads('newSuitController.suitInfo'),

  newPlaintiffController: Ember.inject.controller('suits.plaintiffs'),
  newPlaintiffArray: Ember.computed.reads('newPlaintiffController.plaintiffArray'),

  newLawyerController: Ember.inject.controller('suits.addlawyer'),
  newLawyerArray: Ember.computed.reads('newLawyerController.lawyersArray'),

  newDefendantController: Ember.inject.controller('suits.defendants'),
  newDefendantArray: Ember.computed.reads('newDefendantController.defendantArray'),

  lawyerInfo : {
    lawyerId :generateId(),
    lawyerName : "",
    lawyerType : "",
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
      suitnumber :this.get("newSuit.suitNumber"),
      lawyerId :this.get("lawyerInfo.lawyerId"),
      lawyerName :this.get("lawyerInfo.lawyerName"),
      lawyertype :this.get("lawyerInfo.lawyerType"),
      lawyerEmail :this.get("lawyerInfo.lawyerEmail"),
      lawyerAddress : this.get("lawyerInfo.lawyerAddress"),
      lawyerContact1 : this.get("lawyerInfo.lawyerContact1"),
      lawyerContact2 : this.get("lawyerInfo.lawyerContact2")
    }

    this.get("lawyersArray").pushObject(lawyerInfo);
  },
  clearForm: function(){
    this.set("lawyerInfo.lawyerId",""),
      this.set("lawyerInfo.lawyerName",""),
      this.set("lawyerInfo.lawyerType",""),
      this.set("lawyerInfo.lawyerAddress",""),
      this.set("lawyerInfo.lawyerEmail",""),
      this.set("lawyerInfo.lawyerContact1",""),
      this.set("lawyerInfo.lawyerContact2","")
  },



 actions : {
    proceed : function(){

      if(this.get("lawyersArray").length == 0){
        this.notify.error("Please Enter A Lawyer")
      }else{
        this.transitionTo("suits.defendants");
      }
    },
   goBack : function(){
     this.transitionTo("suits.plaintiffs")
   },
   removeOne : function(a){
     this.get("lawyersArray").removeAt(a)
     this.notify.info("value removed")
   },
   addAnother : function(){

     var validate = $("#addLawyer").parsley();
     if(validate.validate() == true){
       //first we push info to array
       this.pushLawyer();
       console.log(this.get("lawyersArray"));
       //then we clear form
       this.clearForm();
     }else{
       this.notify.error("Please Fix Errors")
     }
   }
 }
});
