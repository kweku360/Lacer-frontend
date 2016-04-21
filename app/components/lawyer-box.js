import Ember from 'ember';

export default Ember.Component.extend({

  arrutil :function(myArray, searchTerm, property) {
  for(var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
},

  dlawyerInfo : "",
  plawyerInfo : "",
  apiUrl : "",
  lawyerTypeCheck : "",
  phoneRequired :"form-label--required",
  phoneNotRequired :"",
  truthy : "true",
  falsy : "false",

  lawyerList:[],
  listPos :"", // this value contains the selected lawyer from the lawyerlist array
  dlistPos :"", // this value contains the selected lawyer from the lawyerlist array

  lawyersArray :Ember.A([]),

  //extensions
  plaintiffLawyersArray :Ember.A([]),
  defendantLawyersArray :Ember.A([]),

  clearLawyers: function(){
    this.set("LawyerInfo.lawyerId",""),
      this.set("LawyerInfo.lawyerName",""),
      this.set("LawyerInfo.lawyerType",""),
      this.set("LawyerInfo.lawyerAddress",""),
      this.set("LawyerInfo.lawyerEmail",""),
      this.set("LawyerInfo.lawyerContact1",""),
      this.set("LawyerInfo.lawFirmName","")
    this.set("LawyerInfo.lawFirmContact","")
  },

  typeActions : function(){
    if(this.get("lawyersArray").length == 0){
      this.get("plaintiffLawyersArray").clear(),
      this.get("defendantLawyersArray").clear()
    }
    if(this.get("lawyerType") == "defendant"){
      this.set("selectDSwitch","hideView")

      this.set("dlawyerInfo",this.get("LawyerInfo"))
      this.set("lawyerTypeCheck",false)
    }
    if(this.get("lawyerType") == "plaintiff"){
      this.set("selectPSwitch","hideView")
      this.set("dlawyerInfo",this.get("LawyerInfo"))
      this.set("lawyerTypeCheck",true)


    }
  },

  //Lawyer init
  getLawyerData : function(){
    var self = this;
    self.set("lawyerList",[])
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("apiUrl")+"lawyers",
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
            lawyerlist.description = obj.lawyers[i].lawyerid;
            lawyerlist.lawyerName = obj.lawyers[i].fullname;
            lawyerlist.lawfirmName = obj.lawyers[i].lawfirmname;
            lawyerlist.lawyerEmail = obj.lawyers[i].email;
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

  didInsertElement: function() {
    // Initialize some state for this component
    this.getLawyerData()
    this.typeActions()

  },

  actions : {
    //Lawyer Actions
    lawyerList : function(){
      if(this.get("lawyerType") == "defendant"){
        this.set("selectDSwitch","showView")
        this.set("formDSwitch","hideView")
      }
      if(this.get("lawyerType") == "plaintiff"){
        this.set("selectPSwitch","showView")
        this.set("formPSwitch","hideView")
      }
    },
    cancelLawyerSelect : function(){
      if(this.get("lawyerType") == "defendant"){
        this.set("selectDSwitch","hideView")
        this.set("formDSwitch","showView")
      }
      if(this.get("lawyerType") == "plaintiff"){
        this.set("selectPSwitch","hideView")
        this.set("formPSwitch","showView")
      }
    },
    removeOneDLawyer : function(a,b){
      var i = this.arrutil(this.get("lawyersArray"),a,"lawyerContact1")
      var j = this.arrutil(this.get("defendantLawyersArray"),a,"lawyerContact1")
      console.log(i);
      this.get("defendantLawyersArray").removeAt(j)
      this.get("lawyersArray").removeAt(i)

    },
    removeOnePLawyer : function(a,b){
      var i = this.arrutil(this.get("lawyersArray"),a,"lawyerContact1")
      var j = this.arrutil(this.get("plaintiffLawyersArray"),a,"lawyerContact1")
      this.get("plaintiffLawyersArray").removeAt(j)
      console.log(i);
      this.get("lawyersArray").removeAt(i)
      },
    addLawyerForm : function(){

      //check for double addition
      var i = this.arrutil(this.get("lawyersArray"),this.get("LawyerInfo.lawyerContact1"),"lawyerContact1")
      //TODO MAXIMUM OF THREE LAWYERS
      if(i == -1){
        var validate = $("#"+this.get("lawyerType")+"Form").parsley();
        if(validate.validate() == true){
        //first we push info to array
        var lawyerInfo = {
          index: this.get("lawyersArray").length,
          //suitnumber: this.get("caseInfo.caseNumber"),
          lawyerId: this.get("LawyerInfo.lawyerContact1"),
          lawyerName: this.get("LawyerInfo.lawyerName"),
          lawfirmName :this.get("LawyerInfo.lawFirmName"),
          lawyertype: this.get("lawyerType"),
          registertype :"unregistered",
          lawyerEmail: this.get("LawyerInfo.lawyerEmail"),
          lawyerAddress: this.get("LawyerInfo.lawyerAddress"),
          lawyerContact1: this.get("LawyerInfo.lawyerContact1"),
          lawyerContact2: this.get("LawyerInfo.lawyerContact2")
        }

        if(this.get("lawyerType") == "plaintiff"){
          lawyerInfo.pindex = this.get("plaintiffLawyersArray").length,
            this.get("plaintiffLawyersArray").pushObject(lawyerInfo);

        }
        if(this.get("lawyerType") == "defendant"){
          lawyerInfo.dindex = this.get("defendantLawyersArray").length,
            this.get("defendantLawyersArray").pushObject(lawyerInfo);
        }
        this.get("lawyersArray").pushObject(lawyerInfo);
        //then we clear form
        this.clearLawyers();
        }else{
          //this.notify.error("Please Fix Errors")
        }
      }else{
        this.notify.error("Lawyer Already added to suit")
      }
    },

    addLawyerSelect : function(){
      var validate = $("#addLawyerSelect").parsley();
      if(validate.validate() == true){
        console.log(this.get("dlistPos"))
        if(this.get("dlistPos") == "" || this.get("dlistPos") == null) {
          this.notify.error("Please Select A Lawyer")
        }else{
          var lawyerInfo  = {
            index : this.get("lawyersArray").length,
            //suitnumber: this.get("caseInfo.caseNumber"),
            lawyerId :this.get("dlistPos.lawyerId"),
            lawyerName :this.get("dlistPos.lawyerName"),
            lawfirmName :this.get("dlistPos.lawfirmName"),
            lawyertype :this.get("lawyerType"),
            registertype :"registered",
            lawyerEmail :this.get("dlistPos.lawyerEmail"),
            lawyerAddress : this.get("dlistPos.lawyerAddress"),
            lawyerContact1 : this.get("dlistPos.lawyerContact1"),
            lawyerContact2 : this.get("dlistPos.lawyerContact2")
          }

          if(this.get("lawyerType") == "plaintiff"){
           this.get("plaintiffLawyersArray").pushObject(lawyerInfo);

          }
          if(this.get("lawyerType") == "defendant"){
            this.get("defendantLawyersArray").pushObject(lawyerInfo);
          }
          this.get("lawyersArray").pushObject(lawyerInfo);


      }
      }else{
        //this.notify.error("Please Fix Errors")
      }
    }

  }

  //Lawyers
  //LawyerInfo : {
  //  lawyerId :"",
  //  lawyerName : "",
  //  lawyerType : "",//plaintiff/defendant lawyer
  //  defendantCount:"", //counts number of plaintiff lawyers
  //  plaintiffCount:"", //counts number of defendant lawyers
  //  registerType:"",//indicates if lawyer is registed to lacer or not
  //  lawyerAddress : "",
  //  lawyerEmail : "",
  //  lawyerContact1 : "",
  //  lawyerContact2 : "",
  //  lawFirmName:"",
  //  lawFirmContact:""
  //}
});
