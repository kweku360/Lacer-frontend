import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({
  //lets intect  controllers
  appindexController: Ember.inject.controller('manage.index'),
  suitNumber: Ember.computed.reads('appindexController.internalSuitnumber'),


  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  getSuitData : function(){
    var self = this;
    this.get("lawyersArray").clear();
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"suitlawyers/"+this.get("suitNumber"),
      type: 'GET',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        console.log(response);

        if(obj.meta.total == 0){
          self.transitionToRoute("manage")
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
        //lets clear form
        self.clearForm()
      },
      error: function (model, response) {
        self.notify.error("")
      }
    });
  },
  deleteData : function(id, pos){
    var self = this;
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"lawyers/"+ id,
      type: 'DELETE',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
       if(obj.code == 200){
         self.get("lawyerArray").removeAt(pos);
         self.notify.info("Lawyer Removed")
        }else{
         self.notify.info("Unable to Remove Lawyer")
        }
      },
      error: function (model, response) {
        self.notify.error("Unable To delete Now")
      }
    });
  },
  saveData : function(){
    var self = this;
    this.pushLawyer();
    var position = this.get("lawyersArray").length - 1
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"lawyers",
      data:this.get("lawyersArray").objectAt(position),
      type: 'POST',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);

        self.clearForm();
        self.notify.success("lawyer added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add lawyer - try again")
      }
    });
  },


  editData : function(id,pos){
    var self = this;

    var lawyerInfo  = {
      index : this.get("lawyerArray").length,
      suitnumber :this.get("lawyerInfo.suitNumber"),
      lawyerId :this.get("lawyerInfo.suitNumber"),
      lawyerType :this.get("lawyerInfo.lawyerType"),
      fullname :this.get("lawyerInfo.lawyerName"),
      address : this.get("lawyerInfo.lawyerAddress"),
      phone : this.get("lawyerInfo.lawyerContact1"),
      phone1 : this.get("lawyerInfo.lawyerContact2")
    }
    $.ajax({
      //url: "http://localhost:8888/lacerapi/index.php/users/token",
      url: this.get("ApiUrl")+"lawyers/"+id,
      data:lawyerInfo,
      type: 'PUT',
      success: function(response) {
        var obj = JSON.parse(response)
        console.log(obj);
        self.get("lawyerArray").removeAt(pos)
        self.get("lawyerArray").insertAt(pos,lawyerInfo)
        self.notify.success("lawyer added successfully")
      },
      error: function (model, response) {
        self.notify.error("Unable to add lawyer - try again")
      }
    });
  },

  lawyerInfo : {
    lawyerId :"",
    suitNumber :"",
    lawyerName : "",
    lawyerType : "",
    lawyerAddress : "",
    lawyerEmail : "",
    lawyerContact1 : "",
    lawyerContact2 : ""
  },

  lawyerType :["","Lawyer","Defendant"],
  lawyersArray :Ember.A([]),

  pushLawyer : function(){
    var lawyerInfo  = {
      index : this.get("lawyersArray").length,
      suitnumber :this.get("newSuit.suitNumber"),
      lawyerId :this.get("lawyerInfo.lawyerId"),
      lawyerName :this.get("lawyerInfo.lawyerName"),
      lawyertype :this.get("lawyerInfo.lawyerType"),
      lawyerEmail :this.get("lawyerInfo.lawyerEmail"),
      lawyerAddress : this.get("lawyerInfo.lawyerAddress"),
      lawyerContact1 : this.get("lawyerInfo.lawyerContact1"),
      lawyerContact2 : this.get("lawyerInfo.lawyerContact2")
    }

    this.get("lawyersArray").pushObject(lawyerInfo);
  },
  clearForm: function(){
     this.set("lawyerInfo.lawyerId",""),
      this.set("lawyerInfo.lawyerName",""),
      this.set("lawyerInfo.lawyerEmail",""),
      this.set("lawyerInfo.lawyerAddress",""),
      this.set("lawyerInfo.lawyerContact1",""),
      this.set("lawyerInfo.lawyerContact2","")
  },

  addToggle : "showView",
  saveToggle : "hideView",
  cancelToggle : "hideView",

 actions : {
   removeOne : function(a){
     var pinfo = this.get("lawyerArray").objectAt(a)
     this.deleteData(pinfo.lawyerId, a);
   },
   editOne : function(a){
     var pinfo = this.get("lawyerArray").objectAt(a)

       this.set("lawyerInfo.suitNumber",pinfo.suitNumber),
       this.set("lawyerInfo.lawyerIndex",pinfo.index),
       this.set("lawyerInfo.lawyerId",pinfo.lawyerId),
       this.set("lawyerInfo.lawyerName",pinfo.fullname),
       this.set("lawyerInfo.lawyerAddress",pinfo.address),
       this.set("lawyerInfo.lawyerContact1",pinfo.phone),
       this.set("lawyerInfo.lawyerContact2",pinfo.phone1)

     this.set("addToggle","hideView");
     this.set("saveToggle","showView");
     this.set("cancelToggle","showView");



   },
   cancel : function(a){
     this.clearForm();
     this.set("addToggle","showView");
     this.set("saveToggle","hideView");
     this.set("cancelToggle","hideView");

   },
   update : function(a){
    // var pinfo = this.get("lawyerArray").objectAt(a)
     //console.log(this.get("lawyerInfo.lawyerId"))
    // console.log(a)
     this.editData(this.get("lawyerInfo.lawyerId"), a)
     this.clearForm();
     this.set("addToggle","showView");
     this.set("saveToggle","hideView");
     this.set("cancelToggle","hideView");

   },
   addAnother : function(a){
     var validate = $("#addLawyer").parsley();
     if(validate.validate() == true){
      this.saveData();
     }else{
       this.notify.error("Please Fix Errors")
     }
   }
 }
});

//
//<div id="login">
//<div id="triangle"></div>
//<h1>Lacer</h1>
//<h3>Log In to Your Account</h3>
//<h3>
//
//</h3>
//<form>
//{{input type="text" value=loginDetails.email placeholder="Email"}}
//{{input type="password" value=loginDetails.password placeholder="Password"}}
//<input {{action "memberLogin"}} type="submit" value="Log In" />
//</form>
//<div class="msg">
//Don't have an Account ?
//{{#link-to  'register'}}
//Click Here
//{{/link-to}} to Sign up
//</div>
//</div>

//<div id="login">
//<div id="triangle"></div>
//<h1>Lacer</h1>
//<h3>Register Account</h3>
//  <!--step one-->
//<form id="userPhone" class="{{enterPhoneView}}">
//<h3>Please Enter your Phone number</h3>
//<div class="form-addon" data-states-for="name">
//<div class="form-addon__addon">
//<i>+233 </i>
//</div>
//{{input data-parsley-type="digits" data-parsley-minlength="10" data-parsley-maxlength="10" required="true" value=phoneInfo.phone placeholder="phone number"}}
//</div>
//
//<span class="bolt-light lightgrey">Example : 0243388943</span><br><br>
//<span class="bolt-light lightgrey">We will send you a registration code via SMS</span><br>
//<br>
//<input {{action "enterPhoneProceed"}} type="submit" class="reginput" value="proceed" /><br>
//</form>
//  <!--end step one-->
//
//
//  <!--step two-->
//<form id="verifyCode" class="{{verifyCodeView}}">
//<h3>Enter your 6-digit verification code</h3>
//{{input type="text" required="true" value=phoneInfo.code placeholder="code"}}
//
//<br>
//<input {{action "verifyCodeProceed"}} type="submit" value="verify" /><br>
//<input {{action "goBack"}} type="submit" value="Back" /><br>
//</form>
//  <!--end step two-->
//
//
//  <!--step 3-->
//<form id="userRegister" class="{{activeCodeView}}">
//<h3>Phone Number :{{registerDetails.phone}}</h3>
//{{view "select" content=userPosition value=registerDetails.position}}
//{{input type="email" required="true" value=registerDetails.email placeholder="Email"}}
//{{input type="text" value=registerDetails.fullname placeholder="Full Name"}}
//{{input type="password" value=registerDetails.password placeholder="Password"}}
//<input {{focus-out "check Password"}} type="password" placeholder="Confirm Password" />
//<input {{action "registerMember"}} type="submit" value="create account" />
//</form>
//<div class="msg">
//Already have an Account ?
//{{#link-to  'logins'}}
//Click Here
//{{/link-to}}
//to Login
//</div>
//</div>



