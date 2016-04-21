import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({
  //i put general utility functions here
  formatDate: function(UNIX_timestamp){
    var a = new Date(UNIX_timestamp*1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var ampm = (hour >= 12) ? "PM" : "AM";
    var time = date + ',' + month + ' ' + year + ' '+ hour + ':' + min + ' ' + sec + " "+ampm;

    return time;

  },
  queryParams: ['notid'],
  notid: "",
  //lets intect  controllers
  appindexController: Ember.inject.controller('manage.index'),
  suitNumber: Ember.computed.reads('appindexController.internalSuitnumber'),

notStatus : "No Active Notifications",
  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  viewSwitch : {
    loadingImg : "hideView",
    authbtn : "hideView",
    statusmsg : ""
  },
  formatRecipients : function(recipient){
    //console.log(recipient)
    var recipientList = recipient.trim().split(",")
    var finalList = ""
    for(var i=0;i<recipientList.length;i++ ){
      //ignore last one
      if(i == recipientList.length-1){

      }else{
        recipientList[i] = "+233 "+recipientList[i]
        finalList = finalList +recipientList[i]+" , "
      }

    }
    //console.log(finalList)
    return finalList;
  },

      getData: function(){
    var self = this;
        this.get("notificationDetailsArray").clear()
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"notificationdetail/"+this.get("notid"),
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.notifications == "{}"){
        // self.transitionToRoute("manage")
        }else{
          for(var i=0;i<obj.notifications.length;i++ ){
            self.set("notificationDetail.id",obj.notifications[i].id)
            self.set("notificationDetail.phone",obj.notifications[i].suitnumber)
            self.set("notificationDetail.notificationid",obj.notifications[i].notificationid)
            self.set("notificationDetail.msgstatus",obj.notifications[i].msgstatus)
            self.set("notificationDetail.msgtxt",obj.notifications[i].msgtxt)
            self.set("notificationDetail.messageid",obj.notifications[i].messageid)
            self.set("notificationDetail.timesent",self.formatDate(obj.notifications[i].timesent))

            self.pushNotifications();
          }
        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Notification")
      }
    });
  },
  notificationDetail : {
    id : "",
    phone : "",
    notificationid : "",
    msgstatus : "",
    msgtxt : "",
    timesent : "",
    messageid : "",
    resendbtn : ""

},
  notificationDetailsArray : Ember.A([]),

  pushNotifications : function(){
    var notifications  = {
      index : this.get("notificationDetailsArray").length,
      id : this.get("notificationDetail.id"),
      suitnumber :this.get("notificationDetail.phone"),
      msgstatus :this.get("notificationDetail.msgstatus"),
      msgtxt :this.get("notificationDetail.msgtxt"),
      messageid :this.get("notificationDetail.messageid"),
      timesent :this.get("notificationDetail.timesent")
   }

    this.get("notificationDetailsArray").pushObject(notifications);
  },

  sendSms :function(phone,processtype,caseno,filer,url,notid){
    var self = this
    var smsIP  = "http://41.77.66.36/bulksms/api/sendsms?";
    var from ="LACER";
    var  appId ="d7b85985-945e-4891-bfa4-01eb15bc0c52";
    var  secretKey = "12345"
    var registerMsg = "the process "+processtype+" for case has been filed by "+filer+" visit "+url+" to view";
    var registerMsg = encodeURIComponent(registerMsg)
    var that = this
    var smsurl = smsIP+"appid="+appId+"&secretkey="+secretKey+"&to="+phone+"&text="+registerMsg
    var data = {
      smsUrl : smsurl
      //smsUrl : encodeURIComponent(smsurl)
    }
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"smssender",
      data : data,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.Status == "0000"){
          self.saveNotificationDetail(notid,"success",obj.MessageId,phone,obj.Response)
        }else{
           self.saveNotificationDetail(notid,"error","0",phone,obj)
        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Notifications")
      }
    });
  },

  saveNotificationDetail : function(notificationId,msgstatus,msgid,phone,msgtxt){

      var self = this;
      var data = {
      suitnumber : "",
      notificationid : notificationId,
      msgstatus : msgstatus,
      msgtxt : msgtxt,
      messageid : msgid
    }
      $.ajax({
        //url: "http://localhost:8888/lacerapi/index.php/users/token",
        url: this.get("ApiUrl")+"notificationdetail",
        data : data,
        type: 'POST',
        success: function(response) {
          var obj = JSON.parse(response)
          console.log(obj);
          console.log("notification detail Added")
        },
        error: function (model, response) {
          // self.notify.error("Unable to Retrieve Notifications")
          console.log("unable to add notification detail")
        }
      });

  },


 actions : {
   didTransition: function() {
    alert(this.get("suitNumber"))
     return true;
   },


   back : function(){

     // this.transitionTo("suits.plaintiffs")
    },
   sendsms : function(a){
      var not = this.get("notificationsArray").objectAt(a);
      var recipientlist = not.recipients.trim().split(",")
     //this.get("notificationsArray").objectAt(a).set("authbtn","hideView")
     console.log(recipientlist.length);
     for(var i=0;i<recipientlist.length;i++ ){
       console.log(recipientlist[i]);
      if(recipientlist[i].length == 9){
        //first we generate a correct international number
        var phone = "233"+recipientlist[i]
        //now we can send sms
        this.sendSms(phone,not.type,not.suitnumber,not.filer,not.link,not.id)
       }else{
       }
    }
     //we can now authorize notification
     this.updateData(not.id)
    // this.get("notificationsArray").objectAt(a).set("status","authorized")
   }

}
});

//http://41.77.66.36/bulksms/api/sendsms?appid=d7b85985-945e-4891-bfa4-01eb15bc0c52&secretkey=12345&to=233268886155&text=hi lacer once again
//smsIP :"https://api.smsgh.com/v3/messages/send?From=Unity&To=%2B233207598163&Content=kankam%2C+rules&ClientId=bqxobszk&ClientSecret=ulesilvi&RegisteredDelivery=true",
