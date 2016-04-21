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

  //enables parsley validations
  me : Ember.TextField.reopen({
    attributeBindings: ['data-parsley-type',"data-parsley-minlength","data-parsley-maxlength"]
  }),

  getData : function(){
    var self = this;
    this.get("plaintiffArray").clear();
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"plaintiffs/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
         self.transitionToRoute("manage")
        }else{
          for(var i=0;i<obj.plaintiffs.length;i++ ){
            self.set("plaintiffInfo.plaintiffId",obj.plaintiffs[i].id)
            self.set("plaintiffInfo.suitNumber",obj.plaintiffs[i].suitnumber)
            self.set("plaintiffInfo.plaintiffName",obj.plaintiffs[i].fullname)
            self.set("plaintiffInfo.plaintiffAddress",obj.plaintiffs[i].address)
            self.set("plaintiffInfo.plaintiffEmail",obj.plaintiffs[i].email)
            self.set("plaintiffInfo.plaintiffContact1",obj.plaintiffs[i].phone1)
            self.set("plaintiffInfo.plaintiffContact2",obj.plaintiffs[i].phone2)
            self.pushPlaintiff();
          }

        }
        //lets clear form
        self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },
  deleteData : function(id, pos){
    var self = this;
    $.ajax({
      url: this.get("ApiUrl")+"plaintiffs/"+ id,
      type: 'DELETE',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
       if(obj.code == 200){
         self.get("plaintiffArray").removeAt(pos);
         self.notify.info("Plaintiff Removed")
        }else{
         self.notify.info("Unable to Remove Plaintiff")
        }
      },
      error: function (model, response) {
        self.notify.error("Unable To delete Now")
      }
    });
  },
  saveData : function(){
    var self = this;
    this.pushPlaintiff();
    var position = this.get("plaintiffArray").length - 1
    $.ajax({
      url: this.get("ApiUrl")+"plaintiffs",
      data:this.get("plaintiffArray").objectAt(position),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);

        self.clearForm();
        self.notify.success("plaintiff added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add plaintiff - try again")
      }
    });
  },
  editData : function(id,pos){
    var self = this;
    var plaintiffInfo  = {
      index : this.get("plaintiffArray").length,
      suitnumber :this.get("suitNumber"),
      plaintiffId :this.get("plaintiffInfo.plaintiffId"),
      fullname :this.get("plaintiffInfo.plaintiffName"),
      address : this.get("plaintiffInfo.plaintiffAddress"),
      phone : this.get("plaintiffInfo.plaintiffContact1"),
      phone1 : this.get("plaintiffInfo.plaintiffContact2")
    }
    $.ajax({
      url: this.get("ApiUrl")+"plaintiffs/"+id,
      data:plaintiffInfo,
      type: 'PUT',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        self.get("plaintiffArray").removeAt(pos)
        self.get("plaintiffArray").insertAt(pos,plaintiffInfo)
        self.notify.success("plaintiff edited successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to Edit plaintiff - try again")
      }
    });
  },

  plaintiffInfo : {
    plaintiffId :"",
    plaintiffIndex :"",
    suitNumber :"",
    plaintiffName : "",
    plaintiffAddress : "",
    plaintiffContact1 : "",
    plaintiffContact2 : ""
  },
  plaintiffArray : Ember.A([]),

  pushPlaintiff : function(){
    var plaintiffInfo  = {
      index : this.get("plaintiffArray").length,
      suitnumber :this.get("suitNumber"),
      plaintiffId :this.get("plaintiffInfo.plaintiffId"),
      fullname :this.get("plaintiffInfo.plaintiffName"),
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
  addToggle : "showView",
  saveToggle : "hideView",
  cancelToggle : "hideView",

 actions : {
   removeOne : function(a){
     if(this.get("plaintiffArray").length == 1){
      this.notify.info("Cannot Remove - Suit must have at least one plaintiff")
     }else{
       var pinfo = this.get("plaintiffArray").objectAt(a)
       this.deleteData(pinfo.plaintiffId, a);
     }

   },
   editOne : function(a){
     var pinfo = this.get("plaintiffArray").objectAt(a)
console.log(pinfo);
       this.set("plaintiffInfo.suitNumber",pinfo.suitNumber),
       this.set("plaintiffInfo.plaintiffIndex",pinfo.index),
       this.set("plaintiffInfo.plaintiffId",pinfo.plaintiffId),
       this.set("plaintiffInfo.plaintiffName",pinfo.fullname),
       this.set("plaintiffInfo.plaintiffAddress",pinfo.address),
       this.set("plaintiffInfo.plaintiffContact1",pinfo.phone),
       this.set("plaintiffInfo.plaintiffContact2",pinfo.phone1)
     this.set("addToggle","hideView");
     this.set("saveToggle","showView");
     this.set("cancelToggle","showView");
 },
   cancel : function(a){
     this.clearForm();
     this.set("addToggle","showView");
     this.set("saveToggle","hideView");
     this.set("cancelToggle","hideView");

   },
   update : function(a){
    // var pinfo = this.get("plaintiffArray").objectAt(a)
     //console.log(this.get("plaintiffInfo.plaintiffId"))
    // console.log(a)
     this.editData(this.get("plaintiffInfo.plaintiffId"), a)
     this.clearForm();
     this.set("addToggle","showView");
     this.set("saveToggle","hideView");
     this.set("cancelToggle","hideView");

   },
   addAnother : function(a){
     var validate = $("#addPlaintiff").parsley();
     if(validate.validate() == true){
      this.saveData();
     }else{
       this.notify.error("Please Fix Errors")
     }
   }
 }
});
