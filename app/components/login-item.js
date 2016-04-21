import Ember from 'ember';

export default Ember.Component.extend({
  //set upp application controller
 // applicationController: Ember.inject.controller('application'),
  ApiUrl:"",

  loginDetails : {
    email : "",
    password : ""
  },
  errorView : "hideView",
  spinnerView : "hideView",
  actions : {

    memberLogin : function(){
      var that = this
      //show spinner
      that.set("errorView","showView")
      that.set("errorView","hideView")
      $.ajax({
        url:this.get("ApiUrl")+"users/token",
        data:this.get("loginDetails"),
        type: 'POST',
        success: function(response) {
          console.log("success");
          console.log(response);
          var obj = JSON.parse(response)
          console.log("obj");
          console.log(obj);
          if(obj.meta.code == "401"){
            that.set("errorView","showView")
          }else{
            localStorage.token = obj.meta.code
            localStorage.name = obj.meta.fullname
            localStorage.position = obj.meta.position
            localStorage.phone = obj.meta.phone
            if(obj.meta.position == "Lawyer"){
              that.sendAction('portal');
            }else{
              that.sendAction('registrar');
            }

            console.log(localStorage.phone)
          }
        },
        error: function (model, response) {
          console.log("error");
          console.log(response);
        }
      });


    }
  }
});
