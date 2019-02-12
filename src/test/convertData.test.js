import { assert } from 'chai'

import convertData, {massageItem} from '../convertData'

const RAW_DATA = {
  InternalId: 'SKUNumber',
  ImageFileName: 'img.png',
  Title: 'Test Title',
  HTMLDescription: 'Test <em>Desc</em>',
  SuggestedRetailPrice: 2,
  Videos: 'test.wmv, baz.wmv'
}
const RAW_PHYSICAL = {
  'Product Key': 'SKUTest',
  'Detailed Description': 'Test Detailed',
  'Image URL': 'img.jpg',
  'Date Added': '1/2/3',
  'MSRP': 3
}

describe('Data Converter', function() {
  describe('processes raw data fields', function() {
    const converted = convertData(massageItem(RAW_DATA))
    it('should leave Title as-is', function() {
      assert.equal(converted.Title, RAW_DATA.Title);
    });
    it('should rename InternalId', function() {
      assert.equal(converted.SKU, RAW_DATA.InternalId);
      assert.isUndefined(converted.InternalId, "InternalId is emptied");
    });
    it('should rename SuggestedRetailPrice', function() {
      assert.equal(converted.Price, RAW_DATA.SuggestedRetailPrice);
      assert.isUndefined(converted.SuggestedRetailPrice, "SuggestedRetailPrice is emptied");
    });
    it('should build Video URLs and append', function() {
      assert.include(
        converted.Description,
        'http://www.murphysmagicsupplies.com/video/clips_mp4fs/test.mp4',
        "converts video filename"
      );
      assert.include(
        converted.Description,
        'http://www.murphysmagicsupplies.com/video/clips_mp4fs/baz.mp4',
        "converts video filename"
      );
      assert.include(converted.Description, RAW_DATA.HTMLDescription, 'should contain the rest of the Description');
    });
    it('should add digital-only fields', function() {
      assert.equal(converted.Type, 'simple, virtual');
      assert.equal(converted['Meta: _no_shipping_required'], 'yes')
    })
  });

  describe('converts physical items', function() {
    const converted = massageItem(RAW_PHYSICAL)
    it('should rename fields', function() {
      assert.equal(converted.SKU, RAW_PHYSICAL['Product Key'], 'Product Key')
      assert.equal(converted.Description, RAW_PHYSICAL['Detailed Description'], 'Detailed Description')
      assert.equal(converted.Images, RAW_PHYSICAL['Image URL'], 'Image URL')
      assert.equal(converted.DateAdded, RAW_PHYSICAL['Date Added'], 'Date Added')
    })
    it('should mark it as not _digital', function() {
      assert.isFalse(converted._digital);
      assert.isUndefined(converted.Type);
    })
  })
});
