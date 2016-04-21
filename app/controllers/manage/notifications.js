import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({
  //i put general utility functions here
  formatDate: function(UNIX_timestamp){
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
        this.get("notificationsArray").clear()
    var res = encodeURIComponent(this.get("suitNumber"));
   // var res = encodeURIComponent("BD/450");
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"notifications/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.notifications == "{}"){
         // self.transitionToRoute("manage")
         }else{
          for(var i=0;i<obj.notifications.length;i++ ){
            self.set("notifications.id",obj.notifications[i].id)
            self.set("notifications.suitNumber",obj.notifications[i].suitnumber)
            self.set("notifications.type",obj.notifications[i].type)
            self.set("notifications.recipients",obj.notifications[i].recipients)
            self.set("notifications.recipientsFormated",self.formatRecipients(obj.notifications[i].recipients))
            console.log(self.get("notifications.recipientsFormated"))
            self.set("notifications.link",obj.notifications[i].link)
            self.set("notifications.filer",obj.notifications[i].filer)
            self.set("notifications.status",obj.notifications[i].status)
            if(obj.notifications[i].status == "not authorized"){
              self.set("notifications.authbtn","showView")
              self.set("notifications.detailbtn","hideView")
            }else{
              self.set("notifications.authbtn","hideView")
              self.set("notifications.detailbtn","showView")
            }

            self.pushNotifications();
          }
        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Notifications")
      }
    });
  },

  updateData: function(id){
    var self = this;
     var data = {
       status : "authorized"
     }
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"notifications/"+id,
      data : data,
      type: 'PUT',
      success: function(response) {
        var obj = JSON.parse(response)
        //console.log(obj);
        self.getData()//refresh table
        console.log("notification authorized")
      },
      error: function (model, response) {
       // self.notify.error("Unable to Retrieve Notifications")
        console.log("unable to Authorize notification")
      }
    });
  },



  notifications : {
    id : "",
    suitNumber :"",
    type : "",
    recipients : "",
    recipientsFormated : "", //for view purposes only
    filer : "",
    link : "",
    status : "",
    authbtn : "",
    detailbtn : ""
 },
  notificationsArray : Ember.A([]),

  pushNotifications : function(){
    var notifications  = {
      index : this.get("notificationsArray").length,
      id : this.get("notifications.id"),
      suitnumber :this.get("notifications.suitNumber"),
      type :this.get("notifications.type"),
      recipients :this.get("notifications.recipients"),
      recipientsFormated :this.get("notifications.recipientsFormated"),
      filer :this.get("notifications.filer"),
      link :this.get("notifications.link"),
      status : this.get("notifications.status"),
      authbtn : this.get("notifications.authbtn"),
      detailbtn : this.get("notifications.detailbtn")

    }

    this.get("notificationsArray").pushObject(notifications);
  },

  sendSms :function(phone,processtype,caseno,filer,url,notid){
    var self = this
    var smsIP  = "http://41.77.66.36/bulksms/api/sendsms?";
    var from ="LACER";
    var  appId ="d7b85985-945e-4891-bfa4-01eb15bc0c52";
    var  secretKey = "12345"
    var registerMsg = "the process "+processtype+" for case no. "+caseno+" has been filed by "+filer+" visit "+url+" to view";
    var registerMsg = encodeURIComponent(registerMsg)
    var that = this
    var smsurl = smsIP+"appid="+appId+"&secretkey="+secretKey+"&to=233"+phone+"&text="+registerMsg
    var data = {
      smsUrl : smsurl
      //smsUrl : encodeURIComponent(smsurl)
    }
    console.log(phone)
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"smssender",
      data : data,
      type: 'POST',
      success: function(response) {

        var obj = JSON.parse(response)
        var arrStr = obj.split(/[""]/);
       console.log(arrStr);
        if(arrStr[3] == "0000"){
          self.saveNotificationDetail(notid,caseno,"success",arrStr[7],phone,arrStr[11])
        }else{
           self.saveNotificationDetail(notid,caseno,"error","0",phone,obj)
        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Notifications")
      }
    });
  },

  saveNotificationDetail : function(notificationId,caseno,msgstatus,msgid,phone,msgtxt){

      var self = this;
      var data = {
      suitnumber : caseno,
      phone : phone,
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
      this.transitionTo("namage.info")
    },
   sendsms : function(a){
      var not = this.get("notificationsArray").objectAt(a);
      var recipientlist = not.recipients.trim().split(",")
     console.log(recipientlist);
     //this.get("notificationsArray").objectAt(a).set("authbtn","hideView")
     console.log(recipientlist.length);
     for(var i=0;i<recipientlist.length;i++ ){
      if(recipientlist[i].length == 9){
        //first we generate a correct international number
        var phone = recipientlist[i]
        //now we can send sms
        this.sendSms(phone,not.type,not.suitnumber,not.filer,not.link,not.id)
       }else{
       }
    }
     //we can now authorize notification
      this.updateData(not.id)
    // this.get("notificationsArray").objectAt(a).set("status","authorized")
   },
   showDetails : function(a){
    // this.transitionTo("manage.notificationdetail")
     this.transitionTo('manage.notificationdetail', {queryParams: {notid: a}});
   }
 }
});

//http://41.77.66.36/bulksms/api/sendsms?appid=d7b85985-945e-4891-bfa4-01eb15bc0c52&secretkey=12345&to=233268886155&text=hi lacer once again
//smsIP :"https://api.smsgh.com/v3/messages/send?From=Unity&To=%2B233207598163&Content=kankam%2C+rules&ClientId=bqxobszk&ClientSecret=ulesilvi&RegisteredDelivery=true",
