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

  defendantInfo : {
    defendantId :generateId(),
    defendantName : "",
    defendantAddress : "",
    defendantContact1 : "",
    defendantContact2 : ""
  },

  defendantArray : Ember.A([]),

  pushDefendant : function(){
    var defendantInfo  = {
      index : this.get("defendantArray").length,
      defendantId :this.get("defendantInfo.defendantId"),
      suitnumber :this.get("newSuit.suitNumber"),
      fullname :this.get("defendantInfo.defendantName"),
      address : this.get("defendantInfo.defendantAddress"),
      phone : this.get("defendantInfo.defendantContact1"),
      phone1 : this.get("defendantInfo.defendantContact2")
    }

    this.get("defendantArray").pushObject(defendantInfo);
  },
  clearForm: function(){
    this.set("defendantInfo.defendantId",""),
      this.set("defendantInfo.defendantName",""),
      this.set("defendantInfo.defendantAddress",""),
      this.set("defendantInfo.defendantContact1",""),
      this.set("defendantInfo.defendantContact2","")
  },

  actions : {
    proceed : function(){
      if(this.get("defendantArray").length == 0){
        this.notify.error("Please Enter A Defendant")
      }else{
        this.transitionTo("suits.adddocument");
      }
    },
    back : function(){
      this.transitionTo("suits.addlawyer")
    },
    removeOne : function(a){
      this.get("defendantArray").removeAt(a)
      this.notify.info("value removed")
    },
    addAnother : function(){

      var validate = $("#addDefendant").parsley();
      if(validate.validate() == true){
        //first we push info to array
        this.pushDefendant();
        console.log(this.get("defendantArray"));
        //then we clear form
        this.clearForm();
      }else{
        this.notify.error("Please Fix Errors")
      }
    }

  }

});
