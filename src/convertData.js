import pick from 'object.pick'

const REG = /(\S+)\.wmv/
const URL = 'http://www.murphysmagicsupplies.com/video/clips_mp4fs/'

const FIELD_MAP = {
  SKU: ['InternalId', 'Product Key'],
  Description: ['HTMLDescription', 'Detailed Description'],
  Images: ['ImageFileName', 'Image URL'],
  DateAdded: ['DateAdded', 'Date Added'],
  Price: ['SuggestedRetailPrice', 'MSRP'],
}

export function massageItem(item) {
  const output = {
    ...item,
    _digital: !!item.InternalId // digital items are labelled with InternalId SKU
  };
  for (const field in FIELD_MAP) {
    const sourceFields = FIELD_MAP[field]
    const fieldPresent = sourceFields.find( (f) => item.hasOwnProperty(f) )
    if (fieldPresent) {
      delete output[fieldPresent]
      output[field] = item[fieldPresent]
    }
  }
  return output;
}

const CATEGORIES = {
  'Card Magic and Trick Decks': 'Card Magic',
  'Close Up Performer': 'Close-Up Magic',
  'Money Magic': 'Money Magic',
  'Street Performer': 'Street Magic'
}
const DIGITAL_FIELDS = {
  Type: 'simple, virtual',
  'Meta: _no_shipping_required': 'yes'
}

export default function convertData(item) {
  // Replace the DOWNLOAD string in Title
  const Title = item.Title.replace('DOWNLOAD', '(Download)')

  // Build Categories list
  const categories = [];
  if (Title.startsWith('The Vault')) {
    categories.push('The Vault Videos')
  } else if (Title.startsWith('At The Table')) {
    categories.push('At the Table Lectures')
  } else if (item._digital) {
    categories.push('Instant Downloads')
  }
  for (const cat in CATEGORIES) {
    if (item[cat]) {
      categories.push(CATEGORIES[cat])
    }
  }

  // Add Videos to Description
  let videos = '';
  if (item.Videos) {
    const vidArr = item.Videos.split(', ').map((vidFile) => {
      return URL + vidFile.replace(REG, '$1.mp4')
    })
    videos = vidArr.join('\n<br>') + '\n<br><br>'
  }

  const digitalFields = item._digital ? DIGITAL_FIELDS : {};

  const outFields = pick(item, ['SKU', 'Images', 'Price'])
  return {
    Title,
    ...outFields,
    Categories: categories.join(', '),
    Description: videos + item.Description,
    ...digitalFields
  }
}