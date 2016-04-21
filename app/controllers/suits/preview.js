/**
 * Created by Kweku Kankam on 9/8/15.
 */
import Ember from 'ember';

function generateId(){
  return Math.floor(100000 + Math.random() * 900000);
};
var myNewSuit = "";

//i put general utility functions here
function formatDate(UNIX_timestamp){
  var a = new Date(UNIX_timestamp*1000);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ', ' + month + ' ' + year;

  return time;

}

export default Ember.Controller.extend({
  newSuitController: Ember.inject.controller('suits.new'),
  newSuit: Ember.computed.reads('newSuitController.caseInfo'),

  newPlaintiffController: Ember.inject.controller('suits.plaintiffs'),
  newPlaintiffArray: Ember.computed.reads('newSuitController.plaintiffArray'),

  newDefendantController: Ember.inject.controller('suits.defendants'),
  newDefendantArray: Ember.computed.reads('newSuitController.defendantArray'),

  newLawyerController: Ember.inject.controller('suits.addlawyer'),
  newLawyerArray: Ember.computed.reads('newSuitController.lawyersArray'),

  newDocumentController: Ember.inject.controller('suits.adddocument'),
  newDocumentArray: Ember.computed.reads('newSuitController.documentArray'),

  newJudgeArray: Ember.computed.reads('newSuitController.judgesArray'),

  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),





  //here we get the formatted date
  caseDate : Ember.computed("newSuit.caseDate",function() {
  return formatDate(this.get("newSuit.caseDate"));}),

  clearSuit: function(){
    this.set("newSuit.caseNumber",""),
      this.set("newSuit.caseType","Select One"),
      this.set("newSuit.caseDate",""),
      this.set("newSuit.caseTitlePlaintiff",""),
      this.set("newSuit.caseTitleDefendant",""),
      this.set("newSuit.caseCourt",""),
      this.set("newSuit.caseAccess","")
  },

  actions : {
    proceed : function(){
      var validate = $("#addLawyer").parsley();
      if(validate.validate() == true){
        this.pushLawyer();
        this.transitionTo("suits.defendants")
      }else{
        this.notify.error("Please Fix Errors")
      }
    },
    back : function(){
      this.transitionTo("suits.new")
    },
    saveInfo : function(){

      //lets clear variables
      //  this.get("newLawyerArray").clear();
      //  this.get("newDocumentArray").clear();



     this.addPlaintiff();
     this.addDefendant();
     this.addLawyer();

    this.addDocument()
     if(this.get("newJudgeArray").length != 0){
       this.addJudge()
     }
       this.addSuitInfo();
   }

  },

  addDefendant : function(){
    var self = this
    var arrayLength = this.get("newDefendantArray").length;
    for (var i = 0; i < arrayLength; i++) {
      this.get("newDefendantArray")[i].suitnumber = this.get("newSuit.caseNumber")
      //console.log(this.get("newDefendantArray")[i]) ;
      $.ajax({
        url: this.get("ApiUrl")+"defendants",
        data:this.get("newDefendantArray")[i],
        type: 'POST',
        success: function(response) {
          var obj = JSON.parse(response)
          // console.log(obj);
          // self.notify.success("Defendant added successfully")
          self.get("newDefendantArray").clear();
          console.log("Defendant added successfully")
        },
        error: function (model, response) {
          self.notify.error("Unable to add Defendant - try again")
        }
      });
    }
  },
  addJudge : function(){
    var self = this;
    var arrayLength = this.get("newJudgeArray").length;
    for (var i = 0; i < arrayLength; i++) {

      $.ajax({
        url: this.get("ApiUrl")+"suitjudges",
        data:this.get("newJudgeArray")[i],
        type: 'POST',
        success: function(response) {
          var obj = JSON.parse(response)
          self.get("newJudgeArray").clear()
          console.log("Judge added successfully");
          // self.notify.success("Judge added successfully")

        },
        error: function (model, response) {
          console.log("Unable to add Judge - try again");
         // self.notify.error("Unable to add Judge - try again")
        }
      });
    }
  },

  addPlaintiff : function(){
    var self = this;
    var arrayLength = this.get("newPlaintiffArray").length;
    for (var i = 0; i < arrayLength; i++) {
    this.get("newPlaintiffArray")[i].suitnumber = this.get("newSuit.caseNumber")
     //console.log(this.get("newPlaintiffArray")[i]) ;
      $.ajax({

        url: this.get("ApiUrl")+"plaintiffs",
        data:this.get("newPlaintiffArray")[i],
        type: 'POST',
        success: function(response) {
          var obj = JSON.parse(response)
          //console.log(obj);
          self.get("newPlaintiffArray").clear();
          console.log("plaintiff added successfully")

        },
        error: function (model, response) {
          console.log("Unable to add plaintiff - try again")
          self.notify.error("Unable to add plaintiff - try again")
        }
      });
    }
  },

  addSuitInfo :function(){
    var suit = {
      suitnumber : this.get("newSuit.caseNumber"),
      type : this.get("newSuit.caseType"),
      datefiled : this.get("newSuit.caseDate"),
      title : this.get("newSuit.caseTitlePlaintiff")+" vs " + this.get("newSuit.caseTitleDefendant"),
   //   suitstatus : this.get("newSuit.suitStatus"),
      suitstatus : "pending",
      suitaccess : this.get("newSuit.caseAccess"),
      suitcourt : this.get("newSuit.caseCourt")
    }
    var self =this;
    $.ajax({
      url: this.get("ApiUrl")+"suits",
      data:suit,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.meta.code == "422"){
          self.notify.error("Case Number Already Exists")
        }else{
          self.notify.success("Case added successfully");
          self.clearSuit();
          self.transitionTo("suits.index")
         }
      },
      error: function (model, response) {
        self.notify.error("Unable to add Case - try again")
      }
    });
  },

  getShortLink : function(linkurl,obj){
    var self = this;
    //Finally loop through document array
    var arrayLength = this.get("newDocumentArray").length;
    var data = {"longUrl": linkurl}

      $.ajax({
        url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCRtwQSgCUFfk5ADiriEp3ufXvoi3T3KLI",
        data:'{ longUrl: "' + linkurl +'"}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
       // dataType: 'json',
        success: function(response) {
          console.log("ShortLink retrieved "+response.id)
          self.updateDocument(response.id,obj.meta.id);
        },
        error: function (model, response) {
          console.log(response);
          console.log("unable to get Short Link");
        }

      });

  },
  addDocument : function(){
    var self = this;
    //Finally loop through document array
    var arrayLength = this.get("newDocumentArray").length;
    for (var i = 0; i < arrayLength; i++) {
     // {{pdfViewLocation}}?file={{documentLocation}}/{{code}}
      var link =  this.get("newDocumentArray")[i].pdfViewLocation+"?file="+this.get("newDocumentArray")[i].documentLocation+"/"+this.get("newDocumentArray")[i].code;
      $.ajax({
        url: this.get("ApiUrl")+"documents",
        data:this.get("newDocumentArray")[i],
        type: 'POST',
        success: function(response) {
          var obj = JSON.parse(response)
          console.log("document added successfully");
          this.get("newDocumentArray").clear();
          //now we get shortcut link
          self.getShortLink(link,obj)
          //  self.notify.success("document added successfully")
        },
        error: function (model, response) {
          //self.notify.error("Unable to add document")
          console.log("Unable to add document");
        }
      });
    }
  },
  updateDocument : function(link,id){
    var self = this;
    //Finally loop through document array
  var data = {
    "link" : link
  }
      $.ajax({
        url: this.get("ApiUrl")+"documents/"+id,
        data:data,
        type: 'PUT',
        success: function(response) {
          var obj = JSON.parse(response)

          console.log("Document Updated Successfully");
        },
        error: function (model, response) {
          //self.notify.error("Unable to add document")
          console.log("unable to update document with shortlink");

        }
      });

  },

  addLawyer : function(){
    var arrayLength = this.get("newLawyerArray").length;
    for (var i = 0; i < arrayLength; i++) {
      console.log(this.get("newLawyerArray")[i]);
      if(this.get("newLawyerArray")[i].registertype == "unregistered"){
        this.addUnregisteredLawyer(i);
      }else{

        var suitlawyer = {
          suitnumber :this.get("newSuit.caseNumber"),
          lawyerid : this.get("newLawyerArray")[i].lawyerContact1,
          fullname : this.get("newLawyerArray")[i].lawyerName,
          lawyertype : this.get("newLawyerArray")[i].lawyertype,
          registertype : this.get("newLawyerArray")[i].registertype,
          phone : this.get("newLawyerArray")[i].lawyerContact1
        }
        this.addSuitLawyer(suitlawyer);

      }

    }

  },
  addUnregisteredLawyer : function(i){
    var self = this;
    var lType = this.get("newLawyerArray")[i].lawyertype
    var rType = this.get("newLawyerArray")[i].registertype
    var lawfirmName = this.get("newLawyerArray")[i].lawfirmName
    $.ajax({
      url: this.get("ApiUrl")+"unregisteredlawyers",
      data:this.get("newLawyerArray")[i],
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        var suitlawyer = {
          suitnumber :self.get("newSuit.caseNumber"),
          lawyerid : obj.unregisteredlawyer.lawyerid,
          fullname : obj.unregisteredlawyer.fullname,
          lawfirmName : lawfirmName,
          lawyertype : lType,
          registertype : rType,
          phone : obj.unregisteredlawyer.lawyernumber
        }
       self.addSuitLawyer(suitlawyer)
      },
      error: function (model, response) {
        self.notify.error("Unable to add Lawyer")
      }
    });
  },
  addSuitLawyer : function(lawyerObj){
  var self = this
    $.ajax({
      url: this.get("ApiUrl")+"suitlawyers",
      data:lawyerObj,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log("Lawyer added successfully");
        self.get("newLawyerArray").clear();
        // self.notify.success("Lawyer added successfully")
      },
      error: function (model, response) {
        //self.notify.error("Unable to add Suit Lawyer")
        console.log("Unable to add Suit Lawyer")
      }
    });
  }

});
