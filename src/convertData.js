const REG = /(\S+)\.wmv/
const URL = 'http://www.murphysmagicsupplies.com/video/clips_mp4fs/'

const CATEGORIES = {
  'Card Magic and Trick Decks': 'Card Magic',
  'Close Up Performer': 'Close-Up Magic',
  'Money Magic': 'Money Magic',
  'Street Performer': 'Street Magic'
}

export default function convertData(item) {
  let videos = '';
  if (item.Videos) {
    const vidArr = item.Videos.split(', ').map((vidFile) => {
      return URL + vidFile.replace(REG, '$1.mp4')
    })
    videos = vidArr.join('\n<br>') + '\n<br><br>'
  }
  const Description = videos + item.HTMLDescription;
  const Title = item.Title.replace('DOWNLOAD', '(Download)')
  const categories = [];
  if (Title.startsWith('The Vault')) {
    categories.push('The Vault Videos')
  } else if (Title.startsWith('At The Table')) {
    categories.push('At the Table Lectures')
  } else {
    categories.push('Instant Downloads')
  }
  for (const cat in CATEGORIES) {
    if (item[cat]) {
      categories.push(CATEGORIES[cat])
    }
  }

  return {
    SKU: item.InternalId,
    Description,
    Title,
    Images: item.ImageFileName,
    Categories: categories.join(', '),
    Price: item.SuggestedRetailPrice,
    Type: 'simple, virtual',
    'Meta: _no_shipping_required': 'yes'
  }
}