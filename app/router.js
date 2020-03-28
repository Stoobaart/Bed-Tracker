import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('home');
  this.route('hospital-id', function() {
    this.route('generate', { path: '/:uuid'});
    this.route('scan');
  });
  this.route('login', { path: ''});
  this.route('dashboard');
});
