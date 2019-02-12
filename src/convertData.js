const REG = /(\S+)\.wmv/
const URL = 'http://www.murphysmagicsupplies.com/video/clips_mp4fs/'

export function massagePhysicalItem(item) {
  if (item.InternalId) {
    return item; // already a digital item
  } else {
    return {
      ...item,
      InternalId: item['Product Key'],
      HTMLDescription: item['Detailed Description'],
      ImageFileName: item['Image URL'],
      DateAdded: item['Date Added'],
      SuggestedRetailPrice: item['MSRP'],
      _physical: true
    }
  }
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
  const Title = item.Title.replace('DOWNLOAD', '(Download)')
  // Add Videos to Description
  let videos = '';
  if (item.Videos) {
    const vidArr = item.Videos.split(', ').map((vidFile) => {
      return URL + vidFile.replace(REG, '$1.mp4')
    })
    videos = vidArr.join('\n<br>') + '\n<br><br>'
  }
  const Description = videos + item.HTMLDescription;
  // Build Categories list
  const categories = [];
  if (Title.startsWith('The Vault')) {
    categories.push('The Vault Videos')
  } else if (Title.startsWith('At The Table')) {
    categories.push('At the Table Lectures')
  } else if (!item._physical) {
    categories.push('Instant Downloads')
  }
  for (const cat in CATEGORIES) {
    if (item[cat]) {
      categories.push(CATEGORIES[cat])
    }
  }

  const digitalFields = item._physical ? {} : DIGITAL_FIELDS;

  return {
    SKU: item.InternalId,
    Description,
    Title,
    Images: item.ImageFileName,
    Categories: categories.join(', '),
    Price: item.SuggestedRetailPrice,
    ...digitalFields
  }
}