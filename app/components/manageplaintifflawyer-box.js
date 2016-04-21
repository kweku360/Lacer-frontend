import Ember from 'ember';

export default Ember.Component.extend({

  arrutil :function(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  },

  classNames: ['outershell'],
  suitNumber : "",
  phoneRequired :"form-label--required",
  phoneNotRequired :"",
  truthy : "true",
  falsy : "false",
  isEditFalse : "showView",
  isEditTrue : "hideView",
  isOverlay : "hideView",
  overlayMsg : "",

  LawyerInfo : {
    suitlawyerid : "",
    lawyerId :"",
    gid :"",
    lawyerName : "",
    suitNumber : "",
    lawyerType : "",//plaintiff/defendant lawyer
    Count:"", //counts number of plaintiff lawyers
    registerType:"",//indicates if lawyer is registed to lacer or not
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : "",
    lawFirmName:"N/A",
    lawFirmContact:"N/A"
  },

  didInsertElement: function() {
    // Initialize some state for this component
    this.getLawyerListData()

  },
  getLawyerListData : function(){
    var self = this;
    this.get("suitLawyersArray").clear();
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitlawyers/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        //console.log(obj);
        //console.log(response);

        if(obj.meta.total == 0){
          // self.transitionToRoute("suits.review")
        }else{
          for(var i=0;i<obj.suitlawyers.length;i++ ){
            if(obj.suitlawyers[i].type == "plaintiff"){
              self.set("LawyerInfo.gid",obj.suitlawyers[i].id)
              self.set("LawyerInfo.lawyerId",obj.suitlawyers[i].phone1)
              self.set("LawyerInfo.suitlawyerid",obj.suitlawyers[i].suitlawyerid)
              self.set("LawyerInfo.suitNumber",obj.suitlawyers[i].suitnumber)
              self.set("LawyerInfo.lawyerName",obj.suitlawyers[i].fullname)
              self.set("LawyerInfo.lawyerType",obj.suitlawyers[i].type)
              self.set("LawyerInfo.lawyerAddress",obj.suitlawyers[i].address)
              self.set("LawyerInfo.lawyerEmail",obj.suitlawyers[i].email)
              self.set("LawyerInfo.lawyerContact1",obj.suitlawyers[i].phone1)

              self.set("LawyerInfo.lawFirmName",obj.suitlawyers[i].lawfirmname)
              if(obj.suitlawyers[i].lawfirmphone != 0){
                self.set("LawyerInfo.lawFirmContact",obj.suitlawyers[i].lawfirmphone)
              }else{
                self.set("LawyerInfo.lawFirmContact","n/a")
              }
              self.pushLawyer();
            }else{

            }
          }

        }
        self.clearForm();
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },
  addSuitLawyer : function(suitlawyer){
    var self = this
    $.ajax({
      url: this.get("ApiUrl")+"suitlawyers",
      data:suitlawyer,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        self.getLawyerListData();
        self.set("isOverlay","hideView")
        self.send("cancelUpdate");
        self.notify.success("Lawyer added successfully")
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

  suitLawyersArray : Ember.A([]),


  clearForm: function(){
    this.set("LawyerInfo.lawyerId",""),
    this.set("LawyerInfo.gid",""),
    this.set("LawyerInfo.suitlawyerid",""),
      this.set("LawyerInfo.lawyerName",""),
      this.set("LawyerInfo.lawyerType",""),
      this.set("LawyerInfo.lawyerAddress",""),
      this.set("LawyerInfo.lawyerEmail",""),
      this.set("LawyerInfo.lawyerContact1",""),
      this.set("LawyerInfo.lawyerContact2","")
    this.set("LawyerInfo.lawFirmName","")
    this.set("LawyerInfo.lawFirmContact","")
  },

  pushLawyer : function(){

    var lawyerInfo = {
      index: this.get("suitLawyersArray").length,
      suitnumber: this.get("LawyerInfo.suitNumber"),
      suitlawyerid: this.get("LawyerInfo.suitlawyerid"),
      lawyerId: this.get("LawyerInfo.lawyerId"),
      gid: this.get("LawyerInfo.gid"),
      lawyerName: this.get("LawyerInfo.lawyerName"),
      lawyertype: this.get("LawyerInfo.lawyerType"),
      registertype :"unregistered",
      lawyerEmail: this.get("LawyerInfo.lawyerEmail"),
      lawyerAddress: this.get("LawyerInfo.lawyerAddress"),
      lawyerContact1: this.get("LawyerInfo.lawyerContact1"),

      lawFirmName :this.get("LawyerInfo.lawFirmName"),
      lawFirmContact: this.get("LawyerInfo.lawFirmContact")
    }

    this.get("suitLawyersArray").pushObject(lawyerInfo);

  },

  editData : function(){
    var self = this;
    var id = this.get("LawyerInfo.suitlawyerid")
    var lawyerInfo  = {
      index: this.get("suitLawyersArray").length,
      suitnumber: this.get("LawyerInfo.suitNumber"),
      suitlawyerid: this.get("LawyerInfo.suitlawyerid"),
      lawyerId: this.get("LawyerInfo.lawyerContact1"),
      gid: this.get("LawyerInfo.gid"),
      fullname: this.get("LawyerInfo.lawyerName"),
      //lawyertype: this.get("LawyerInfo.lawyerType"),
      //registertype :"unregistered",
      lawyerEmail: this.get("LawyerInfo.lawyerEmail"),
      lawyerAddress: this.get("LawyerInfo.lawyerAddress"),
      phone: this.get("LawyerInfo.lawyerContact1"),
      lawfirmName: this.get("LawyerInfo.lawFirmName"),
      lawfirmContact: this.get("LawyerInfo.lawFirmContact")
    }
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitlawyers/"+id,
      data:lawyerInfo,
      type: 'PUT',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log("lawyer updated");

        self.set("isOverlay","hideView")
        self.notify.success("lawyer Updated successfully")
        self.send("cancelUpdate");
        self.getLawyerListData();
      },
      error: function (model, response) {
        this.set("isOverlay","hideView")
        self.notify.error("Unable to update lawyer - try again")
      }
    });
  },

  deleteData : function(){
    var self = this;
    var id = this.get("LawyerInfo.suitlawyerid")
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitlawyers/"+ id,
      type: 'DELETE',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.code == 200){
          self.set("isOverlay","hideView")
          self.notify.info("Lawyer Removed")
          self.getLawyerListData();
        }else{
          self.set("isOverlay","hideView")
          self.notify.info("Unable to Remove Lawyer")
        }
      },
      error: function (model, response) {
        self.set("isOverlay","hideView")
        self.notify.error("Unable To delete Now")
      }
    });
  },

  lawyerState : {
    addnew :"showView",
    form :"hideView",
    list : "hideView",
    addnewdef :"showView",
    formdef :"hideView",
    listdef : "hideView"
  },

  actions : {
//lawyer Actions
    showAddLawyer : function(){
      this.set("lawyerState.addnew","hideView"),
        this.set("lawyerState.form","showView")
    },
    cancelLawyerSelect : function(){
      this.set("lawyerState.addnew","hideView"),
        this.set("lawyerState.form","showView")
      this.set("lawyerState.list","hideView")
    },
    lawyerList : function(){
      this.set("lawyerState.addnew","hideView"),
        this.set("lawyerState.form","hideView")
      this.set("lawyerState.list","showView")
    },
    cancelAddLawyerForm : function(){
      this.set("lawyerState.addnew","showView"),
        this.set("lawyerState.form","hideView")
      this.set("lawyerState.list","hideView")
    },

    addLawyerForm : function(){
      var validate = $("#addLawyerForm").parsley();
      if(validate.validate() == true) {
        this.set("isOverlay","showView")
        this.set("overlayMsg","Adding lawyer")
        //first we push info to array
        // console.log(this.get("listPos"))
        var lawyerInfo = {
          index: this.get("suitLawyersArray").length,
          suitnumber: this.get("newSuit.suitNumber"),
          lawyerId: this.get("LawyerInfo.lawyerId"),
          lawyerName: this.get("LawyerInfo.lawyerName"),
          lawyertype: "plaintiff",
          registertype :"unregistered",
          lawyerEmail: this.get("LawyerInfo.lawyerEmail"),
          lawyerAddress: this.get("LawyerInfo.lawyerAddress"),
          lawyerContact1: this.get("LawyerInfo.lawyerContact1"),
          lawFirmContact: this.get("LawyerInfo.lawFirmContact"),
          lawfirmName: this.get("LawyerInfo.lawFirmName")
        }
        this.addUnregisteredLawyer(lawyerInfo)
        this.get("suitLawyersArray").pushObject(lawyerInfo);
        this.clearForm();
      }else{
        //this.notify.error("Please Fix Errors")
      }
    },

    removeOneLawyer : function(a,b){
      var r = confirm("Delete lawyer?");
      if (r == true) {
        var i = this.arrutil(this.get("suitLawyersArray"),a,"lawyerContact1")

        var pinfo = this.get("suitLawyersArray").objectAt(i)
        this.set("LawyerInfo.suitlawyerid",pinfo.suitlawyerid)
        this.set("isOverlay","showView")
        this.set("overlayMsg","Deleting")
        this.deleteData();

      } else {

      }

    },
    cancelUpdate : function(a){
      this.set("isEditTrue","hideView")
      this.set("isEditFalse","showView")
      this.set("lawyerState.addnew","showView"),
        this.set("lawyerState.form","hideView")
      this.set("lawyerState.list","hideView")
      this.clearForm()
    },
    Update : function(a){
      var validate = $("#addLawyerForm").parsley();
      if(validate.validate() == true) {
        this.set("isOverlay","showView")
        this.set("overlayMsg","Saving Edit")
        this.editData();
      }

    },
      editOneLawyer : function(a){

        this.set("lawyerState.addnew","hideView"),
          this.set("lawyerState.form","showView")
        this.set("isEditTrue","showView")
        this.set("isEditFalse","hideView")

        var i = this.arrutil(this.get("suitLawyersArray"),a,"lawyerContact1")

        var pinfo = this.get("suitLawyersArray").objectAt(i)

        this.set("LawyerInfo.suitNumber",pinfo.suitNumber),
        this.set("LawyerInfo.suitlawyerid",pinfo.suitlawyerid),
        this.set("LawyerInfo.gid",pinfo.gid),
          this.set("LawyerInfo.lawyerIndex",pinfo.index),
          this.set("LawyerInfo.lawyerId",pinfo.lawyerId),
          this.set("LawyerInfo.lawyerName",pinfo.lawyerName),
          this.set("LawyerInfo.lawyerEmail",pinfo.lawyerEmail),
          this.set("LawyerInfo.lawyerAddress",pinfo.lawyerAddress),
          this.set("LawyerInfo.lawyerContact1",pinfo.lawyerContact1)

          this.set("LawyerInfo.lawFirmName",pinfo.lawFirmName)
          if(pinfo.lawFirmContact == "n/a"){
            this.set("LawyerInfo.lawFirmContact","")
          }else{
            this.set("LawyerInfo.lawFirmContact",pinfo.lawFirmContact)
          }

      }
    }

});
