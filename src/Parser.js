import React, { useState, useEffect, useCallback, useRef } from 'react';
import Papa from 'papaparse';

import Export from './Export'

export default function Parser({ source, cancel }) {
  if (!(source instanceof File)) {
    return 'Error, no source File given.'
  }

  // Kick off the source download with Papa
  const [rows, setRows] = useState(0);
  const [processed, setProcessed] = useState(null);

  useEffect(() => {
    let rows = 0;
    Papa.parse(source, {
      header: true,
      complete: function (results) {
        setProcessed(results)
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