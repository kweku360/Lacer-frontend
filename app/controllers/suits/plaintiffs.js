import Ember from 'ember';

function generateId(){
  return Math.floor(100000 + Math.random() * 900000);
};
var myNewSuit = "";

export default Ember.Controller.extend({
  newSuitController: Ember.inject.controller('suits.new'),
  newSuit: Ember.computed.reads('newSuitController.suitInfo'),

  newLawyerController: Ember.inject.controller('suits.addlawyer'),
  newLawyerArray: Ember.computed.reads('newLawyerController.lawyersArray'),

  newDefendantController: Ember.inject.controller('suits.defendants'),
  newDefendantArray: Ember.computed.reads('newDefendantController.defendantArray'),

  //enables parsley validations
  me : Ember.TextField.reopen({
    attributeBindings: ['data-parsley-type',"data-parsley-minlength","data-parsley-maxlength"]
  }),


  plaintiffInfo : {
    plaintiffId :generateId(),
    plaintiffName : "",
    plaintiffAddress : "",
    plaintiffContact1 : "",
    plaintiffContact2 : ""
  },

  plaintiffArray : Ember.A([]),



  pushPlaintiff : function(){
    var plaintiffInfo  = {
      index : this.get("plaintiffArray").length,
      suitnumber :this.get("newSuit.suitNumber"),
      plaintiffId :this.get("plaintiffInfo.plaintiffId"),
      pfullname :this.get("plaintiffInfo.plaintiffName"),
      fullname :this.get("newSuit.caseType"),
      address : this.get("plaintiffInfo.plaintiffAddress"),
      phone : this.get("plaintiffInfo.plaintiffContact1"),
      phone1 : this.get("plaintiffInfo.plaintiffContact2")
    }

    this.get("plaintiffArray").pushObject(plaintiffInfo);
  },
  clearForm: function(){
    this.set("plaintiffInfo.plaintiffId",""),
      this.set("plaintiffInfo.plaintiffName",""),
      this.set("plaintiffInfo.plaintiffAddress",""),
      this.set("plaintiffInfo.plaintiffContact1",""),
      this.set("plaintiffInfo.plaintiffContact2","")
  },

  actions : {
    proceed : function(){
      if(this.get("plaintiffArray").length == 0){
        this.notify.error("Please Enter A Plaintiff")
      }else{
        this.transitionTo("suits.addlawyer");
      }

    },
    back : function(){
      this.transitionTo("suits.new")
    },
    removeOne : function(a){
      this.get("plaintiffArray").removeAt(a)
      this.notify.info("value removed")
    },
    addAnother : function(){

      var validate = $("#addPlaintiff").parsley();
      if(validate.validate() == true){
        //first we push info to array
        this.pushPlaintiff();
        //then we clear form
        this.clearForm();
      }else{
        this.notify.error("Please Fix Errors")
      }
    },
    addPlaintiff : function(){

      var validate = $("#addPlaintiff").parsley();
      if(validate.validate() == true){
        //first we push info to array
        this.pushPlaintiff();
        console.log(this.get("plaintiffArray"));
        //then we clear form
        this.clearForm();
      }else{
        this.notify.error("Please Fix Errors")
      }
    }
  }
});
