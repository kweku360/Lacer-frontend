import Ember from 'ember';




export default Ember.Controller.extend({
  newSuitController: Ember.inject.controller('suits.new'),
  newSuit: Ember.computed.reads('newSuitController.suitInfo'),
  newPlaintiffController: Ember.inject.controller('suits.plaintiffs'),
  newPlaintiff: Ember.computed.reads('newPlaintiffController.plaintiffInfo'),

  defendantsInfo : {
    defendantName : "",
    defendantAddress : "",
    defendantContact : ""
   },

  //this function takes a date object and returns a timestamp value
  getTimeStamp : function(datestring){
    var myDate=datestring;
    myDate=myDate.split("-");
    var newDate=myDate[1]+","+myDate[0]+","+myDate[2];
    var tstamp = new Date(newDate).getTime();
    //console.log(tstamp)
    return tstamp

  },


 actions : {
   addPlaintiffs : function(){

     this.transitionTo("suits.plaintiffs")
   },



    saveInfo : function(){
      //lets save suit information
      var suit = this.store.createRecord("suits",{
        suitnumber : this.get("newSuit.suitNumber"),
        type : "Writ of Summons",
        datefiled : this.getTimeStamp(this.get("newSuit.suitDate")),
        suitstatus : this.get("newSuit.suitStatus"),
        suitaccess : this.get("newSuit.suitAccess"),
        dateofadjournment : 0
      })
      console.log(suit);
      suit.save();

    }
  }
});
