import Ember from 'ember';


export default Ember.Controller.extend({


 actions : {
    createNew : function(){
      this.transitionTo("admin.createuser")
    },
   manage : function(){
      this.transitionTo("admin")
    },
   review : function(){
      this.transitionTo("suits.review")
    }

  }
});
