import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | hospital-id', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:hospital-id');
    assert.ok(route);
  });
});
