import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({
  //i put general utility functions here
  formatDate: function(UNIX_timestamp){
    console.log(UNIX_timestamp)
    var a = new Date(UNIX_timestamp*1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ',' + month + ' ' + year;

    return time;

  },
  //lets intect  controllers
  appindexController: Ember.inject.controller('manage.index'),
  suitNumber: Ember.computed.reads('appindexController.internalSuitnumber'),


  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  getData : function(){
    var self = this;
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suits/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.suits == "{}"){
          self.transitionToRoute("manage")
         }else{
          self.set("suitInfo.suitNumber",obj.suits.suitnumber)
          self.set("suitInfo.suitTitle",obj.suits.title)
          self.set("suitInfo.suitType",obj.suits.type)
          var date = self.formatDate(obj.suits.datefiled);
          self.set("suitInfo.suitDate",date)
          self.set("suitInfo.suitAccess",obj.suits.suitaccess)
          self.set("suitInfo.suitStatus",obj.suits.suitstatus)
        }
      },
      error: function (model, response) {
        self.notify.error("Please Enter a Suit Number")
      }
    });
  },


  suitInfo : {
    id : "",
    suitNumber :"",
    suitType : "",
    suitDate : "",
    suitTitle : "",
    suitCourt : "",
    suitAccess : "",
    suitStatus : ""
 },
  selectedCourt : "Select One",
  courts : ["","Court Of Appeals","High Court","Supreme Court"],
  accesslevel : ["","Public","Private"],

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
    }

}
});
