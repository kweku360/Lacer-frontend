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

  getData : function(){
    var self = this;
    this.get("defendantArray").clear();
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      url: this.get("ApiUrl")+"defendants/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
          self.transitionToRoute("manage")
        }else{
          for(var i=0;i<obj.defendants.length;i++ ){
            self.set("defendantInfo.defendantId",obj.defendants[i].id)
            self.set("defendantInfo.suitNumber",obj.defendants[i].suitnumber)
            self.set("defendantInfo.defendantName",obj.defendants[i].fullname)
            self.set("defendantInfo.defendantAddress",obj.defendants[i].address)
            self.set("defendantInfo.defendantEmail",obj.defendants[i].email)
            self.set("defendantInfo.defendantContact1",obj.defendants[i].phone1)
            self.set("defendantInfo.defendantContact2",obj.defendants[i].phone2)
            self.pushDefendant();
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
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"defendants/"+ id,
      type: 'DELETE',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
       if(obj.code == 200){
         self.get("defendantArray").removeAt(pos);
         self.notify.info("Defendant Removed")
        }else{
         self.notify.info("Unable to Remove Defendant")
        }
      },
      error: function (model, response) {
        self.notify.error("Unable To delete Now")
      }
    });
  },
  saveData : function(){
    var self = this;
    this.pushDefendant();
    var position = this.get("defendantArray").length - 1
    $.ajax({
      url: this.get("ApiUrl")+"defendants",
      data:this.get("defendantArray").objectAt(position),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);

        self.clearForm();
        self.notify.success("defendant added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add defendant - try again")
      }
    });
  },
  editData : function(id,pos){
    var self = this;
    var defendantInfo  = {
      index : this.get("defendantArray").length,
      suitnumber :this.get("defendantInfo.suitNumber"),
      defendantId :this.get("defendantInfo.defendantId"),
      fullname :this.get("defendantInfo.defendantName"),
      address : this.get("defendantInfo.defendantAddress"),
      phone : this.get("defendantInfo.defendantContact1"),
      phone1 : this.get("defendantInfo.defendantContact2")
    }
    $.ajax({
      url:this.get("ApiUrl")+"defendants/"+id,
      data:defendantInfo,
      type: 'PUT',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        self.get("defendantArray").removeAt(pos)
        self.get("defendantArray").insertAt(pos,defendantInfo)
        self.notify.success("defendant added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add defendant - try again")
      }
    });
  },

  defendantInfo : {
    defendantId :"",
    defendantIndex :"",
    suitNumber :"",
    defendantName : "",
    defendantAddress : "",
    defendantAddress : "",
    defendantContact1 : "",
    defendantContact2 : ""
  },
  defendantArray : Ember.A([]),

  pushDefendant : function(){
    var defendantInfo  = {
      index : this.get("defendantArray").length,
      suitnumber :this.get("defendantInfo.suitNumber"),
      defendantId :this.get("defendantInfo.defendantId"),
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
  addToggle : "showView",
  saveToggle : "hideView",
  cancelToggle : "hideView",

 actions : {
   removeOne : function(a){
     var pinfo = this.get("defendantArray").objectAt(a)
     this.deleteData(pinfo.defendantId, a);
   },
   editOne : function(a){
     var pinfo = this.get("defendantArray").objectAt(a)

       this.set("defendantInfo.suitNumber",pinfo.suitNumber),
       this.set("defendantInfo.defendantIndex",pinfo.index),
       this.set("defendantInfo.defendantId",pinfo.defendantId),
       this.set("defendantInfo.defendantName",pinfo.fullname),
       this.set("defendantInfo.defendantAddress",pinfo.address),
       this.set("defendantInfo.defendantContact1",pinfo.phone),
       this.set("defendantInfo.defendantContact2",pinfo.phone1)
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
    // var pinfo = this.get("defendantArray").objectAt(a)
     //console.log(this.get("defendantInfo.defendantId"))
    // console.log(a)
     this.editData(this.get("defendantInfo.defendantId"), a)
     this.clearForm();
     this.set("addToggle","showView");
     this.set("saveToggle","hideView");
     this.set("cancelToggle","hideView");

   },
   addAnother : function(a){
     var validate = $("#addDefendant").parsley();
     if(validate.validate() == true){
      this.saveData();
     }else{
       this.notify.error("Please Fix Errors")
     }
   }
 }
});
