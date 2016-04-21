import Ember from 'ember';

export default Ember.Component.extend({
  actions : {
    showSuitIndex :function(){
      this.sendAction("showSuitIndex")
    } ,
    showLawyerIndex :function(){
      this.sendAction("showLawyerIndex")
    },
    showJudgeIndex :function(){
      this.sendAction("showJudgeIndex")
    },
    showCourtIndex :function(){
      this.sendAction("showCourtIndex")
    },
    showAdminIndex :function(){
      this.sendAction("showAdminIndex")
    }
  }
});
