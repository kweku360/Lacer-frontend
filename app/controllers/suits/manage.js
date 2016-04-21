import Ember from 'ember';


export default Ember.Controller.extend({


  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

 suitNumber : "",
 internalSuitnumber : "",
  visualStatus : "hideView",
  showPlaintiffs : function(){
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"plaintiffs/"+this.get("suitNumber"),
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        if(obj == "{}"){

        }else{
          console.log(obj);
        }
      },
      error: function (model, response) {
        self.notify.error("Unable to add suit - try again")
      }
    });
  },
  showDefendants : function(){
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"defendants/"+this.get("suitNumber"),
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        if(obj == "{}"){

        }else{
          console.log(obj);
        }
      },
      error: function (model, response) {
      //  self.notify.error("")
      }
    });
  },
  showDefendants : function(){
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"defendants/"+this.get("suitNumber"),
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        if(obj == "{}"){

        }else{
          console.log(obj);
        }
      },
      error: function (model, response) {
      //  self.notify.error("")
      }
    });
  },
 actions : {
    findSuit : function(){
      var self = this;
      $.ajax({
        //url: "http://localhost:8888/lacerapi/index.php/users/token",
        url: this.get("ApiUrl")+"suits/"+this.get("suitNumber"),
        type: 'GET',
        success: function(response) {
          var obj = JSON.parse(response)
          console.log(obj);
          console.log(response);
          if(obj.suits == "{}"){
            self.notify.error("Wrong Suit Number  - please enter again")
            self.set("internalSuitnumber",this.get("suitNumber"))
            self.transitionToRoute("manage.info")
          }else{
           // self.showPlaintiffs();
            self.showDefendants();
            self.showDefendants();

          }
        },
        error: function (model, response) {
          self.notify.error("Please Enter a Suit Number")
        }
      });
    }

  }
});
