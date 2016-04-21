import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({
  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  getAllData : function(){
    var self = this;
    this.get("lawyersArray").clear();
    $.ajax({
      url: this.get("ApiUrl")+"lawyers",
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.meta.total == 0){

        }else{
          for(var i=0;i<obj.lawyers.length;i++ ){
            self.set("lawyerInfo.id",obj.lawyers[i].id)
            self.set("lawyerInfo.lawyerId",obj.lawyers[i].lawyerid)
            self.set("lawyerInfo.lawyerName",obj.lawyers[i].fullname)
            self.set("lawyerInfo.lawyerAddress",obj.lawyers[i].address)
            self.set("lawyerInfo.lawyerEmail",obj.lawyers[i].email)
            self.set("lawyerInfo.lawyerContact1",obj.lawyers[i].phone1)
            self.set("lawyerInfo.lawyerContact2",obj.lawyers[i].phone2)
            self.pushLawyer();
          }

        }
        self.clearForm();
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Lawyers")
      }
    });
  },
  saveData : function(){
    var self = this;
    this.pushLawyer();
    var position = this.get("lawyersArray").length - 1
    $.ajax({
      url: this.get("ApiUrl")+"lawyers",
      data:this.get("lawyersArray").objectAt(position),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        self.clearForm();
        self.notify.success("lawyer added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add lawyer - try again")
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
  clearForm: function(){
      this.set("lawyerInfo.lawyerId",""),
      this.set("lawyerInfo.lawyerName",""),
      this.set("lawyerInfo.lawyerEmail",""),
      this.set("lawyerInfo.lawyerAddress",""),
      this.set("lawyerInfo.lawyerContact1",""),
      this.set("lawyerInfo.lawyerContact2","")
  },

  me : Ember.TextField.reopen({
    attributeBindings: ['data-parsley-type',"data-parsley-minlength","data-parsley-maxlength"]
  }),


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
   didTransition: function() {
    alert(this.get("suitNumber"))
     return true;
   },

   next : function(){
     var validate = $("#newSuit").parsley();
      if(validate.validate() == true){
        this.transitionTo("suits.plaintiffs")
      }else{
        this.notify.error("Please Fix Errors")
      }
     // this.transitionTo("suits.plaintiffs")
    },

   addAnother : function(a){
     var validate = $("#addLawyer").parsley();
     if(validate.validate() == true){
       this.saveData();
     }else{
       this.notify.error("Please Fix Errors")
     }
   }

}
});
