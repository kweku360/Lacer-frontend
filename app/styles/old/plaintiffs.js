import Ember from 'ember';

function generateId(){
  return Math.floor(100000 + Math.random() * 900000);
};
var myNewSuit = "";

export default Ember.Controller.extend({
  newSuitController: Ember.inject.controller('suits.new'),
  newSuit: Ember.computed.reads('newSuitController.suitInfo'),

  plaintiffInfo : {
    plaintiffLawyerId :generateId(),
    plaintiffLawyer :"",
    plaintiffName : "",
    plaintiffAddress : "",
    plaintiffContact : ""
   },

  //Error
  viewErrors : {
    plaintiffLawyer :"",
    plaintiffLawyerText :"",
    plaintiffLawyerFocused : "hideView",
    plaintiffLawyerState : false,

    plaintiffName :"",
    plaintiffNameText :"",
    plaintiffNameFocused : "hideView",
    plaintiffNameState : false,

    plaintiffAddress :"",
    plaintiffAddressText :"",
    plaintiffAddressFocused : "hideView",
    plaintiffAddressState : false ,

    plaintiffContact :"",
    plaintiffContactText :"",
    plaintiffContactFocused : "hideView",
    plaintiffContactState : false



  },

  //validations
  plaintiffLawyerValidator : function(val){
    this.set("viewErrors.plaintiffLawyerFocused","showView")
    if(val == ""){
      this.set("viewErrors.plaintiffLawyer",true)
      this.set("viewErrors.plaintiffLawyerState",false)
      this.set("viewErrors.plaintiffLawyerText","please enter a value")
    }
    else{
      this.set("viewErrors.plaintiffLawyerState",true)
      this.set("viewErrors.plaintiffLawyer",false)
    }
  },

  plaintiffNameValidator : function(val){
    this.set("viewErrors.plaintiffNameFocused","showView")
    if(val == ""){
      this.set("viewErrors.plaintiffName",true)
      this.set("viewErrors.plaintiffNameState",false)
      this.set("viewErrors.plaintiffNameText","please enter a value")
    }
    else{
      this.set("viewErrors.plaintiffNameState",true)
      this.set("viewErrors.plaintiffName",false)
    }
  },
  plaintiffAddressValidator : function(val){
    this.set("viewErrors.plaintiffAddressFocused","showView")
    if(val == ""){
      this.set("viewErrors.plaintiffAddress",true)
      this.set("viewErrors.plaintiffAddressState",false)
      this.set("viewErrors.plaintiffAddressText","please enter a value")
    }
    else{
      this.set("viewErrors.plaintiffAddressState",true)
      this.set("viewErrors.plaintiffAddress",false)
    }
  },
  plaintiffContactValidator : function(val){
    this.set("viewErrors.plaintiffContactFocused","showView")
    if(val == ""){
      this.set("viewErrors.plaintiffContact",true)
      this.set("viewErrors.plaintiffContactState",false)
      this.set("viewErrors.plaintiffContactText","please enter a value")
    }
    else{
      this.set("viewErrors.plaintiffContactState",true)
      this.set("viewErrors.plaintiffContact",false)
    }
  },

 actions : {
    proceed : function(){
      this.transitionTo("suits.addlawyer")
      this.store.findAll('suits').then(function(user) {
        console.log(user)
      })
    },
   back : function(){
      this.transitionTo("suits.new")
    },
    addNewSuit : function(){
    this.transitionTo("suits.new")
    },
   addDefendants : function(){
     var tranState = 1;
     if(this.get("viewErrors.plaintiffLawyerState") == false){
       this.plaintiffLawyerValidator(this.get("plaintiffInfo.plaintiffLawyer"))
       tranState = 0;
     }
     if(this.get("viewErrors.plaintiffNameState") == false){
       this.plaintiffNameValidator(this.get("plaintiffInfo.plaintiffName"))
       tranState = 0;
     }
     if(this.get("viewErrors.plaintiffAddressState") == false){
       this.plaintiffAddressValidator(this.get("plaintiffInfo.plaintiffAddress"))
       tranState = 0;
     }
     if(this.get("viewErrors.plaintiffContactState") == false){
       this.plaintiffContactValidator(this.get("plaintiffInfo.plaintiffContact"))
       tranState = 0;
     }

    if(tranState == 1){
       this.transitionTo("suits.defendants")
     }
},

   plaintiffLawyerValidator : function(val){
     this.plaintiffLawyerValidator(val)
   } ,

   plaintiffNameValidator : function(val){
     this.plaintiffNameValidator(val)
   },
   plaintiffAddressValidator : function(val){
     this.plaintiffAddressValidator(val)
   }  ,
   plaintiffContactValidator : function(val){
     this.plaintiffContactValidator(val)
   }

  }
});
