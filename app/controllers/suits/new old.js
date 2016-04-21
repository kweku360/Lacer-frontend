import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({

//lets intect  controllers
  newPlaintiffController: Ember.inject.controller('suits.plaintiffs'),
  newPlaintiffArray: Ember.computed.reads('newPlaintiffController.plaintiffArray'),

  newLawyerController: Ember.inject.controller('suits.addlawyer'),
  newLawyerArray: Ember.computed.reads('newLawyerController.lawyersArray'),

  newDefendantController: Ember.inject.controller('suits.defendants'),
  newDefendantArray: Ember.computed.reads('newDefendantController.defendantArray'),

  //case type implementation
  caseTypes : ["select one","Criminal","Civil",""],

  viewstate : {
    showview : "hideView",
    criminalcase : "hideView",
    civilcase : "hideView",
    selectedCriminal: "",
    selectedCivil: ""
  },
  ////oberver for changing selected state
  selectedTypeCriminal : Ember.observer('viewstate.selectedCriminal', function() {
    if(this.get("viewstate.selectedCriminal") == true){
      this.set("viewstate.showview","showView")
      this.set("viewstate.criminalcase","showView")
      this.set("viewstate.civilcase","hideView")
      this.set("viewstate.selectedCivil","")
      this.set("suitInfo.caseType","THE REPUBLIC")
      this.set("suitInfo.suitTitlePlaintiff","THE REPUBLIC")
    };
    if(this.get("viewstate.selectedCriminal") == false){
      this.set("viewstate.showview","showView")
      this.set("viewstate.criminalcase","hideView")
      this.set("viewstate.civilcase","showView")
      this.set("viewstate.selectedCivil","true")
      this.set("suitInfo.caseType","")
      this.set("suitInfo.suitTitlePlaintiff","")
    };
  }),
  selectedTypeCivil : Ember.observer('viewstate.selectedCivil', function() {
    if(this.get("viewstate.selectedCivil") == true){
      this.set("viewstate.showview","showView")
      this.set("viewstate.civilcase","showView")
      this.set("viewstate.criminalcase","hideView")
      this.set("viewstate.selectedCriminal","")
      this.set("suitInfo.caseType","")
    };
    if(this.get("viewstate.selectedCivil") == false){
      this.set("viewstate.showview","showView")
      this.set("viewstate.civilcase","hideView")
      this.set("viewstate.criminalcase","showView")
      this.set("viewstate.selectedCriminal","true")
      this.set("suitInfo.caseType","")
    };
  }),



  suitInfo : {
    suitNumber :"",
    suitType : "",
    suitDate : "",
    suitTitlePlaintiff : "",
    suitTitleDefendant : "",
    suitStatus : "",
    suitCourt : "",
    suitAccess : "public",
    caseType : ""
 },
  clearForm: function(){
    this.set("suitInfo.suitNumber",""),
    this.set("suitInfo.suitType",""),
      this.set("suitInfo.suitDate",""),
      this.set("suitInfo.suitTitlePlaintiff",""),
      this.set("suitInfo.suitTitleDefendant",""),
      this.set("suitInfo.suitCourt",""),
      this.set("suitInfo.suitAccess","")
  },
  selectedCourt : "Select One",
  courts : ["Select One","Court Of Appeals","High Court","Supreme Court"],
  accesslevel : ["Select One","Public","Private"],

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
