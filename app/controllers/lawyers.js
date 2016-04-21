import Ember from 'ember';

export default Ember.Controller.extend({

  email : "kankam@gmail.com",
  active : "active",
  actions : {
    showSuitIndex :function(){
      this.transitionTo("suits")
    } ,
    showLawyerIndex :function(){
      this.transitionTo("lawyers")
    },
    showJudgeIndex :function(){
      this.transitionTo("judges")
    },
    showCourtIndex :function(){
      this.transitionTo("courts")
    },
    showAdminIndex :function(){
      this.transitionTo("admin")
    },

    signOut :function(){
      //remove token
      //Todo
      this.notify.info("Signed Out Successfully")
      this.transitionTo("logins")
    }
  }
});
