import Ember from 'ember';

function generateId(){
  return Math.floor(100000 + Math.random() * 900000);
};
function generateEmailCode(){
  return Math.floor(100000 + Math.random() * 900000);
};

export default Ember.Controller.extend({

  //ApiUrl : "http://localhost:8888/lacerapi/index.php/", //local
  ApiUrl : "http://104.131.190.2/lacerapi/index.php/",//live

  me : Ember.TextField.reopen({
    attributeBindings: ['data-parsley-type',"data-parsley-minlength","data-parsley-maxlength"]
  }),

  //hides or shows register form based on correct code
  enterPhoneView : "showView",//step one
  verifyCodeView : "hideView",////step three
  activeCodeView : "hideView",//step three

  formStatus:"true",
  //
  phoneInfo : {
    phone:"",
    code:"",
    status:"inactive"
  },

  //user details for registration
  UserPhone : "",

  registerDetails : {
    email : "",
    phone :"",
    fullname : "",
    password : "",
    emailcode:generateEmailCode(),
    position : "Select Position"
  },
  userPosition :["Select Position","Judge","Lawyer"],

  saveRegCode :function(){
    this.set("phoneInfo.code",generateId());
    this.set("phoneInfo.status","inactive");
      var that = this
    console.log(this.get("ApiUrl"))
      $.ajax({
        url: this.get("ApiUrl")+"/users/regcode", //live
        //url: "http://localhost:8888/lacerapi/index.php/users/regcode", //live
        data:this.get("phoneInfo"),
        type: 'POST',
        success: function(response) {

          var obj = JSON.parse(response)
          if(obj.meta.code == "422"){
            //means reg code already set and we just need to send sms with that code
            var regCode = obj.meta.regCode;
            var phone = obj.meta.phone;

            //lets send the sms
            //lets send the sms
             that.sendSms(phone,regCode);
            //Switch Views
            that.set("verifyCodeView","showView")
            that.set("enterPhoneView","hideView")
            that.set("activeCodeView","hideView")
            //reset code
            that.set("phoneInfo.code","");
          }
          if(obj.meta.code == "401"){
            //means phone number has already been registered with Lacer
            var phone = obj.meta.phone;
            that.notify.info(phone + " is Already registered with Lacer, please login or recover forgotten information ");
          }
          if(obj.meta.code == "201"){
            //means we have saved reg code and can send sms
            var regCode = obj.meta.regCode;
            var phone = obj.meta.phone;

            //lets send the sms
            that.sendSms(phone,regCode);
            that.set("verifyCodeView","showView")
            that.set("enterPhoneView","hideView")
            that.set("activeCodeView","hideView")

            //reset code
            that.set("phoneInfo.code","");
          }
        },
        error: function (model, response) {
          console.log("error");
          console.log(response);
        }
      });
  },
  //sendSms :function(phone,code){
  //  //smsIP :"https://api.smsgh.com/v3/messages/send?From=Unity&To=%2B233207598163&Content=kankam%2C+rules&ClientId=bqxobszk&ClientSecret=ulesilvi&RegisteredDelivery=true",
  //  var smsIP  = "https://api.smsgh.com/v3/messages/send?";
  //  var from ="LACER";
  //  var  appId ="bqxobszk";
  //  var  secretKey = "ulesilvi"
  //  var registerMsg = "your%2registration%2verification%2code%2is%2"
  //  var that = this
  //  $.ajax({
  //    //url: this.get("ApiUrl")+"/users/regcode", //live
  //    url: smsIP+"From="+from+"&To=%2B233"+phone+"&Content="+registerMsg+code+"&ClientId="+appId+"&ClientSecret="+secretKey+"&RegisteredDelivery=true",
  //    type: 'GET',
  //    success: function(response) {
  //      console.log(response)
  //    },
  //    error: function (model, response) {
  //      console.log("error");
  //      console.log(response);
  //    }
  //  });
  //},

  sendSms :function(phone,code){
    var self = this
    var smsIP  = "http://41.77.66.36/bulksms/api/sendsms?";
    var from ="LACER";
    var  appId ="d7b85985-945e-4891-bfa4-01eb15bc0c52";
    var  secretKey = "12345"
    var registerMsg = "Your Lacer registration verification code is "+code;
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
          self.notify.success("Sms Sent")
        }else{
          self.notify.error("unable to send sms")
        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Notifications")
      }
    });
  },



  checkRegCode :function(){
    var code = this.get("phoneInfo.code")
    var that = this
      $.ajax({
        url: "http://localhost:8888/lacerapi/index.php/users/regcode/" + code,//live
        type: 'GET',
        success: function(response) {
          var obj = JSON.parse(response)
          console.log(obj);
          if(obj.meta.code == "201"){
            that.set("registerDetails.phone",obj.meta.phone);
            //code verification successful - we can now register fully
            that.set("verifyCodeView","hideView")
            that.set("enterPhoneView","hideView")
            that.set("activeCodeView","showView")
          }
           if(obj.meta.code == "401"){
            //code not found - invalid registration
             that.notify.error("Invalid Code Entered")
           }
          if(obj.meta.code == "400"){
            //code not found - invalid registration
             that.notify.error("Code Already Used")
           }

          },
        error: function (model, response) {
          console.log("error");
          console.log(response);
        }
      });

  },

  actions : {
    enterPhoneProceed : function(){
      var validate = $("#userPhone").parsley();
      if(validate.validate() == true){
        this.saveRegCode()
      }else{

      }
    },
    goBack : function(){
     //back to step one
      this.set("verifyCodeView","hideView")
      this.set("enterPhoneView","showView")
      this.set("activeCodeView","hideView")
    },
    codeProceed : function(){
     //back to step one
      this.set("verifyCodeView","showView")
      this.set("enterPhoneView","hideView")
      this.set("activeCodeView","hideView")
    },
    verifyCodeProceed : function(){
      var validate = $("#verifyCode").parsley();
      if(validate.validate() == true){
        this.checkRegCode()
      }else{

      }
    },

    registerMember :function(){
      var validate = $("#userRegister").parsley();
      if(validate.validate() == true){
        var that = this
        $.ajax({

          url:"http://localhost:8888/lacerapi/index.php/users/new", //live
          data:this.get("registerDetails"),
          type: 'POST',
          success: function(response) {
            var obj = JSON.parse(response)
            if(obj.meta.code == "422"){
              that.notify.error("User Already Registered")
            }else{
              that.notify.success('Registration Completed Successfully');
              that.transitionTo("logins")
            }
          },
          error: function (model, response) {
            console.log("error");
            console.log(response);
          }
        });
      }else{
        this.notify.error("Please Fix Errors")
      }
    }
  }
});
