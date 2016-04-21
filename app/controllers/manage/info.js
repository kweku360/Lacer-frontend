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
  //lets intect  controllers
  appindexController: Ember.inject.controller('manage.index'),
 // suitNumber: "BD/450",//Ember.computed.reads('appindexController.internalSuitnumber'),
  suitNumber: Ember.computed.reads('appindexController.internalSuitnumber'),


  //set upp application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),
  ApiUrlSpecial: Ember.computed.reads('applicationController.ApiUrlSpecial'),

  documentLocation: Ember.computed.reads('applicationController.documentLocation'),
  pdfViewLocation: Ember.computed.reads('applicationController.pdfViewLocation'),

  getData : function(){
    this.getSuitData()
    this.getPlaintiffData()
    this.getDefendantData()
   // this.getLawyerData()
  //  this.getJudgeData()
    this.getDocumentData()
    this.getLawyerListData()
  },

  getSuitData : function(){
    var self = this;
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suits/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.suits == "{}"){
         self.transitionToRoute("manage")
        }else{
          self.set("suitInfo.suitNumber",obj.suits.suitnumber)
          self.set("suitInfo.suitTitle",obj.suits.title)
          self.set("suitInfo.suitType",obj.suits.type)
          var date = self.formatDate(obj.suits.datefiled);
          self.set("suitInfo.suitDate",date)
          self.set("suitInfo.suitAccess",obj.suits.suitaccess)
          self.set("suitInfo.suitStatus",obj.suits.suitstatus)
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

  //Plaintiff Stuff

  getPlaintiffData : function(){
    var self = this;
    this.get("plaintiffArray").clear();
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"plaintiffs/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
         // self.transitionToRoute("suits.review")
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
        self.clearPlaintiff()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },
  plaintiffState : {
    addnew :"showView",
    form :"hideView"
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
  me : Ember.TextField.reopen({
    attributeBindings: ['data-parsley-type',"data-parsley-minlength","data-parsley-maxlength"]
  }),

  plaintiffArray : Ember.A([]),

  clearPlaintiff: function(){
    this.set("plaintiffInfo.plaintiffId",""),
      this.set("plaintiffInfo.plaintiffName",""),
      this.set("plaintiffInfo.plaintiffAddress",""),
      this.set("plaintiffInfo.plaintiffContact1",""),
      this.set("plaintiffInfo.plaintiffContact2","")
  },

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

  savePlaintiffData : function(){
    var self = this;
    this.pushPlaintiff();
    var position = this.get("plaintiffArray").length - 1
    $.ajax({
      url: this.get("ApiUrl")+"plaintiffs",
      data:this.get("plaintiffArray").objectAt(position),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);

        self.clearPlaintiff();
        self.notify.success("plaintiff added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add plaintiff - try again")
      }
    });
  },

  deletePlaintiffData : function(id, pos){
    var self = this;
    $.ajax({
      url: this.get("ApiUrl")+"plaintiffs/"+ id,
      type: 'DELETE',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.code == 200){
          self.getPlaintiffData();
          self.notify.info("Plaintiff Removed")
        }else{
          self.notify.info("Unable to Remove Plaintiff")
        }
      },
      error: function (model, response) {
        self.notify.error("Unable To delete Now")
      }
    });
  },


  //Defendant Sttuff
  getDefendantData : function(){
    var self = this;
    this.get("defendantArray").clear();
    var res = encodeURIComponent(this.get("suitNumber"));
    $.ajax({
      url: this.get("ApiUrl")+"defendants/"+res,
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
          //self.transitionToRoute("suits.review")
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

  defendantState : {
    addnew :"showView",
    form :"hideView"
  },

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

  //Lawyer stuff
  getLawyerListData : function(){
    var self = this;
    this.get("lawyersArray").clear();
    this.get("defendantLawyersArray").clear();
    this.get("plaintiffLawyersArray").clear();
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
          // self.transitionToRoute("suits.review")
        }else{
          for(var i=0;i<obj.suitlawyers.length;i++ ){
            self.set("lawyerInfo.lawyerId",obj.suitlawyers[i].id)
            self.set("lawyerInfo.suitNumber",obj.suitlawyers[i].suitnumber)
            self.set("lawyerInfo.lawyerName",obj.suitlawyers[i].fullname)
            self.set("lawyerInfo.lawyerType",obj.suitlawyers[i].type)
            self.set("lawyerInfo.lawyerAddress",obj.suitlawyers[i].address)
            self.set("lawyerInfo.lawyerEmail",obj.suitlawyers[i].email)
            self.set("lawyerInfo.lawyerContact1","0"+obj.suitlawyers[i].phone1)
            self.set("lawyerInfo.lawyerContact2","0"+obj.suitlawyers[i].phone2)
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
    lawyerType : "",
    registertype:"",
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : "",
    lawFirmName:"",
    lawFirmContact:""
  },
  pLawyerInfo : {
    lawyerId :"",
    lawyerName : "",
    lawyerType : "",//plaintiff/defendant lawyer
    defendantCount:"", //counts number of plaintiff lawyers
    plaintiffCount:"", //counts number of defendant lawyers
    registerType:"",//indicates if lawyer is registed to lacer or not
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : "",
    lawFirmName:"",
    lawFirmContact:""
  },

  dlawyerInfo : {
    lawyerId :"",
    lawyerName : "",
    lawyerType : "",//plaintiff/defendant lawyer
    defendantCount:"", //counts number of plaintiff lawyers
    plaintiffCount:"", //counts number of defendant lawyers
    registerType:"",//indicates if lawyer is registed to lacer or not
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : "",
    lawFirmName:"",
    lawFirmContact:""
  },
  listPos :"",
  dlistPos :"",
  lawyersArray :Ember.A([]),
  defendantLawyersArray :Ember.A([]),
  plaintiffLawyersArray :Ember.A([]),
  lawyerState : {
    addnew :"showView",
    form :"hideView",
    list : "hideView",
    addnewdef :"showView",
    formdef :"hideView",
    listdef : "hideView"
  },
  clearDForm: function(){
    this.set("dlawyerInfo.lawyerId",""),
      this.set("dlawyerInfo.lawyerName",""),
      this.set("dlawyerInfo.lawyerType",""),
      this.set("dlawyerInfo.lawyerAddress",""),
      this.set("dlawyerInfo.lawyerEmail",""),
      this.set("dlawyerInfo.lawyerContact1",""),
      this.set("dlawyerInfo.lawyerContact2","")
      this.set("dlawyerInfo.lawFirmName","")
      this.set("dlawyerInfo.lawFirmContact","")
  },

  clearPForm: function(){
    this.set("pLawyerInfo.lawyerId",""),
      this.set("pLawyerInfo.lawyerName",""),
      this.set("pLawyerInfo.lawyerType",""),
      this.set("pLawyerInfo.lawyerAddress",""),
      this.set("pLawyerInfo.lawyerEmail",""),
      this.set("pLawyerInfo.lawyerContact1",""),
      this.set("pLawyerInfo.lawyerContact2","")
      this.set("pLawyerInfo.lawFirmName","")
      this.set("pLawyerInfo.lawFirmContact","")
  },
  lawyerList:[],
  getLawyerData : function(){
    var self = this;
    this.get("lawyersArray").clear();
    self.set("lawyerList",[])
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"lawyers",
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.meta.total == 0){

        }else{
          for(var i=0;i<obj.lawyers.length;i++ ){
            var lawyerlist = {};
            lawyerlist.id = i;
            lawyerlist.text = obj.lawyers[i].fullname;
            lawyerlist.description = '0'+obj.lawyers[i].lawyerid;
            lawyerlist.lawyerName = obj.lawyers[i].fullname;
            lawyerlist.lawyerId = obj.lawyers[i].lawyerid;
            lawyerlist.lawyerType = obj.lawyers[i].type;
            lawyerlist.registertype = "registered";
            lawyerlist.lawyerAddress = obj.lawyers[i].address;
            lawyerlist.lawyerContact1 = "0"+obj.lawyers[i].phone1;
            lawyerlist.lawyerContact2 = obj.lawyers[i].phone2;
            self.get("lawyerList").push(lawyerlist);
          }

        }
      },
      error: function (model, response) {
        self.notify.error("Unable to Retrieve Lawyers")
      }
    });
  },

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
    if(this.get("lawyerInfo.lawyerType") == "plaintiff"){
      this.get("plaintiffLawyersArray").pushObject(lawyerInfo);
    }else{
      this.get("defendantLawyersArray").pushObject(lawyerInfo);
    }
    this.get("lawyersArray").pushObject(lawyerInfo);

  },

  //judges stuff
  //getJudgeData : function(){
  //  var self = this;
  //  this.get("judgesArray").clear();
  //  var res = encodeURIComponent(this.get("suitNumber"));
  //  $.ajax({
  //    //url: "http://localhost:8888/lacerapi/index.php/users/token",
  //    url: this.get("ApiUrl")+"suitjudges/"+res,
  //    type: 'GET',
  //    success: function(response) {
  //      var obj = JSON.parse(response)
  //
  //      console.log(obj);
  //      console.log(response);
  //      if(obj.meta.total == 0){
  //
  //      }else{
  //        for(var i=0;i<obj.suitjudges.length;i++ ){
  //          self.set("judgeInfo.id",obj.suitjudges[i].id)
  //          self.set("judgeInfo.judgeId",obj.suitjudges[i].judgeid)
  //          self.set("judgeInfo.judgeName",obj.suitjudges[i].fullname)
  //          self.set("judgeInfo.judgeAddress",obj.suitjudges[i].address)
  //          self.set("judgeInfo.judgeEmail",obj.suitjudges[i].email)
  //          self.set("judgeInfo.judgeContact1",obj.suitjudges[i].phone)
  //          self.set("judgeInfo.court",obj.suitjudges[i].court)
  //          self.set("judgeInfo.courtNumber",obj.suitjudges[i].courtnumber)
  //          self.pushJudge();
  //        }
  //
  //
  //      }
  //      //lets clear form
  //      self.clearJudge()
  //    },
  //    error: function (model, response) {
  //      self.notify.error("Unable to Retrieve Judges")
  //    }
  //  });
  //},
//  judgeState : {
//    addnew :"showView",
//    form :"hideView"
//},
//
//  selectedCourt : "",
//  courts : [
//    {id:"none",txt:"Select One"},
//    {id:"Court Of Appeals",txt:"Court Of Appeals"},
//    {id:"High Court",txt:"High Court"},
//    {id:"Supreme Court",txt:"Supreme Court"},],
//  courtnumber : [
//    {id:"none",txt:"Select One"},
//    {id:"room one",txt:"room one"},
//    {id:"room two",txt:"room two"},
//    {id:"room three",txt:"room three"},],
//
//  judgeInfo : {
//    judgeName : "",
//    judgeEmail : "",
//    judgeAddress : "",
//    judgeContact1 : "",
//    court : "",
//    courtNumber:""
//  },
//
//  judgesArray :Ember.A([]),
//
//  pushJudge : function(){
//    var judgeInfo  = {
//      index : this.get("judgesArray").length,
//      judgeId :this.get("judgeInfo.judgeContact1"),
//      suitnumber :this.get("suitNumber"),
//      fullname :this.get("judgeInfo.judgeName"),
//      email :this.get("judgeInfo.judgeEmail"),
//      court :this.get("judgeInfo.court"),
//      courtnumber :this.get("judgeInfo.courtNumber"),
//      address : this.get("judgeInfo.judgeAddress"),
//      phone : this.get("judgeInfo.judgeContact1")
//
//    }
//
//    this.get("judgesArray").pushObject(judgeInfo);
//  },
//
//  clearJudge: function(){
//    this.set("judgeInfo.judgeName",""),
//      this.set("judgeInfo.judgeEmail",""),
//      this.set("judgeInfo.judgeAddress",""),
//      this.set("judgeInfo.judgeContact1",""),
//      this.set("judgeInfo.court","")
//    this.set("judgeInfo.courtNumber","")
//  },

  //Documents Stuff
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
    documentFiler:"",
    documentLink:""
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
           // self.set("documentInfo.documentFiler","")

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
       // self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },


  saveInfo : function(){
    var self = this;
    var doc = this.get("documentArray").objectAt(this.get("documentArray").length - 1);
    var link =  doc.pdfViewLocation+"?file="+doc.documentLocation+"/"+doc.code;
    $.ajax({
      url: this.get("ApiUrl")+"documents",
      data:this.get("documentArray").objectAt(this.get("documentArray").length - 1),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj)
        self.set("documentInfo.documentId",obj.meta.id)
        //we get recipients list
        self.getShortLink(link,obj)
        //
      },
      error: function (model, response) {
        self.notify.error("Unable to add document")
      }
    });
  },
  getShortLink : function(linkurl,obj){
    var self = this;
    var data = {"longUrl": linkurl}

    $.ajax({
      url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCRtwQSgCUFfk5ADiriEp3ufXvoi3T3KLI",
      data:'{ longUrl: "' + linkurl +'"}',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      // dataType: 'json',
      success: function(response) {
        console.log(response.id)
        self.getPhoneData(response.id,obj.meta.id)
        self.updateDocument(response.id,obj.meta.id);
      },
      error: function (model, response) {
        console.log(response);
        self.getPhoneData("none",obj.meta.id)
      }

    });

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

        console.log(obj);
      },
      error: function (model, response) {
        //self.notify.error("Unable to add document")
      }
    });

  },

  saveNotification : function(link,id){
    var self = this;
    var notification  = {
      suitnumber : this.get("suitNumber"),
      type : this.get("documentArray").objectAt(this.get("documentArray").length - 1).type,
      documentcode : this.get("documentArray").objectAt(this.get("documentArray").length - 1).code,
      documentid : id,
      recipients : this.get("documentInfo.documentRecipients"),
      filer : this.get("documentInfo.documentFiler"),
      link : link,
      status : "not authorized"
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

  //we also get lawyerdata - and extract the phone numbers
  getPhoneData : function(link,id){
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
        self.set("documentInfo.documentRecipients","")
        if(obj.meta.total == 0){
         // self.transitionToRoute("manage")
        }else{
          self.set("documentInfo.documentRecipients","")
          for(var i=0;i<obj.suitlawyers.length;i++ ){
            self.set("documentInfo.documentRecipients",self.get("documentInfo.documentRecipients")+obj.suitlawyers[i].phone1+",")
          }
          console.log(self.get("documentInfo.documentRecipients"))
          self.saveNotification(link,id);
        }
        //lets clear form
        //self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },



  getDocumentData : function(){
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
            self.set("documentInfo.documentLink",obj.documents[i].link)
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
  saveDefendantData : function(){
    var self = this;
    this.pushDefendant();
    var position = this.get("defendantArray").length - 1
    $.ajax({
      url: this.get("ApiUrl")+"defendants",
      data:this.get("defendantArray").objectAt(position),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);

        self.clearDefendant();
        self.notify.success("defendant added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add defendant - try again")
      }
    });
  },

  deleteDefendantData : function(id, pos){
    var self = this;
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"defendants/"+ id,
      type: 'DELETE',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        if(obj.code == 200){
          self.getDefendantData();
          self.notify.info("Defendant Removed")
        }else{
          self.notify.info("Unable to Remove Defendant")
        }
      },
      error: function (model, response) {
        self.notify.error("Unable To delete Now")
      }
    });
  },

  clearDefendant: function(){
    this.set("defendantInfo.defendantId",""),
      this.set("defendantInfo.defendantName",""),
      this.set("defendantInfo.defendantAddress",""),
      this.set("defendantInfo.defendantContact1",""),
      this.set("defendantInfo.defendantContact2","")
  },

  addSuitRegisteredLawyer : function(suitlawyer){
    $.ajax({
      url: this.get("ApiUrl")+"suitlawyers",
      data:suitlawyer,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        // self.notify.success("Lawyer added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add Suit Lawyer")
      }
    });
  },
  addUnregisteredLawyer : function(lawyer){
    var self = this;
    $.ajax({
      url: this.get("ApiUrl")+"unregisteredlawyers",
      data:lawyer,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        var suitlawyer = {
          suitnumber :self.get("suitNumber"),
          lawyerid : obj.unregisteredlawyer.lawyerid,
          fullname : obj.unregisteredlawyer.fullname,
          lawyertype : lawyer.lawyertype,
          registertype : lawyer.registertype,
          phone : obj.unregisteredlawyer.lawyernumber
        }
        self.addSuitLawyer(suitlawyer)
      },
      error: function (model, response) {
        self.notify.error("Unable to add Lawyer")
      }
    });
  },
  addSuitLawyer : function(suitlawyer){
    $.ajax({
      url: this.get("ApiUrl")+"suitlawyers",
      data:suitlawyer,
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        // self.notify.success("Lawyer added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add Suit Lawyer")
      }
    });
  },
  saveJudgeData : function(){
    var self = this;
    this.pushJudge();
    var position = this.get("judgesArray").length - 1
    $.ajax({
      url: this.get("ApiUrl")+"suitjudges",
      data:this.get("judgesArray").objectAt(position),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        //self.clearForm();
        self.notify.success("Judge added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add Judge - try again")
      }
    });
  },

  actions : {

    addJudge : function(){
      var validate = $("#addJudge").parsley();
      if(validate.validate() == true){
        this.saveJudgeData()
      }else{
        this.notify.error("Please Fix Errors")
      }
      //
    },
    addLawyerForm : function(){
      var validate = $("#addDLawyerForm").parsley();
      if(validate.validate() == true) {
        //first we push info to array
       // console.log(this.get("listPos"))
        var lawyerInfo = {
          index: this.get("lawyersArray").length,
          suitnumber: this.get("newSuit.suitNumber"),
          lawyerId: this.get("dlawyerInfo.lawyerId"),
          lawyerName: this.get("dlawyerInfo.lawyerName"),
          lawyertype: "defendant",
          registertype :"unregistered",
          lawyerEmail: this.get("dlawyerInfo.lawyerEmail"),
          lawyerAddress: this.get("dlawyerInfo.lawyerAddress"),
          lawyerContact1: this.get("dlawyerInfo.lawyerContact1"),
          lawyerContact2: this.get("dlawyerInfo.lawyerContact2"),
          lawfirmName: this.get("dlawyerInfo.lawFirmName")
        }
        this.addUnregisteredLawyer(lawyerInfo)
        this.get("defendantLawyersArray").pushObject(lawyerInfo);
        this.clearDForm();
      }else{
        this.notify.error("Please Fix Errors")
      }
    },
    addPlaintiffLawyerForm : function(){
      var validate = $("#addPLawyerForm").parsley();
      if(validate.validate() == true) {
        //first we push info to array
       // console.log(this.get("listPos"))
        var lawyerInfo = {
          index: this.get("lawyersArray").length,
          suitnumber: this.get("newSuit.suitNumber"),
          lawyerId: this.get("pLawyerInfo.lawyerId"),
          lawyerName: this.get("pLawyerInfo.lawyerName"),
          lawyertype: "plaintiff",
          registertype :"unregistered",
          lawyerEmail: this.get("pLawyerInfo.lawyerEmail"),
          lawyerAddress: this.get("pLawyerInfo.lawyerAddress"),
          lawyerContact1: this.get("pLawyerInfo.lawyerContact1"),
          lawyerContact2: this.get("pLawyerInfo.lawyerContact2"),
          lawfirmName: this.get("pLawyerInfo.lawfirmName")
        }
        this.addUnregisteredLawyer(lawyerInfo)
        this.get("plaintiffLawyersArray").pushObject(lawyerInfo);
        this.clearPForm();
      }else{
        this.notify.error("Please Fix Errors")
      }
    },

    addPlaintiffLawyerSelect : function(){
      // var selectedlawyer = this.get("listPos");
      if(this.get("listPos") == "") {
        this.notify.error("Please Select A Lawyer")
      }else{
        console.log(this.get("listPos"))
        var lawyerInfo  = {
          index : this.get("lawyersArray").length,
          suitnumber :this.get("newSuit.suitNumber"),
          lawyerId :this.get("listPos.lawyerId"),
          lawyerName :this.get("listPos.lawyerName"),
          lawyertype :"plaintiff",
          registertype :"registered",
          lawyerEmail :this.get("listPos.lawyerEmail"),
          lawyerAddress : this.get("listPos.lawyerAddress"),
          lawyerContact1 : this.get("listPos.lawyerContact1"),
          lawyerContact2 : this.get("listPos.lawyerContact2")
        }

        var suitlawyer = {
          suitnumber :this.get("suitNumber"),
          lawyerid : lawyerInfo.lawyerContact1,
          fullname : lawyerInfo.lawyerName,
          lawyertype : lawyerInfo.lawyertype,
          registertype : lawyerInfo.registertype,
          phone : lawyerInfo.lawyerContact1
        }

        this.addSuitRegisteredLawyer(suitlawyer)
        this.get("plaintiffLawyersArray").pushObject(lawyerInfo);
        this.get("lawyersArray").pushObject(lawyerInfo);
      }
    },
    addLawyerSelect : function(){
      // var selectedlawyer = this.get("listPos");
      if(this.get("dlistPos") == "") {
        this.notify.error("Please Select A Lawyer")
      }else{
        console.log(this.get("listPos"))
        var lawyerInfo  = {
          index : this.get("lawyersArray").length,
          suitnumber :this.get("newSuit.suitNumber"),
          lawyerId :this.get("dlistPos.lawyerId"),
          lawyerName :this.get("dlistPos.lawyerName"),
          lawyertype :"defendant",
          registertype :"registered",
          lawyerEmail :this.get("dlistPos.lawyerEmail"),
          lawyerAddress : this.get("dlistPos.lawyerAddress"),
          lawyerContact1 : this.get("dlistPos.lawyerContact1"),
          lawyerContact2 : this.get("dlistPos.lawyerContact2")
        }

        var suitlawyer = {
          suitnumber :this.get("suitNumber"),
          lawyerid : lawyerInfo.lawyerContact1,
          fullname : lawyerInfo.lawyerName,
          lawyertype : lawyerInfo.lawyertype,
          registertype : lawyerInfo.registertype,
          phone : lawyerInfo.lawyerContact1
        }

        this.addSuitRegisteredLawyer(suitlawyer)
        this.get("defendantLawyersArray").pushObject(lawyerInfo);
        this.get("lawyersArray").pushObject(lawyerInfo);
      }
    },


    //Plaintiff Actions
    showAddPlaintiff : function(){
      this.set("plaintiffState.addnew","hideView"),
      this.set("plaintiffState.form","showView")
    },
    cancelAddPlaintiff : function(){
      this.set("plaintiffState.addnew","showView"),
      this.set("plaintiffState.form","hideView")
    },

    addPlaintiff : function(a){
      var validate = $("#addPlaintiff").parsley();
      if(validate.validate() == true){
        this.savePlaintiffData();
      }else{
        this.notify.error("Please Fix Errors")
      }
    },
    removeOnePlaintiff : function(a){
      if(this.get("plaintiffArray").length == 1){
        this.notify.info("Cannot Remove - Case must have at least one plaintiff")
      }else{
        var pinfo = this.get("plaintiffArray").objectAt(a)
        this.deletePlaintiffData(pinfo.plaintiffId, a);
      }

    },

    //Defendant Actions
    showAddDefendant : function(){
      this.set("defendantState.addnew","hideView"),
      this.set("defendantState.form","showView")
    },
    cancelAddDefendant : function(){
      this.set("defendantState.addnew","showView"),
      this.set("defendantState.form","hideView")
    },
    addDefendant : function(a){
      var validate = $("#defendant").parsley();
      if(validate.validate() == true){
        this.saveDefendantData();
      }else{
        this.notify.error("Please Fix Errors")
      }
    },
    removeOneDefendant : function(a){
      if(this.get("defendantArray").length == 1){
        this.notify.info("Cannot Remove - Case must have at least one defendant")
      }else{
        var pinfo = this.get("defendantArray").objectAt(a)
        this.deleteDefendantData(pinfo.defendantId, a);
      }
    },


    //lawyer Actions
    showAddPlaintiffLawyer : function(){
      this.set("lawyerState.addnew","hideView"),
      this.set("lawyerState.form","showView")
    },
    showAddDefendantLawyer : function(){
      this.set("lawyerState.addnewdef","hideView"),
      this.set("lawyerState.formdef","showView")
    },
    cancelPlaintiffLawyerSelect : function(){
      this.set("lawyerState.addnew","hideView"),
      this.set("lawyerState.form","showView")
      this.set("lawyerState.list","hideView")
    },
    cancelDefendantLawyerSelect : function(){
      this.set("lawyerState.addnewdef","hideView"),
      this.set("lawyerState.formdef","showView")
      this.set("lawyerState.listdef","hideView")
    },
    lawyerPlaintiffList : function(){
      this.set("lawyerState.addnew","hideView"),
      this.set("lawyerState.form","hideView")
      this.set("lawyerState.list","showView")
    },
    lawyerDefendantList : function(){
      this.set("lawyerState.addnewdef","hideView"),
      this.set("lawyerState.formdef","hideView")
      this.set("lawyerState.listdef","showView")
    },
    cancelAddPlaintiffLawyerForm : function(){
      this.set("lawyerState.addnew","showView"),
      this.set("lawyerState.form","hideView")
      this.set("lawyerState.list","hideView")
    },
    cancelAddDefendantLawyerForm : function(){
      this.set("lawyerState.addnewdef","showView"),
      this.set("lawyerState.formdef","hideView")
      this.set("lawyerState.listdef","hideView")
    },

    //Judge Actions
    //showAddJudge : function(){
    //  this.set("judgeState.addnew","hideView"),
    //    this.set("judgeState.form","showView")
    //},
    //cancelAddJudge : function(){
    //  this.set("judgeState.addnew","showView"),
    //    this.set("judgeState.form","hideView")
    //},
    //Upload Documents Actions
    upload : function(){

      var validate = $("#addDocument").parsley();
      var validatefile = $("#uploaderForm").parsley();
      if(validate.validate() == true && validatefile.validate() == true){
        this.uploadDocument()
      }else{
        //this.notify.error("Please Fix Errors")
      }
    },

   didTransition: function() {
    alert(this.get("suitNumber"))
     return true;
   },

    gonotify : function(){

      this.transitionTo("manage.notifications")
    },
    goArchive : function(){

      this.transitionTo("manage.archive")
    }

}
});
