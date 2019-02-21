import React, { useRef, useState } from 'react'

import Parser from './Parser';

function Downloader() {
  const inputEl = useRef(null);
  const [running, setRunning] = useState(false)

  return (
    <div>
      <label>
        Source CSV from Murphy's:
        <input type="file" disabled={running} ref={inputEl} />
        <hr />
        {running ? (
          <Parser source={inputEl.current.files[0]} />
        ): (
          <button onClick={() => setRunning(true)}>
            Start Processing Source CSV
          </button>
        )}
      </label>
    </div>
  )
}

export default Downloader;