import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('logins',{path : '/'});
  this.route('register');
  this.route('resetpassword');
  this.route('dashboard');

  this.resource('suits',function(){
    this.route('new');
    this.route('plaintiffs');
    this.route('defendants');
    this.route('entersuit');
    this.route('addlawyer');
    this.route('adddocument');
    this.route('manage');
    this.route('preview');
    this.route('review');
    this.route('reviewdetail');
    this.route('casesuccess');
  });
  this.resource('manage',function(){
    this.route('info');
    this.route('plaintiffs');
    this.route('defendants');
    this.route('lawyers');
    this.route('documents');
    this.route('judge');
    this.route('notifications');
    this.route('notificationdetail');
    this.route('archive');
    this.route('delete');

  });
  this.resource('admin',function(){
    this.route('createuser');

  });
  this.resource('documents',function(){
    this.route('entersuit');
    this.route('detail');
    this.route('upload');
  });

  this.resource('judges',function(){


  });
  this.resource('lawyers',function(){


  });

  this.resource('portal',function(){
    this.route('courtcases');
    this.route('mycases');
    this.route('documents');
    this.route('pdfview');

  });
  this.route('portal');
});

export default Router;
