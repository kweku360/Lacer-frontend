import Ember from 'ember';

export default Ember.Component.extend({
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

  judgeState : {
    addnew :"showView",
    form :"hideView"
  },

  arrutil :function(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  },

  selectedCourt : "",
  courts : [
    {id:"none",txt:"Select One"},
    {id:"Court Of Appeals",txt:"Court Of Appeals"},
    {id:"High Court",txt:"High Court"},
    {id:"Supreme Court",txt:"Supreme Court"},],
  courtnumber : [
    {id:"none",txt:"Select One"},
    {id:"room one",txt:"room one"},
    {id:"room two",txt:"room two"},
    {id:"room three",txt:"room three"},],

  judgeInfo : {
    id : "",
    gid : "",
    judgeId : "",
    judgeName : "",
    judgeEmail : "",
    judgeAddress : "",
    judgeContact1 : "",
    court : "",
    courtNumber:""
  },

  getJudgeData : function(){
    var self = this;
    this.get("judgesArray").clear();
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitjudges/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)

        console.log(obj);
        console.log(response);
        if(obj.meta.total == 0){

        }else{
          for(var i=0;i<obj.suitjudges.length;i++ ){
            self.set("judgeInfo.gid",obj.suitjudges[i].id)
            self.set("judgeInfo.id",obj.suitjudges[i].suitjudgeid)
            self.set("judgeInfo.judgeId",obj.suitjudges[i].judgeid)
            self.set("judgeInfo.judgeName",obj.suitjudges[i].fullname)
            self.set("judgeInfo.judgeAddress",obj.suitjudges[i].address)
            self.set("judgeInfo.judgeEmail",obj.suitjudges[i].email)
            self.set("judgeInfo.judgeContact1",obj.suitjudges[i].phone)
            self.set("judgeInfo.court",obj.suitjudges[i].court)
            self.set("judgeInfo.courtNumber",obj.suitjudges[i].courtnumber)
            self.pushJudge();
          }


        }
        //lets clear form
        self.clearJudge()
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Judges")
      }
    });
  },

  judgesArray :Ember.A([]),

  pushJudge : function(){
    var judgeInfo  = {
      index : this.get("judgesArray").length,
      id :this.get("judgeInfo.id"),
      gid :this.get("judgeInfo.gid"),
      judgeId :this.get("judgeInfo.judgeContact1"),
      suitnumber :this.get("suitNumber"),
      fullname :this.get("judgeInfo.judgeName"),
      email :this.get("judgeInfo.judgeEmail"),
      court :this.get("judgeInfo.court"),
      courtnumber :this.get("judgeInfo.courtNumber"),
      address : this.get("judgeInfo.judgeAddress"),
      phone : this.get("judgeInfo.judgeContact1")
    }

    this.get("judgesArray").pushObject(judgeInfo);
  },

  clearJudge: function(){
    this.set("judgeInfo.judgeName",""),
    this.set("judgeInfo.id",""),
    this.set("judgeInfo.judgeId",""),
      this.set("judgeInfo.judgeEmail",""),
      this.set("judgeInfo.judgeAddress",""),
      this.set("judgeInfo.judgeContact1",""),
      this.set("judgeInfo.court","")
    this.set("judgeInfo.courtNumber","")
  },
  saveJudgeData : function(){
    var self = this;
    this.pushJudge();
    var position = this.get("judgesArray").length - 1
    $.ajax({
      url: this.get("ApiUrl")+"suitjudges",
      data:this.get("judgesArray").objectAt(position),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        self.clearJudge();
        self.getJudgeData()
        self.set("isOverlay","hideView")
        self.send("cancelAddJudge");
        self.notify.success("Judge added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add Judge - try again")
      }
    });
  },
  deleteData : function(){
    var self = this;
    var id = this.get("judgeInfo.id")
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitjudges/"+ id,
      type: 'DELETE',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.code == 200){
          self.set("isOverlay","hideView")
          self.notify.info("judge Removed")
          self.getJudgeData();
        }else{
          self.set("isOverlay","hideView")
          self.notify.info("Unable to Remove suitjudges")
        }
      },
      error: function (model, response) {
        self.set("isOverlay","hideView")
        self.notify.error("Unable To delete Now")
      }
    });
  },
  editData : function(){
    var self = this;
    var id = this.get("judgeInfo.id")
    var judgeInfo  = {
      index : this.get("judgesArray").length,
      id :this.get("judgeInfo.id"),
      gid :this.get("judgeInfo.gid"),
      judgeId :this.get("judgeInfo.judgeContact1"),
      suitnumber :this.get("suitNumber"),
      fullname :this.get("judgeInfo.judgeName"),
      email :this.get("judgeInfo.judgeEmail"),
      court :this.get("judgeInfo.court"),
      courtnumber :this.get("judgeInfo.courtNumber"),
      address : this.get("judgeInfo.judgeAddress"),
      phone : this.get("judgeInfo.judgeContact1")
    }
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitjudges/"+id,
      data:judgeInfo,
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

  didInsertElement: function() {
    // Initialize some state for this component
    this.getJudgeData()
  },
  actions : {
    addJudge : function(){
      var validate = $("#addJudge").parsley();
      if(validate.validate() == true){
        this.set("isOverlay","showView")
        this.set("overlayMsg","Adding judge")
        this.saveJudgeData()
      }else{
        this.notify.error("Please Fix Errors")
      }
      //
    },
    removeOneJudge : function(a,b){
      var r = confirm("Delete Judge?");
      if (r == true) {
        var i = this.arrutil(this.get("judgesArray"),a,"phone")
        console.log(i)
        var pinfo = this.get("judgesArray").objectAt(i)
        this.set("judgeInfo.id",pinfo.id)
        console.log(pinfo)
        this.set("isOverlay","showView")
        this.set("overlayMsg","Deleting")
        this.deleteData();

      } else {

      }

    },

    editOneJudge : function(a){

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

    },


    //Judge Actions
    showAddJudge : function(){
      this.set("judgeState.addnew","hideView"),
        this.set("judgeState.form","showView")
    },
    cancelAddJudge : function(){
      this.set("judgeState.addnew","showView"),
        this.set("judgeState.form","hideView")
    }
  }
});
