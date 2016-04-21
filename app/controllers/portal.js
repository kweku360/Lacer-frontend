import Ember from 'ember';


export default Ember.Controller.extend({

  username : localStorage.name,
  position : localStorage.position,

 actions : {
   showCourtCases : function(){
      this.transitionTo("portal")
    },
   showMyCases : function(){
      this.transitionTo("portal.mycases")
    },
   signOut :function(){
     //remove token
     localStorage.removeItem("token");
     localStorage.removeItem("name");
     localStorage.removeItem("position");
     //Todo
     this.notify.info("Signed Out Successfully")
     this.transitionTo("logins")
   }

  }
});
