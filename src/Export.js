import React, { useState } from 'react'
import moment from 'moment'
import Papa from 'papaparse'

import convertData from './convertData'
import ItemSummary from './ItemSummary';

export default function Export({ data }) {
  const [startDate, setDate] = useState(null);
  const [titleContains, setTitle] = useState('');
  const [ok, setOk] = useState(false);

  const startMoment = startDate && moment(startDate)
  const titleRegEx = titleContains && new RegExp(titleContains, 'i');
  const filtered = data.data.filter((item) => {
    if (!item.InternalId || !item.Title) {
      return false; // products must have a SKU + Title to be imported
    }
    if (startMoment && startMoment.diff(item.DateAdded) > 0) {
      return false;
    }
    if (titleRegEx && !item.Title.match(titleRegEx)) {
      return false;
    }
    return true; 
  })
  const items = filtered.map((item) => <ItemSummary data={item} key={item.InternalId} />)

  let exportData;
  if (ok) {
    // Build final CSV data
    const csvString = Papa.unparse( filtered.map(convertData) )
    const blob = new Blob([csvString]);
    exportData = window.URL.createObjectURL(blob, {type: "text/plain"});
    console.log(exportData);
  }

  return (
    <section>
      Total rows found: {data.data.length}
      <h2>Export criteria:</h2>
      <label>
        Start Date:
        <input type="date" onChange={({ target }) => setDate(target.value)} />
      </label><br />
      <label>
        Title Contains:
        <input type="text" onChange={({ target }) => setTitle(target.value)} />
      </label>
      <hr />
      {!ok ? (
        <div>
          {filtered.length} items match these criteria:<br />
          <button onClick={() => setOk(true)}>Done</button>
          <ol>{items}</ol>
        </div>
      ): (
        <a href={exportData}
          download={`MCAImport.${moment().format('YYYY-MM-DD')}.csv`}>
            Complete - Download Formatted CSV
        </a>
      )}
    </section>
  )
}