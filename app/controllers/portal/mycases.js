import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({

  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

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

  getUserSuits : function(){
    localStorage.phone
  },

  getAllData : function(){
    var self = this;
    this.get("suitsArray").clear();
    var phone = localStorage.phone;
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"usersuits/"+phone,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.meta.total == 0){

        }else{
          if(localStorage.position == "Lawyer"){

          }
          for(var i=0;i<obj.lawyersuits.length;i++ ){
            //if(obj.suits[i].suitstatus == "active" || obj.suits[i].suitstatus == "closed") {
              self.set("suitInfo.id", obj.lawyersuits[i].id)
              self.set("suitInfo.suitnumber", obj.lawyersuits[i].suitnumber)
              self.set("suitInfo.title", obj.lawyersuits[i].title)
              self.set("suitInfo.type", obj.lawyersuits[i].type)
              var date = self.formatDate(obj.lawyersuits[i].datefiled);
              self.set("suitInfo.datefiled", date)
              self.set("suitInfo.datefiledraw", obj.lawyersuits[i].datefiled)
              self.set("suitInfo.suitaccess", obj.lawyersuits[i].suitaccess)
              self.set("suitInfo.suitstatus", obj.lawyersuits[i].suitstatus)

              self.pushSuit()
           // }
          }
         // self.set("suitsArray",self.get("suitsArray").sortBy("datefiledraw"));
        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Cases")
      }
    });
  },

  suitInfo : {
    id : "",
    suitnumber :"",
    title : "",
    type : "",
    datefiled : "",
    datefiledraw : "",
    suitaccess : "",
    suitstatus:""

  },
  suitsArray :Ember.A([]),
  sortOrder :[
    {txt:"Select One",id:""},
    {txt:"Sort By",id:"0"},
    {txt:"Date",id:"1"},
    {txt:"Suit Number",id:"2"},
    {txt:"Suit Status",id:"3"},
  ],
  sortValue :"",

  sortValueChanged: Ember.observer('sortValue', function() {
    // alert(this.get("sortValue.id"))
    if(this.get("sortValue.id") == 1){
      this.set("suitsArray",this.get("suitsArray").sortBy("datefiledraw"));
    }
    if(this.get("sortValue.id") == 2){
      this.set("suitsArray",this.get("suitsArray").sortBy("suitnumber"));
    }
    if(this.get("sortValue.id") == 3){
      this.set("suitsArray",this.get("suitsArray").sortBy("suitstatus"));
    }

  }),

  pushSuit : function(){
    var suitInfo  = {
      index : this.get("suitsArray").length,
      id :this.get("suitInfo.id"),
      suitnumber :this.get("suitInfo.suitnumber"),
      title :this.get("suitInfo.title"),
      datefiled :this.get("suitInfo.datefiled"),
      datefiledraw :this.get("suitInfo.datefiledraw"),
      type : this.get("suitInfo.type"),
      suitaccess : this.get("suitInfo.suitaccess"),
      suitstatus : this.get("suitInfo.suitstatus")
    }

    this.get("suitsArray").pushObject(suitInfo);
  },

  actions : {


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
