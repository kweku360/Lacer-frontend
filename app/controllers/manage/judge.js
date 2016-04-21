import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({
  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  //lets intect  controllers
  appindexController: Ember.inject.controller('manage.index'),
  suitNumber: Ember.computed.reads('appindexController.internalSuitnumber'),


  getSuitData : function(){
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
        if(obj.meta.total == 0){

        }else{
          for(var i=0;i<obj.suitjudges.length;i++ ){
            self.set("judgeInfo.id",obj.suitjudges[i].id)
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
        self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Judges")
      }
    });
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
    judgeName : "",
    judgeEmail : "",
    judgeAddress : "",
    judgeContact1 : "",
    court : "",
    courtNumber:""
  },

  judgesArray :Ember.A([]),

  pushJudge : function(){
    var judgeInfo  = {
      index : this.get("judgesArray").length,
      judgeId :this.get("judgeInfo.judgeContact1"),
      suitnumber :this.get("suitnumber"),
      fullname :this.get("judgeInfo.judgeName"),
      email :this.get("judgeInfo.judgeEmail"),
      court :this.get("judgeInfo.court"),
      courtnumber :this.get("judgeInfo.courtNumber"),
      address : this.get("judgeInfo.judgeAddress"),
      phone : this.get("judgeInfo.judgeContact1")

    }

    this.get("judgesArray").pushObject(judgeInfo);
  },

  clearForm: function(){
    this.set("judgeInfo.judgeName",""),
      this.set("judgeInfo.judgeEmail",""),
      this.set("judgeInfo.judgeAddress",""),
      this.set("judgeInfo.judgeContact1",""),
      this.set("judgeInfo.court","")
      this.set("judgeInfo.courtNumber","")
  },

  saveData : function(){
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
        //self.clearForm();
        self.notify.success("Judge added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add Judge - try again")
      }
    });
  },

  actions : {
    didTransition: function() {
      alert(this.get("suitNumber"))
      return true;
    },

    addAnother : function(){
      var validate = $("#addJudge").parsley();
      if(validate.validate() == true){
        this.saveData()
      }else{
        this.notify.error("Please Fix Errors")
      }
      // this.transitionTo("suits.plaintiffs")
    }

  }
});
