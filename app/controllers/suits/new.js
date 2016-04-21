import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({

  //set up application controller
  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),
  ApiUrlSpecial: Ember.computed.reads('applicationController.ApiUrlSpecial'),

  documentLocation: Ember.computed.reads('applicationController.documentLocation'),
  pdfViewLocation: Ember.computed.reads('applicationController.pdfViewLocation'),



  //first we declare scope variables
  //case
  caseInfo : {
    caseNumber :"",
    caseType : "",
    caseDate : "",
    caseTitlePlaintiff : "",
    caseTitleDefendant : "",
    caseStatus : "",
    caseCourt : "none",//default
    caseAccess : "public",
    caseOption : ""
  },
//plaintiffs
  plaintiffInfo : {
    plaintiffName : "",
    plaintiffAddress : ""
  },
  //defendants
  defendantInfo : {
    defendantName : "",
    defendantAddress : ""
  },
  //Lawyers
  dLawyerInfo : {
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
    lawFirmName:"N/A",
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
    lawFirmName:"N/A",
    lawFirmContact:""
  },
  //judge
  judgeInfo : {
    judgeName : "",
    judgeEmail : "",
    judgeContact1 : "",
    court : "",
    courtNumber:""
  },

  documentInfo : {
    documentId :"",
    documentCode :"",
    documentName : "",
    documentType : "",
    documentDate : "",
    documentRecipients : "",
    documentFiler:""
  },

  phoneRequired :"form-label--required",
  phoneNotRequired :"",
  truthy : "true",
  falsy : "false",

  //ARRAYS
  plaintiffArray : Ember.A([]),
  defendantArray : Ember.A([]),

  judgesArray :Ember.A([]),
  documentArray :Ember.A([]),

  lawyersArray :Ember.A([]),

  //SWITCHES - show hide various components of app
  viewSwitch : {
    loadingImg : "hideView",
    uploadBtn : "showView"
  },

  //extensions
  plaintiffLawyersArray :Ember.A([]),
  defendantLawyersArray :Ember.A([]),

  //ARRAY FUNCTIONS
  pushPlaintiff : function(val){
    var plaintiffInfo  = {
      index : this.get("plaintiffArray").length,
      suitnumber :this.get("caseInfo.caseNumber"),
      fullname :this.get("plaintiffInfo.plaintiffName"),
      address : this.get("plaintiffInfo.plaintiffAddress"),
      pHideClose : val
    }

    this.get("plaintiffArray").pushObject(plaintiffInfo);
  },
  pushDefendant : function(){
    var defendantInfo  = {
      index : this.get("defendantArray").length,
      defendantId :this.get("defendantInfo.defendantId"),
      suitnumber :this.get("caseInfo.caseNumber"),
      fullname :this.get("defendantInfo.defendantName"),
      address : this.get("defendantInfo.defendantAddress")
    }

    this.get("defendantArray").pushObject(defendantInfo);
  },

  pushJudge : function(){
      var judgeInfo  = {
        index : this.get("judgesArray").length,
        judgeId :this.get("judgeInfo.judgeContact1"),
        suitnumber :this.get("caseInfo.caseNumber"),
        fullname :this.get("judgeInfo.judgeName"),
        email :this.get("judgeInfo.judgeEmail"),
        court :this.get("judgeInfo.court"),
        courtnumber :this.get("judgeInfo.courtNumber"),
        phone : this.get("judgeInfo.judgeContact1")
      }

    this.get("judgesArray").pushObject(judgeInfo);
  },
  pushDocument : function(){
    var documentInfo  = {
      suitnumber :this.get("caseInfo.caseNumber"),
      code :this.get("documentInfo.documentCode"),
      id :this.get("documentInfo.documentId"),
      name :this.get("documentInfo.documentName"),
      type :this.get("documentInfo.documentType"),
      datefiled : this.get("documentInfo.documentDate"),
      filer : this.get("documentInfo.documentFiler"),
      documentLocation : this.get("documentLocation"),
      pdfViewLocation : this.get("pdfViewLocation")

    }

    this.get("documentArray").pushObject(documentInfo);
  },


  //Clear Forms
  clearPlaintiffs: function(){
      this.set("plaintiffInfo.plaintiffName",""),
      this.set("plaintiffInfo.plaintiffAddress","")
  },
  clearDefendants: function(){
      this.set("defendantInfo.defendantName",""),
      this.set("defendantInfo.defendantAddress","")
  },

  clearJudges: function(){
      this.set("judgeInfo.judgeName",""),
      this.set("judgeInfo.judgeEmail",""),
      this.set("judgeInfo.court",""),
      this.set("judgeInfo.courtNumber",""),
      this.set("judgeInfo.judgeContact1","")
 },
  clearDocument: function(){
    this.set("documentInfo.documentId",""),
      this.set("documentInfo.documentName",""),
      this.set("documentInfo.documentType",""),
      this.set("documentInfo.documentAddress",""),
      this.set("documentInfo.documentContact1",""),
      this.set("documentInfo.documentContact2","")
  },



//Other Variables
  documentType :[
    {id:"",txt:"Select One"},
    {id:"Statement Of Claim",txt:"Statement Of Claim"},
   ],
  documentFiler :[
    {id:"",txt:"Select One"},
    {id:"Plaintiff",txt:"Plaintiff"},
    {id:"Defendant",txt:"Defendant"},
   ],

  disabledVal : "", //this indicates whether a field is active or not - here we set it to caseTitlePlaintiff

  selectedCourt : "Select One",
  courts : [
    {id:"none",txt:"Select One"},
    {id:"Court Of Appeals",txt:"Court Of Appeals"},
    {id:"High Court",txt:"High Court"},
    {id:"Supreme Court",txt:"Supreme Court"},],
  judgeCourts : [
    {id:"",txt:"Select One"},
    {id:"Court Of Appeals",txt:"Court Of Appeals"},
    {id:"High Court",txt:"High Court"},
    {id:"Supreme Court",txt:"Supreme Court"},],
  caseType : [
    {id:"",txt:"Select One"},
    {id:"Writ Of Summons",txt:"Writ Of Summons"},
    {id:"Petition",txt:"Petition"},
    ],

  courtnumber : [
    {id:"",txt:"Select One"},
    {id:"room one",txt:"room one"},
    {id:"room two",txt:"room two"},
    {id:"room three",txt:"room three"},],

  viewstate : {
    selectedCriminal: false,
    selectedCivil: false,
    skipAddJudge : false, //locks input when skip judges is enabled
    disableAddJudge : "" //locks input when skip judges is enabled


  },
  ////oberver for changing selected state
  selectedTypeCriminal : Ember.observer('viewstate.selectedCriminal', function() {
    if(this.get("viewstate.selectedCriminal") == true){

      this.set("caseInfo.caseTitlePlaintiff","THE REPUBLIC")
      this.set("caseInfo.caseOption","Criminal Case")
      this.set("plaintiffInfo.plaintiffName","THE REPUBLIC")
      this.set("plaintiffInfo.plaintiffAddress","OFFICE OF THE ATTORNEY GENERAL")
      this.set("viewstate.selectedCivil","")
      this.set("disabledVal","true")


      this.pushPlaintiff("hideView")
    };
    if(this.get("viewstate.selectedCriminal") == false){
      this.set("caseInfo.caseTitlePlaintiff","")
      this.set("caseInfo.caseOption","Civil Case")
      this.set("plaintiffInfo.plaintiffName","")
      this.set("plaintiffInfo.plaintiffAddress","")
      this.set("viewstate.selectedCivil","true")
      this.set("disabledVal","")
      this.get("plaintiffArray").clear()
     };
  }),
  selectedTypeCivil : Ember.observer('viewstate.selectedCivil', function() {
    if(this.get("viewstate.selectedCivil") == true){
      //this.set("viewstate.showview","showView")
      //this.set("viewstate.civilcase","showView")
      //this.set("viewstate.criminalcase","hideView")
      this.set("viewstate.selectedCriminal","")
      //this.set("suitInfo.caseType","")
    };
    if(this.get("viewstate.selectedCivil") == false){
      this.set("viewstate.selectedCriminal","true")

    };
  }),
  checkedSkipJudge : Ember.observer('viewstate.skipAddJudge', function() {
    if(this.get("viewstate.skipAddJudge") == true){
      this.set("disableAddJudge","true")
    };
    if(this.get("viewstate.skipAddJudge") == false){
      this.set("disableAddJudge","")
    };
  }),



  //Init Functions

//reopens textfield and enables parsely js usage
  me : Ember.TextField.reopen({
    attributeBindings: ['data-parsley-type','data-parsley-required',"data-parsley-minlength","data-parsley-maxlength"]
  }),



  clearForm: function(){
    this.set("caseInfo.caseNumber",""),
    this.set("caseInfo.caseType","Select One"),
      this.set("caseInfo.caseDate",""),
      this.set("caseInfo.caseTitlePlaintiff",""),
      this.set("caseInfo.caseTitleDefendant",""),
      this.set("caseInfo.caseCourt",""),
      this.set("caseInfo.caseAccess","")
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
            self.pushDocument();
            self.notify.success("Document Uploaded successfully")
            self.set("viewSwitch.uploadBtn","showView")
            self.set("viewSwitch.loadingImg","hideView")

            //then we send sms notification

          }
        }catch(e){
          self.notify.error("Error Uploading Document")
          self.set("viewSwitch.uploadBtn","showView")
          self.set("viewSwitch.loadingImg","hideView")
        }

        //lets clear form
        //self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },


 actions : {
   addPlaintiff : function(){
     var validate = $("#plaintiff").parsley();
     if(validate.validate() == true){
       //first we push info to array
       this.pushPlaintiff("showView");
       console.log(this.get("plaintiffArray"));
       //then we clear form
       this.clearPlaintiffs();
     }else{
       //this.notify.error("Please Fix Errors")
     }
   },
   addDefendant : function(){
     var validate = $("#defendant").parsley();
     if(validate.validate() == true){
       //first we push info to array
       this.pushDefendant();

       //then we clear form
       this.clearDefendants();
     }else{
       //this.notify.error("Please Fix Errors")
     }
   },



   addPlaintiffLawyerForm : function(){
     var validate = $("#addPLawyerForm").parsley();
     if(validate.validate() == true){
       //first we push info to array
       var lawyerInfo = {
         index: this.get("plaintiffLawyersArray").length,
         lindex: this.get("lawyersArray").length,
         suitnumber: this.get("caseInfo.caseNumber"),
         lawyerId: this.get("pLawyerInfo.lawyerId"),
         lawyerName: this.get("pLawyerInfo.lawyerName"),
         lawfirmName :this.get("pLawyerInfo.lawfirmName"),
         lawyertype: "plaintiff",
         registertype :"unregistered",
         lawyerEmail: this.get("pLawyerInfo.lawyerEmail"),
         lawyerAddress: this.get("pLawyerInfo.lawyerAddress"),
         lawyerContact1: this.get("pLawyerInfo.lawyerContact1"),
         lawyerContact2: this.get("pLawyerInfo.lawyerContact2")
       }

       this.get("lawyersArray").pushObject(lawyerInfo);
       this.get("plaintiffLawyersArray").pushObject(lawyerInfo);
       //then we clear form
       this.clearPLawyers();
     }else{
       //this.notify.error("Please Fix Errors")
     }
   },


   addPlaintiffLawyerSelect : function(){
     var validate = $("#addPLawyerSelect").parsley();
     if(validate.validate() == true){
       console.log(this.get("listPos"))
       if(this.get("listPos") == "" || this.get("listPos") == null) {
         this.notify.error("Please Select A Lawyer")
       }else{
         var lawyerInfo  = {
           index : this.get("lawyersArray").length,
           index: this.get("plaintiffLawyersArray").length,
           suitnumber: this.get("caseInfo.caseNumber"),
           lawyerId :this.get("listPos.lawyerId"),
           lawyerName :this.get("listPos.lawyerName"),
           lawfirmName :this.get("listPos.lawfirmName"),
           lawyertype :"plaintiff",
           registertype :"registered",
           lawyerEmail :this.get("listPos.lawyerEmail"),
           lawyerAddress : this.get("listPos.lawyerAddress"),
           lawyerContact1 : this.get("listPos.lawyerContact1"),
           lawyerContact2 : this.get("listPos.lawyerContact2")
         }

         this.get("lawyersArray").pushObject(lawyerInfo);
         this.get("plaintiffLawyersArray").pushObject(lawyerInfo);
       }
     }else{
       //this.notify.error("Please Fix Errors")
     }
   },

   //Judge Actions
   addJudge : function(){
     var validate = $("#addJudge").parsley();
     if(validate.validate() == true){
       //first we push info to array
       this.pushJudge();

       //then we clear form
       this.clearJudges();
     }else{
       //this.notify.error("Please Fix Errors")
     }
   },



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


   removeOneDocument : function(a){
     this.get("documentArray").removeAt(a)
   },
   removeOneJudge : function(a){
     this.get("judgesArray").removeAt(a)
   },
   removeOnePlaintiff : function(a){
     this.get("plaintiffArray").removeAt(a)
   },
   removeOneDefendant : function(a){
     this.get("defendantArray").removeAt(a)
   },

   goReview : function(){
     var validate = $("#caseDetail").parsley();
     //go through our checks
     if(this.get("viewstate.selectedCriminal") == false && this.get("viewstate.selectedCivil") == false ){
       this.notify.error("Please Choose Civil or Criminal Case")
     }else if(validate.validate() == false){

     }else if(this.get("plaintiffArray").length == 0){
       this.notify.error("Please add a plaintiff")
     }else if(this.get("defendantArray").length == 0){
       this.notify.error("Please add a defendant")
     }else if(this.get("lawyersArray").length == 0){
       this.notify.error("Please add a lawyer")
     }else if(this.get("viewstate.skipAddJudge") == false && this.get("judgesArray").length == 0){
       this.notify.error("Please add a judge or Check Skip")
     }else if(this.get("documentArray").length == 0){
       this.notify.error("Please add a Document")
     }else{
       this.transitionTo("suits.preview")
     }
    }

}
});
