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

  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  me : Ember.TextField.reopen({
    attributeBindings: ['data-parsley-type',"data-parsley-minlength","data-parsley-maxlength"]
  }),

  lawyerInfo : {
    lawyerId :generateId(),
    lawyerName : "",
    lawyerType : "Plaintiff",
    registertype:"",
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : "",
    lawfirmName:""
   },

  viewStates:{
  unregistered : "hideView"
  },

  lawyerType :["Plaintiff Lawyer","Defendant Lawyer"],
  lawyerList:[],
  listPos :"",
  isUnregistered : "",

  lawyersArray :Ember.A([]),

  pushLawyer : function(){

  },

 me: Ember.Select.reopen({
    didInsertElement : function(){
      this._super();
      Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },
    afterRenderEvent : function(){
      $("#lawyeropt").change(function(){
               var selectedopt =  $("#lawyeropt option:selected").val()
               if(selectedopt == 1){
                 $("#hidelawyerlist").removeClass("hideView")
                 $("#hidelawyerlist").addClass("showView")

                 $("#addUnregistered").removeClass("showView")
                 $("#addUnregistered").addClass("hideView")
                 $("#isunreg").val("false")

               }
        if(selectedopt == 2){
                 $("#hidelawyerlist").addClass("hideView")
                 $("#hidelawyerlist").removeClass("showView")

                 $("#addUnregistered").addClass("showView")
                 $("#addUnregistered").removeClass("hideView")
                 $("#isunreg").val("true")
           }
             })
    }
  }),


//  isUnregisteredChange: Ember.observer('isUnregistered', function() {
//   if(this.get("isUnregistered") == true){
//this.set("viewStates.unregistered","showView")
//   };
//    if(this.get("isUnregistered") == false){
//this.set("viewStates.unregistered","hideView")
//   };
//  }),

  getData : function(){
    var self = this;
    self.set("lawyerList",[])
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"lawyers",
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.meta.total == 0){

        }else{
          for(var i=0;i<obj.lawyers.length;i++ ){
            var lawyerlist = {};
            lawyerlist.id = i;
            lawyerlist.text = obj.lawyers[i].fullname;
            lawyerlist.description = obj.lawyers[i].lawyerid;
            lawyerlist.lawyerName = obj.lawyers[i].fullname;
            lawyerlist.lawfirmName = obj.lawyers[i].lawfirmname;
            lawyerlist.lawyerEmail = obj.lawyers[i].email;
            lawyerlist.lawyerId = obj.lawyers[i].lawyerid;
            lawyerlist.lawyerType = obj.lawyers[i].type;
            lawyerlist.registertype = "registered";
            lawyerlist.lawyerAddress = obj.lawyers[i].address;
            lawyerlist.lawyerContact1 = "0"+obj.lawyers[i].phone1;
            lawyerlist.lawyerContact2 = obj.lawyers[i].phone2;
             self.get("lawyerList").push(lawyerlist);
          }

        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Lawyers")
      }
    });
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

       if( $("#isunreg").val() == "true"){
         var validate = $("#addUnregistered").parsley();
         if(validate.validate() == true) {
           //first we push info to array
           // var selectedlawyer = this.get("listPos");
           console.log(this.get("listPos"))
           var lawyerInfo = {
             index: this.get("lawyersArray").length,
             suitnumber: this.get("newSuit.suitNumber"),
             lawyerId: this.get("lawyerInfo.lawyerId"),
             lawyerName: this.get("lawyerInfo.lawyerName"),
             lawfirmName :this.get("lawyerInfo.lawfirmName"),
             lawyertype: this.get("lawyerInfo.lawyerType"),
             registertype :"unregistered",
             lawyerEmail: this.get("lawyerInfo.lawyerEmail"),
             lawyerAddress: this.get("lawyerInfo.lawyerAddress"),
             lawyerContact1: this.get("lawyerInfo.lawyerContact1"),
             lawyerContact2: this.get("lawyerInfo.lawyerContact2")
           }

           this.get("lawyersArray").pushObject(lawyerInfo);
           this.clearForm();
         }else{
           this.notify.error("Please Fix Errors")
         }

       }else{
         //first we push info to array
         // var selectedlawyer = this.get("listPos");
         if(this.get("listPos") == "") {
           this.notify.error("Please Select A Lawyer")
         }else{
           console.log(this.get("listPos"))
           var lawyerInfo  = {
             index : this.get("lawyersArray").length,
             suitnumber :this.get("newSuit.suitNumber"),
             lawyerId :this.get("listPos.lawyerId"),
             lawyerName :this.get("listPos.lawyerName"),
             lawfirmName :this.get("listPos.lawfirmName"),
             lawyertype :this.get("lawyerInfo.lawyerType"),
             registertype :"registered",
             lawyerEmail :this.get("listPos.lawyerEmail"),
             lawyerAddress : this.get("listPos.lawyerAddress"),
             lawyerContact1 : this.get("listPos.lawyerContact1"),
             lawyerContact2 : this.get("listPos.lawyerContact2")
           }

           this.get("lawyersArray").pushObject(lawyerInfo);
         }

       }


   }
 }
});
