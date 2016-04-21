/**
 * Created by Kweku Kankam on 9/8/15.
 */
import Ember from 'ember';

function generateId(){
  return Math.floor(100000 + Math.random() * 900000);
};
var myNewSuit = "";

export default Ember.Controller.extend({
  newSuitController: Ember.inject.controller('suits.new'),
  newSuit: Ember.computed.reads('newSuitController.suitInfo'),

  newPlaintiffController: Ember.inject.controller('suits.plaintiffs'),
  newPlaintiffArray: Ember.computed.reads('newPlaintiffController.plaintiffArray'),

  newDefendantController: Ember.inject.controller('suits.defendants'),
  newDefendantArray: Ember.computed.reads('newDefendantController.defendantArray'),

  newLawyerController: Ember.inject.controller('suits.addlawyer'),
  newLawyerArray: Ember.computed.reads('newLawyerController.lawyersArray'),

  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),
  ApiUrlSpecial: Ember.computed.reads('applicationController.ApiUrlSpecial'),
  documentLocation: Ember.computed.reads('applicationController.documentLocation'),
  pdfViewLocation: Ember.computed.reads('applicationController.pdfViewLocation'),

  togglebtn : "showView",
  toggleimg : "hideView",

  documentInfo : {
    documentId :generateId(),
    documentCode :"",
    documentName : "",
    documentType : "",
    documentDate : ""
  },

  documentType :["","Statement Of Claim","Petition"],
  documentArray :Ember.A([]),


  pushDocument : function(){
    var documentInfo  = {
      index : this.get("documentArray").length,
      suitnumber :this.get("newSuit.suitNumber"),
      code :this.get("documentInfo.documentCode"),
      id :this.get("documentInfo.documentId"),
      name :this.get("documentInfo.documentName"),
      type :this.get("documentInfo.documentType"),
      datefiled : this.get("documentInfo.documentDate"),
      documentLocation : this.get("documentLocation"),
      pdfViewLocation : this.get("pdfViewLocation")

    }

    this.get("documentArray").pushObject(documentInfo);
  },
  clearForm: function(){
    this.set("documentInfo.documentId",""),
      this.set("documentInfo.documentName",""),
      this.set("documentInfo.documentType",""),
      this.set("documentInfo.documentAddress",""),
      this.set("documentInfo.documentContact1",""),
      this.set("documentInfo.documentContact2","")
  },

  clearSuit: function(){
    this.set("newSuit.suitNumber",""),
      this.set("newSuit.suitType",""),
      this.set("newSuit.suitDate",""),
      this.set("newSuit.suitTitle",""),
      this.set("newSuit.suitCourt",""),
      this.set("newSuit.suitAccess","")
  },

  removeOne : function(a){
    this.get("documentArray").removeAt(a)
    this.notify.info("value removed")
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
    removeOne : function(a){
      this.get("documentArray").removeAt(a)
      this.notify.info("value removed")
    },
    back : function(){
      this.transitionTo("suits.defendants")
    },
    goReview : function(){
      if(this.get("documentArray").length == 0) {
        this.notify.error("Please Add A Document to Suit")
      }else{
        this.transitionTo("suits.preview")
      }
    },
    upload : function(){

      var validate = $("#addDocument").parsley();
      if(validate.validate() == true){
        this.uploadDocument()
      }else{
        this.notify.error("Please Fix Errors")
      }
    },
    saveInfo : function(){
      if(this.get("documentArray").length == 0) {
        this.notify.error("Please Add A Document to Suit")
      }else{
        this.addSuitInfo();
        this.addPlaintiff();
        this.addLawyer();
        this.addDefendant();
        this.addDocument()

      //lets clear variables
        this.get("newDefendantArray").clear();
        this.get("newLawyerArray").clear();
        this.get("documentArray").clear();
        this.get("newPlaintiffArray").clear();
      //Send user to add Judge
        this.transitionTo("manage.judge")

      }
    }

  },

  uploadDocument : function(){
    var self = this;
    this.set("togglebtn","hideView")
    this.set("toggleimg","showView")
    var data = $("#uploadform")[0]
    var formData = new FormData(data);

    $.ajax({
      url: this.get("ApiUrlSpecial")+"upload.php",

      type: 'POST',
      data : formData,
      enctype: 'multipart/form-data',
      //Options to tell jQuery not to process data or worry about content-type.
      cache: false,
      contentType: false,
      processData: false,
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.meta.code == 401){
          self.notify.error(obj.meta.message)
        }else{
          self.set("documentInfo.documentCode",obj.meta.code) //we set the code as the filename
          self.pushDocument();
          self.notify.success("Document Uploaded successfully")
          self.set("togglebtn","showView")
          self.set("toggleimg","hideView")
        }
        //lets clear form
        self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  }

  //
  //addDefendant : function(){
  //  var arrayLength = this.get("newDefendantArray").length;
  //  for (var i = 0; i < arrayLength; i++) {
  //    $.ajax({
  //      url: this.get("ApiUrl")+"defendants",
  //      data:this.get("newDefendantArray")[i],
  //      type: 'POST',
  //      success: function(response) {
  //        var obj = JSON.parse(response)
  //        // console.log(obj);
  //        // self.notify.success("Defendant added successfully")
  //
  //      },
  //      error: function (model, response) {
  //        self.notify.error("Unable to add Defendant - try again")
  //      }
  //    });
  //  }
  //},
  //
  //addPlaintiff : function(){
  //  var arrayLength = this.get("newPlaintiffArray").length;
  //  for (var i = 0; i < arrayLength; i++) {
  //    $.ajax({
  //
  //      url: this.get("ApiUrl")+"plaintiffs",
  //      data:this.get("newPlaintiffArray")[i],
  //      type: 'POST',
  //      success: function(response) {
  //        var obj = JSON.parse(response)
  //        //console.log(obj);
  //        //  self.notify.success("plaintiff added successfully")
  //
  //      },
  //      error: function (model, response) {
  //        self.notify.error("Unable to add plaintiff - try again")
  //      }
  //    });
  //  }
  //},
  //
  //addSuitInfo :function(){
  //  var suit = {
  //    suitnumber : this.get("newSuit.suitNumber"),
  //    type : "Writ of Summons",
  //    datefiled : this.get("newSuit.suitDate"),
  //    title : this.get("newSuit.suitTitle"),
  //    suitstatus : this.get("newSuit.suitStatus"),
  //    suitaccess : this.get("newSuit.suitAccess"),
  //    suitcourt : this.get("newSuit.suitCourt")
  //  }
  //  var self =this;
  //  $.ajax({
  //    url: this.get("ApiUrl")+"suits",
  //    data:suit,
  //    type: 'POST',
  //    success: function(response) {
  //      var obj = JSON.parse(response)
  //      console.log(obj);
  //      if(obj.meta.code == "422"){
  //        self.notify.error("Suit Number Already Exists")
  //      }else{
  //        self.notify.success("Suit added successfully")
  //        self.clearSuit();
  //      }
  //    },
  //    error: function (model, response) {
  //      self.notify.error("Unable to add suit - try again")
  //    }
  //  });
  //},

  //addDocument : function(){
  //  //Finally loop through document array
  //  var arrayLength = this.get("documentArray").length;
  //  for (var i = 0; i < arrayLength; i++) {
  //    $.ajax({
  //      url: this.get("ApiUrl")+"documents",
  //      data:this.get("documentArray")[i],
  //      type: 'POST',
  //      success: function(response) {
  //        var obj = JSON.parse(response)
  //        console.log(obj);
  //        //  self.notify.success("document added successfully")
  //      },
  //      error: function (model, response) {
  //        self.notify.error("Unable to add document")
  //      }
  //    });
  //  }
  //},
  //
  //addLawyer : function(){
  //  var arrayLength = this.get("newLawyerArray").length;
  //  for (var i = 0; i < arrayLength; i++) {
  //    if(this.get("newLawyerArray")[i].registertype == "unregistered"){
  //      this.addUnregisteredLawyer(i);
  //    }else{
  //
  //      var suitlawyer = {
  //        suitnumber :this.get("newSuit.suitNumber"),
  //        lawyerid : this.get("newLawyerArray")[i].lawyerContact1,
  //        fullname : this.get("newLawyerArray")[i].lawyerName,
  //        lawyertype : this.get("newLawyerArray")[i].lawyertype,
  //        registertype : this.get("newLawyerArray")[i].registertype,
  //        phone : this.get("newLawyerArray")[i].lawyerContact1
  //      }
  //      this.addSuitLawyer(suitlawyer);
  //
  //    }
  //
  //  }
  //
  //},
  //addUnregisteredLawyer : function(i){
  //  var self = this;
  //  var lType = this.get("newLawyerArray")[i].lawyertype
  //  var rType = this.get("newLawyerArray")[i].registertype
  //  $.ajax({
  //    url: this.get("ApiUrl")+"unregisteredlawyers",
  //    data:this.get("newLawyerArray")[i],
  //    type: 'POST',
  //    success: function(response) {
  //      var obj = JSON.parse(response)
  //      console.log(obj);
  //      var suitlawyer = {
  //        suitnumber :self.get("newSuit.suitNumber"),
  //        lawyerid : obj.unregisteredlawyer.lawyerid,
  //        fullname : obj.unregisteredlawyer.fullname,
  //        lawyertype : lType,
  //        registertype : rType,
  //        phone : obj.unregisteredlawyer.lawyernumber
  //      }
  //     self.addSuitLawyer(suitlawyer)
  //    },
  //    error: function (model, response) {
  //      self.notify.error("Unable to add Lawyer")
  //    }
  //  });
  //},
  //addSuitLawyer : function(lawyerObj){
  //
  //  $.ajax({
  //    url: this.get("ApiUrl")+"suitlawyers",
  //    data:lawyerObj,
  //    type: 'POST',
  //    success: function(response) {
  //      var obj = JSON.parse(response)
  //      console.log(obj);
  //      // self.notify.success("Lawyer added successfully")
  //    },
  //    error: function (model, response) {
  //      self.notify.error("Unable to add Suit Lawyer")
  //    }
  //  });
  //}

});
