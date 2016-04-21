import Ember from 'ember';

function generateDate(){

};


export default Ember.Controller.extend({


  applicationController: Ember.inject.controller('application'),
  ApiUrl: Ember.computed.reads('applicationController.ApiUrl'),

  queryParams: ['pdfProcess'],
  location : "http://localhost:8888/lacerapi/uploads/",
  pdfProcess : "",

  pdfFile: Ember.computed('location', 'pdfProcess', function(key, value) {
    return this.get('location')+this.get('pdfProcess');
  }),

 actions : {

}
});
