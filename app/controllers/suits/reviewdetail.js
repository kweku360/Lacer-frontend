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

  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),
  documentLocation: Ember.computed.reads('applicationController.documentLocation'),
  pdfViewLocation: Ember.computed.reads('applicationController.pdfViewLocation'),



  queryParams: ['suitid'],
  location : "http://localhost:8888/lacerapi/uploads/",
  suitid : "",
  getAllData : function(){
    this.getSuitData()
    this.getPlaintiffData()
    this.getDefendantData()
    this.getLawyerData()
    this.getDocumentData()

  },

  getSuitData : function(){
    var self = this;
    var res = encodeURIComponent(this.get("suitid"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suits/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.suits == "{}"){
          //self.transitionToRoute("suits.review")
        }else{
          self.set("suitInfo.suitNumber",obj.suits.suitnumber)
          self.set("suitInfo.suitTitle",obj.suits.title)
          self.set("suitInfo.suitType",obj.suits.type)
          var date = self.formatDate(obj.suits.datefiled);
          self.set("suitInfo.suitDate",date)
          self.set("suitInfo.suitAccess",obj.suits.suitaccess)
          self.set("suitInfo.suitStatus",obj.suits.suitstatus),
            self.set("suitInfo.suitCourt",obj.suits.suitcourt)
        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Cases")
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




  getPlaintiffData : function(){
    var self = this;
    this.get("plaintiffArray").clear();
    var res = encodeURIComponent(this.get("suitid"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"plaintiffs/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
          //self.transitionToRoute("suits.review")
        }else{
          for(var i=0;i<obj.plaintiffs.length;i++ ){
            self.set("plaintiffInfo.plaintiffId",obj.plaintiffs[i].id)
            self.set("plaintiffInfo.suitNumber",obj.plaintiffs[i].suitnumber)
            self.set("plaintiffInfo.plaintiffName",obj.plaintiffs[i].fullname)
            self.set("plaintiffInfo.plaintiffAddress",obj.plaintiffs[i].address)
            self.set("plaintiffInfo.plaintiffEmail",obj.plaintiffs[i].email)
            self.set("plaintiffInfo.plaintiffContact1",obj.plaintiffs[i].phone1)
            self.set("plaintiffInfo.plaintiffContact2",obj.plaintiffs[i].phone2)
            self.pushPlaintiff();
          }

        }
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },
  plaintiffInfo : {
    plaintiffId :"",
    plaintiffIndex :"",
    suitNumber :"",
    plaintiffName : "",
    plaintiffAddress : "",
    plaintiffContact1 : "",
    plaintiffContact2 : ""
  },
  plaintiffArray : Ember.A([]),

  pushPlaintiff : function(){
    var plaintiffInfo  = {
      index : this.get("plaintiffArray").length,
      suitnumber :this.get("suitNumber"),
      plaintiffId :this.get("plaintiffInfo.plaintiffId"),
      fullname :this.get("plaintiffInfo.plaintiffName"),
      address : this.get("plaintiffInfo.plaintiffAddress"),
      phone : this.get("plaintiffInfo.plaintiffContact1"),
      phone1 : this.get("plaintiffInfo.plaintiffContact2")
    }

    this.get("plaintiffArray").pushObject(plaintiffInfo);
  },

  getDefendantData : function(){
    var self = this;
    this.get("defendantArray").clear();
    var res = encodeURIComponent(this.get("suitid"));
    $.ajax({
      url: this.get("ApiUrl")+"defendants/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
         // self.transitionToRoute("suits.review")
        }else{
          for(var i=0;i<obj.defendants.length;i++ ){
            self.set("defendantInfo.defendantId",obj.defendants[i].id)
            self.set("defendantInfo.suitNumber",obj.defendants[i].suitnumber)
            self.set("defendantInfo.defendantName",obj.defendants[i].fullname)
            self.set("defendantInfo.defendantAddress",obj.defendants[i].address)
            self.set("defendantInfo.defendantEmail",obj.defendants[i].email)
            self.set("defendantInfo.defendantContact1",obj.defendants[i].phone1)
            self.set("defendantInfo.defendantContact2",obj.defendants[i].phone2)
            self.pushDefendant();
          }

        }

      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },

  defendantInfo : {
    defendantId :"",
    defendantIndex :"",
    suitNumber :"",
    defendantName : "",
    defendantAddress : "",
    defendantAddress : "",
    defendantContact1 : "",
    defendantContact2 : ""
  },
  defendantArray : Ember.A([]),

  pushDefendant : function(){
    var defendantInfo  = {
      index : this.get("defendantArray").length,
      suitnumber :this.get("defendantInfo.suitNumber"),
      defendantId :this.get("defendantInfo.defendantId"),
      fullname :this.get("defendantInfo.defendantName"),
      address : this.get("defendantInfo.defendantAddress"),
      phone : this.get("defendantInfo.defendantContact1"),
      phone1 : this.get("defendantInfo.defendantContact2")
    }

    this.get("defendantArray").pushObject(defendantInfo);
  },

  getLawyerData : function(){
    var self = this;
    this.get("lawyersArray").clear();
    var res = encodeURIComponent(this.get("suitid"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitlawyers/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
         // self.transitionToRoute("suits.review")
        }else{
          for(var i=0;i<obj.suitlawyers.length;i++ ){
            self.set("lawyerInfo.lawyerId",obj.suitlawyers[i].id)
            self.set("lawyerInfo.suitNumber",obj.suitlawyers[i].suitnumber)
            self.set("lawyerInfo.lawyerName",obj.suitlawyers[i].fullname)
            self.set("lawyerInfo.lawyerType",obj.suitlawyers[i].type)
            self.set("lawyerInfo.lawyerAddress",obj.suitlawyers[i].address)
            self.set("lawyerInfo.lawyerEmail",obj.suitlawyers[i].email)
            self.set("lawyerInfo.lawyerContact1",obj.suitlawyers[i].phone1)
            self.set("lawyerInfo.lawyerContact2",obj.suitlawyers[i].phone2)
            self.pushLawyer();
          }

        }
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },

  lawyerInfo : {
    lawyerId :"",
    lawyerName : "",
    lawyerType : "Plaintiff",
    registertype:"",
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : ""
  },
  lawyersArray :Ember.A([]),

  pushLawyer : function(){
    var lawyerInfo = {
      index: this.get("lawyersArray").length,
      suitnumber: this.get("newSuit.suitNumber"),
      lawyerId: this.get("lawyerInfo.lawyerId"),
      lawyerName: this.get("lawyerInfo.lawyerName"),
      lawyertype: this.get("lawyerInfo.lawyerType"),
      registertype :"unregistered",
      lawyerEmail: this.get("lawyerInfo.lawyerEmail"),
      lawyerAddress: this.get("lawyerInfo.lawyerAddress"),
      lawyerContact1: this.get("lawyerInfo.lawyerContact1"),
      lawyerContact2: this.get("lawyerInfo.lawyerContact2")
    }

    this.get("lawyersArray").pushObject(lawyerInfo);

  },


  getDocumentData : function(){
    var self = this;
    this.get("documentArray").clear()
    var res = encodeURIComponent(this.get("suitid"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"documents/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.meta.total == 0){

        }else{
          for(var i=0;i<obj.documents.length;i++ ){
            self.set("documentInfo.id",obj.documents[i].id)
            self.set("documentInfo.documentCode",obj.documents[i].code)
            self.set("documentInfo.documentName",obj.documents[i].name)
            self.set("documentInfo.documentType",obj.documents[i].type)
            var date = self.formatDate(obj.documents[i].datefiled);
            self.set("documentInfo.documentDate",date)
            self.set("documentInfo.documentAccess",obj.documents[i].accessstatus)
            self.set("documentInfo.documentLocation",self.get("location"))
            self.pushDocument()
          }

        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Cases")
      }
    });
  },

  authorizeCase : function(){
    var self = this;
    var suitstatus = "active";
    var res = encodeURIComponent(this.get("suitid"));
    $.ajax({
      url: this.get("ApiUrl")+"suits/authorize/"+res,
      data : suitstatus,
      type: 'PUT',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        self.notify.success("Case "+self.get("suitid")+" authorized")
        self.transitionTo()
      },
      error: function (model, response) {
        self.notify.error("Unable to authorized Case")
      }
    });
  },

  documentInfo : {
    documentId :"",
    documentCode :"",
    documentName : "",
    documentType : "",
    documentAccess : "",
    documentDate : "",
    documentLocation : ""
  },

  pushDocument : function(){
    var documentInfo  = {
      suitnumber :this.get("newSuit.suitNumber"),
      code :this.get("documentInfo.documentCode"),
      id :this.get("documentInfo.documentId"),
      name :this.get("documentInfo.documentName"),
      type :this.get("documentInfo.documentType"),
      datefiled :this.get("documentInfo.documentDate"),
      access : this.get("documentInfo.documentAccess"),
      location : this.get("documentInfo.documentLocation"),
      documentLocation : this.get("documentLocation"),
      pdfViewLocation : this.get("pdfViewLocation")

    }

    this.get("documentArray").pushObject(documentInfo);
  },

  documentArray :Ember.A([]),

 actions : {


   authorize : function(){
   this.authorizeCase();
    },
   cancel : function(){
   this.transitionTo("suits.review");
    }

}
});
