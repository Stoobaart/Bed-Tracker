import ApolloService from 'ember-apollo-client/services/apollo';
import { inject as service } from '@ember/service';
import { setContext } from 'apollo-link-context';
import config from '../config/environment';

export default class Service extends ApolloService {
  @service router;

  get options() {
    return {
      apiURL: config.graphqlApi.url
    };
  }

  link() {
    let httpLink = super.link();

    let authLink = setContext(() => {
      if (!JSON.parse(localStorage.getItem('token'))) {
        return {};
      }
      return {
        headers: { authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`}
      };
    });




    return authLink.concat(httpLink);
  }
} 