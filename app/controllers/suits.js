import Ember from 'ember';

export default Ember.Controller.extend({

  username : localStorage.name,
  position : localStorage.position,

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
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("position");
      //Todo
      this.notify.info("Signed Out Successfully")
      this.transitionTo("logins")
    }
  }
});
