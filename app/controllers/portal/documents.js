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



  documentInfo : {
    documentId :"",
    documentCode :"",
    documentName : "",
    documentType : "",
    documentAccess : "",
    documentDate : "",


  },

  pushDocument : function(){
    var documentInfo  = {
      suitnumber :this.get("newSuit.suitNumber"),
      code :this.get("documentInfo.documentCode"),
      id :this.get("documentInfo.documentId"),
      name :this.get("documentInfo.documentName"),
      type :this.get("documentInfo.documentType"),
      datefiled : this.get("documentInfo.documentDate"),
      access : this.get("documentInfo.documentAccess"),
      documentLocation : this.get("documentLocation"),
      pdfViewLocation : this.get("pdfViewLocation")
    }

    this.get("documentArray").pushObject(documentInfo);
  },

  documentArray :Ember.A([]),

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
