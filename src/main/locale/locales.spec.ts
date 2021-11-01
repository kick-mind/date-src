import assert from 'assert';
import { Locales } from './locales';

describe('Main', () => {
  describe('Locales', function () {

    it('can get system locale', () => {
      assert.ok(Locales.system);
    });

    it('can get default locale', () => {
      assert.ok(Locales.default);
    });

    it('can resolve "fa" locale', () => {
      assert.ok(Locales.resolve('fa'));
    });

    it('can cache resolved locales', () => {
      assert.strictEqual(Locales.resolve('fa'), Locales.resolve('fa'));
    });
  });
});
