import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

import { massageItem } from './convertData'
import Export from './Export'

export default function Parser({ source, cancel }) {
  if (!(source instanceof File)) {
    return 'Error, no source File given.'
  }

  // Kick off the source download with Papa
  const [processed, setProcessed] = useState(null);

  useEffect(() => {
    Papa.parse(source, {
      header: true,
      complete: function (results) {
        setProcessed({
          ...results,
          data: results.data.map(massageItem)
        })
      }
    })
  }, [source])

  return (
    <div>
      Processing {source.name}...
      {processed && <Export data={processed} />}
    </div>
  )
}