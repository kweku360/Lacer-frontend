import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: '/lacerapi',
  //namespace: "lacerapi",
  headers: Ember.computed(function() {
    return {
      "Authorization": localStorage.token
    //  "Authorization": Ember.get(document.cookie.match(/apiKey\=([^;]*)/), "1")
    };
  }).volatile(),
  ajaxOptions: function(url, type, options) {
    var hash = this._super(url, type, options);
    hash.contentType = 'application/json; charset=utf-8';
    return hash;
  }
});

//export default DS.FixtureAdapter.extend({});
