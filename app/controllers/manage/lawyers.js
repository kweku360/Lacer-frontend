import Ember from 'ember';

function generateId(){
  return Math.floor(100000 + Math.random() * 900000);
};
var myNewSuit = "";

export default Ember.Controller.extend({
  appindexController: Ember.inject.controller('manage.index'),
  suitNumber: Ember.computed.reads('appindexController.internalSuitnumber'),

  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  lawyerInfo : {
    lawyerId :generateId(),
    lawyerName : "",
    lawyerType : "Plaintiff",
    registertype:"",
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : ""
  },

  viewStates:{
    unregistered : "hideView"
  },

  lawyerType :["Plaintiff","Defendant"],
  lawyerList:[],
  listPos :"",
  isUnregistered : "",

  lawyersArray :Ember.A([]),

  pushLawyer : function(){
    var lawyerInfo = {
      index: this.get("lawyersArray").length,
      suitnumber: this.get("newSuit.suitNumber"),
      lawyerId: this.get("lawyerInfo.lawyerId"),
      lawyerName: this.get("lawyerInfo.lawyerName"),
      lawyertype: this.get("lawyerInfo.lawyerType"),
      registertype :"unregistered",
      lawyerEmail: this.get("lawyerInfo.lawyerEmail"),
      lawyerAddress: this.get("lawyerInfo.lawyerAddress"),
      lawyerContact1: this.get("lawyerInfo.lawyerContact1"),
      lawyerContact2: this.get("lawyerInfo.lawyerContact2")
    }

    this.get("lawyersArray").pushObject(lawyerInfo);

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

  getSuitData : function(){
    var self = this;
    this.get("lawyersArray").clear();
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitlawyers/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
          self.transitionToRoute("manage")
        }else{
          for(var i=0;i<obj.suitlawyers.length;i++ ){
            self.set("lawyerInfo.lawyerId",obj.suitlawyers[i].id)
            self.set("lawyerInfo.suitNumber",obj.suitlawyers[i].suitnumber)
            self.set("lawyerInfo.lawyerName",obj.suitlawyers[i].fullname)
            self.set("lawyerInfo.lawyerType",obj.suitlawyers[i].type)
            self.set("lawyerInfo.lawyerAddress",obj.suitlawyers[i].address)
            self.set("lawyerInfo.lawyerEmail",obj.suitlawyers[i].email)
            self.set("lawyerInfo.lawyerContact1",obj.suitlawyers[i].phone1)
            self.set("lawyerInfo.lawyerContact2",obj.suitlawyers[i].phone2)
            self.pushLawyer();
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

  getData : function(){
    var self = this;
    this.get("lawyersArray").clear();
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
            lawyerlist.description = '0'+obj.lawyers[i].lawyerid;
            lawyerlist.lawyerName = obj.lawyers[i].fullname;
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

  clearForm: function(){
    this.set("lawyerInfo.lawyerId",""),
      this.set("lawyerInfo.lawyerName",""),
      this.set("lawyerInfo.lawyerType",""),
      this.set("lawyerInfo.lawyerAddress",""),
      this.set("lawyerInfo.lawyerEmail",""),
      this.set("lawyerInfo.lawyerContact1",""),
      this.set("lawyerInfo.lawyerContact2","")
  },
  addSuitLawyer : function(suitlawyer){
    $.ajax({
      url: this.get("ApiUrl")+"suitlawyers",
      data:suitlawyer,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        // self.notify.success("Lawyer added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add Suit Lawyer")
      }
    });
  },
  addSuitRegisteredLawyer : function(suitlawyer){
    $.ajax({
      url: this.get("ApiUrl")+"suitlawyers",
      data:suitlawyer,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        // self.notify.success("Lawyer added successfully")
      },
  error: function (model, response) {
  self.notify.error("Unable to add Suit Lawyer")
}
});
},
  addUnregisteredLawyer : function(lawyer){
    var self = this;
    $.ajax({
      url: this.get("ApiUrl")+"unregisteredlawyers",
      data:lawyer,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        var suitlawyer = {
          suitnumber :self.get("suitNumber"),
          lawyerid : obj.unregisteredlawyer.lawyerid,
          fullname : obj.unregisteredlawyer.fullname,
          lawyertype : lawyer.lawyertype,
          registertype : lawyer.registertype,
          phone : obj.unregisteredlawyer.lawyernumber
        }
        self.addSuitLawyer(suitlawyer)
      },
      error: function (model, response) {
        self.notify.error("Unable to add Lawyer")
      }
    });
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
      if(this.get("isUnregistered") == true){
        var validate = $("#addUnregistered").parsley();
        if(validate.validate() == true) {
          //first we push info to array
          console.log(this.get("listPos"))
          var lawyerInfo = {
            index: this.get("lawyersArray").length,
            suitnumber: this.get("newSuit.suitNumber"),
            lawyerId: this.get("lawyerInfo.lawyerId"),
            lawyerName: this.get("lawyerInfo.lawyerName"),
            lawyertype: this.get("lawyerInfo.lawyerType"),
            registertype :"unregistered",
            lawyerEmail: this.get("lawyerInfo.lawyerEmail"),
            lawyerAddress: this.get("lawyerInfo.lawyerAddress"),
            lawyerContact1: this.get("lawyerInfo.lawyerContact1"),
            lawyerContact2: this.get("lawyerInfo.lawyerContact2")
          }
          this.addUnregisteredLawyer(lawyerInfo)
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
            lawyertype :this.get("lawyerInfo.lawyerType"),
            registertype :"registered",
            lawyerEmail :this.get("listPos.lawyerEmail"),
            lawyerAddress : this.get("listPos.lawyerAddress"),
            lawyerContact1 : this.get("listPos.lawyerContact1"),
            lawyerContact2 : this.get("listPos.lawyerContact2")
          }

          var suitlawyer = {
            suitnumber :this.get("suitNumber"),
            lawyerid : lawyerInfo.lawyerContact1,
            fullname : lawyerInfo.lawyerName,
            lawyertype : lawyerInfo.lawyertype,
            registertype : lawyerInfo.registertype,
            phone : lawyerInfo.lawyerContact1
          }

          this.addSuitRegisteredLawyer(suitlawyer)

          this.get("lawyersArray").pushObject(lawyerInfo);
        }

      }


    }
  }
});
