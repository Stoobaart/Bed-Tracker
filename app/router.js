import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('home');
  this.route('qr');
  this.route('login', { path: ''});
  this.route('dashboard');

  this.route('add-bed');
  this.route('scan');
  this.route('bed', { path: '/bed/:id' });
});
