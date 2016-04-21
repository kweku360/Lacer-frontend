import Ember from 'ember';

export default Ember.Controller.extend({

 ////
 ApiUrlSpecial : "http://localhost:8888/lacerapi/",//local
 ApiUrl : "http://localhost:8888/lacerapi/index.php/", //local
 documentLocation : "http://localhost:8888/lacerapi/uploads/",
 pdfViewLocation : "http://localhost:8888/viewer/web/viewer.html",

  urlShortenerApiKey : "AIzaSyCRtwQSgCUFfk5ADiriEp3ufXvoi3T3KLI",

 //ApiUrl : "http://104.131.190.2/lacerapi/index.php/",//live
 //ApiUrlSpecial : "http://104.131.190.2/lacerapi/",//live
 //documentLocation : "http://104.131.190.2/lacerapi/uploads/",
 //pdfViewLocation : "http://104.131.190.2/viewer/web/viewer.html",

  authCheck : function(){
    var defer = $.Deferred();
    var self = this;
    $.ajax({
      url: this.get("ApiUrl")+"auth",
      beforeSend: function (request)
      {
        request.setRequestHeader( "Authorization", localStorage.token);
      },
      type: 'GET',
      success: function(response) {
        defer.resolve(response);
      },
      error: function (model, response) {

        self.transitionToRoute("logins");
      },
      async:   false
    });

    return defer.promise();
  },

  //i put general utility functions here
  formatDate: function(UNIX_timestamp){
    console.log(UNIX_timestamp)
    var a = new Date(UNIX_timestamp*1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ,' + month + ' ' + year;

    return time;

  },

  //SMS Server Details
  smsServer :{
    smsIP :"https://api.smsgh.com/v3/messages/send?",
    //smsIP :"https://api.smsgh.com/v3/messages/send?From=Unity&To=%2B233207598163&Content=kankam%2C+rules&ClientId=bqxobszk&ClientSecret=ulesilvi&RegisteredDelivery=true",
    from :"LACER",
    appId :"bqxobszk",
    secretKey : "ulesilvi"
  },

  //Message Templates
  smsTemplate:{
    registerMsg : "your%2C+registration%2C+verification%2C+code%2C+is%2C+",
    documentProcessText1: "New%2C+process%2C+added%2C+to%2C+Suit%2C+No.%2C+",
    documentProcessText2: "View%2C+document%2C+at"
  },

  shortenUrl : function(){

  },


  active : "active",
  actions : {

  }
});
