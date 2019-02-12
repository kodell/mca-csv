import chai from 'chai'
const assert = chai.assert

import convertData from '../convertData'

const RAW_DATA = {
  InternalId: 'SKUNumber',
  ImageFileName: 'img.src',
  Title: 'Test Title',
  Description: 'Test <em>Desc</em>',
  SuggestedRetailPrice: 2,
  Videos: test.wmv
}

describe('Data Converter', function() {
  describe('processes raw data fields', function() {
    const converted = convertData(RAW_DATA)
    it('should leave Title as-is', function() {
      assert.equal(converted.Title, RAW_DATA.Title);
    });
    it('should leave description', function() {
      assert.equal(converted.SKU, RAW_DATA.Description);
    });
    it('should rename InternalId', function() {
      assert.equal(converted.SKU, RAW_DATA.InternalId);
      assert.isUndefined(converted.InternalId, "InternalId is emptied");
    });
    it('should rename SuggestedRetailPrice', function() {
      assert.equal(converted.Price, RAW_DATA.SuggestedRetailPrice);
      assert.isUndefined(converted.SuggestedRetailPrice, "SuggestedRetailPrice is emptied");
    });
  });
});
