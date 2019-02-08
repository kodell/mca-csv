import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Parser({ source, cancel }) {
  if (!(source instanceof File)) {
    return 'Error, no source File given.'
  }

  // Kick off the source download with Papa
  const [rows, setRows] = useState(0);
  useEffect(() => {
    Papa.parse(source, {
      download: true,
      step: function (row) {
        console.log(row)
        setRows(rows + 1)
      }
    })
  }, [source])

  return (
    <div>Processing {source.name}. {rows} rows found.</div>
  )
}