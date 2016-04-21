/**
 * Created by Kweku Kankam on 9/8/15.
 */
import Ember from 'ember';

function generateId(){
  return Math.floor(100000 + Math.random() * 900000);
};

export default Ember.Controller.extend({

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

  appindexController: Ember.inject.controller('manage.index'),
  suitNumber: Ember.computed.reads('appindexController.internalSuitnumber'),

  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),
  ApiUrlSpecial: Ember.computed.reads('applicationController.ApiUrlSpecial'),

  documentLocation: Ember.computed.reads('applicationController.documentLocation'),
  pdfViewLocation: Ember.computed.reads('applicationController.pdfViewLocation'),


  togglebtn : "showView",
  toggleimg : "hideView",

  documentInfo : {
    documentId :"",
    documentCode :"",
    documentName : "",
    documentType : "",
    documentDate : "",
    rawdocumentDate : "",
    documentRecipients : "",
    documentFiler:""
  },

  documentType :["","Plaintiffs Claim"],
  documentArray :Ember.A([]),

  //SWITCHES - show hide various components of app
viewSwitch : {
  selectSwitch : "hideView",
    formSwitch : "showLView",
    loadingImg : "hideView",
    uploadBtn : "showView"
},
  documentType :[
    {id:"",txt:"Select One"},
    {id:"Statement Of Claim",txt:"Statement Of Claim"},
  ],
  documentFiler :[
    {id:"",txt:"Select One"},
    {id:"Plaintiff",txt:"Plaintiff"},
    {id:"Defendant",txt:"Defendant"},
  ],




  pushDocument : function(){
    var documentInfo  = {
      suitnumber :this.get("suitNumber"),
      code :this.get("documentInfo.documentCode"),
      id :this.get("documentInfo.documentId"),
      name :this.get("documentInfo.documentName"),
      type :this.get("documentInfo.documentType"),
      datefiled : this.get("documentInfo.documentDate"),
      rawdatefiled : this.get("documentInfo.rawdocumentDate"),
      filer : this.get("documentInfo.documentFiler"),
      documentLocation : this.get("documentLocation"),
      pdfViewLocation : this.get("pdfViewLocation")

    }

    this.get("documentArray").pushObject(documentInfo);
  },

  clearForm: function(){
    this.set("documentInfo.documentId",""),
      this.set("documentInfo.documentName",""),
      this.set("documentInfo.documentType",""),
      this.set("documentInfo.documentDate",""),
      this.set("documentInfo.rawdocumentDate",""),
      this.set("documentInfo.documentAddress",""),
      this.set("documentInfo.documentContact1",""),
      this.set("documentInfo.documentContact2","")
  },

  removeOne : function(a){
    this.get("documentArray").removeAt(a)
    this.notify.info("value removed")
  },

  //Upload Document
  uploadDocument : function(){
    var self = this;
    this.set("viewSwitch.uploadBtn","hideView")
    this.set("viewSwitch.loadingImg","showView")
    var data = $("#uploaderForm")[0]
    var formData = new FormData(data);

    function modifValues(val){

      // var val = $('.downloading-progress-bar').attr('data-value');
      // if(val>=100){val=5;}
      var newVal = val*100;
      var txt = Math.floor(newVal)+'%';

      $('.downloading-progress-bar').attr('data-value',newVal);
      $('.percentage').html(txt);
      $('.downloading-progress-bar').css("width", txt);
    }

    $.ajax({
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            console.log(percentComplete);
            modifValues(percentComplete);

            //console.log("one");
            //console.log($('.progress').length);
            //$('.progress').css({
            //  width: percentComplete * 100 + '%'
            //});
            if (percentComplete === 1) {
              $('.progress').css({
                width: 0
              });
            }
          }
        }, false);
        xhr.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            console.log(percentComplete);
            console.log(percentComplete);
            console.log("two");
            console.log($('.progress').length);
            $('.progress').css({
              width: percentComplete * 100 + '%'
            });
          }
        }, false);
        return xhr;
      },
      url: this.get("ApiUrlSpecial")+"upload.php",
      type: 'POST',
      data : formData,
      enctype: 'multipart/form-data',
      //Options to tell jQuery not to process data or worry about content-type.
      cache: false,
      contentType: false,
      processData: false,
      success: function(response) {
        try{
          var obj = JSON.parse(response)
          console.log(obj);
          if(obj.meta.code == 401){
            self.notify.error(obj.meta.message)
          }else{
            self.set("documentInfo.documentCode",obj.meta.code) //we set the code as the filename
            self.set("documentInfo.documentId","")

            var date = self.formatDate(self.get("documentInfo.documentDate"));
            self.set("documentInfo.rawdocumentDate",date)
            self.pushDocument();
            self.notify.success("Document Uploaded successfully")
            self.set("viewSwitch.uploadBtn","showView")
            self.set("viewSwitch.loadingImg","hideView")

            //then we send sms notification
              self.saveInfo()
          }
        }catch(e){
          self.notify.error("Error Uploading Document")
          self.set("viewSwitch.uploadBtn","showView")
          self.set("viewSwitch.loadingImg","hideView")
        }

        //lets clear form
        self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },


  getData : function(){
    var self = this;
    this.get("documentArray").clear()
    var res = encodeURIComponent(this.get("suitNumber"));
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
            self.set("documentInfo.documentFiler",obj.documents[i].filer)
            var date = self.formatDate(obj.documents[i].datefiled);
            self.set("documentInfo.rawdocumentDate",date)
            self.set("documentInfo.documentAccess",obj.documents[i].accessstatus)
            self.set("documentInfo.documentLocation",self.get("location"))
            self.pushDocument()
          }

        }
        self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve  doc")
      }
    });
  },

  //we also get lawyerdata - and extract the phone numbers
  getSuitData : function(){
    var self = this;
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitlawyers/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
          self.transitionToRoute("manage")
        }else{
          for(var i=0;i<obj.suitlawyers.length;i++ ){
            self.set("documentInfo.documentRecipients",self.get("documentInfo.documentRecipients") + " "+ obj.suitlawyers[i].phone1)
          }
          console.log(self.get("documentInfo.documentRecipients"))
          self.saveNotification();
        }
        //lets clear form
        //self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },

  saveNotification : function(){
    var self = this;
    var notification  = {
      suitnumber : this.get("suitNumber"),
      type : this.get("documentArray").objectAt(this.get("documentArray").length - 1).type,
      documentid : this.get("documentArray").objectAt(this.get("documentArray").length - 1).code,
      recipients : this.get("documentInfo.documentRecipients"),
      status : "pending"
    }

    $.ajax({
      url: this.get("ApiUrl")+"notifications",
      data:notification,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)

        console.log(obj)
        self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("Unable to add notification")
      }
    });
  },

  saveInfo : function(){
    var self = this;
    $.ajax({
      url: this.get("ApiUrl")+"documents",
      data:this.get("documentArray").objectAt(this.get("documentArray").length - 1),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
       //we get recipients list
        self.getSuitData()
      },
      error: function (model, response) {
        self.notify.error("Unable to add document")
      }
    });
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
    goBack : function(){
      this.transitionTo("suits.defendants")
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
        //Finally loop through document array
        var arrayLength = this.get("documentArray").length;
        for (var i = 0; i < arrayLength; i++) {

        }
      }
    }

  }
});
