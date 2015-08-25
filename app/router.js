import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('logins',{path : '/'});

  this.resource('suits',function(){
    this.route('new');
    this.route('plaintiffs');
    this.route('defendants');
    this.route('entersuit');
    this.route('addlawyer');
  });
  this.resource('documents',function(){
    this.route('entersuit');
    this.route('detail');
    this.route('upload');
  });

  this.resource('judges',function(){
    this.route('addjudge');
    this.route('manage');

  });
  this.resource('lawyers',function(){
    this.route('addlawyer');
    this.route('manage');

  });
});

export default Router;
