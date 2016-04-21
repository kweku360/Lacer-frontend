import Ember from 'ember';


export default Ember.Controller.extend({


 actions : {
    createNew : function(){
      this.transitionTo("suits.new")
    },
   manage : function(){
      this.transitionTo("manage")
    },
   review : function(){
      this.transitionTo("suits.review")
    }

  }
});
