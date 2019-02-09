import React from 'react';

export default function ItemSummary({ data }) {
  return (
    <li>
      ({data.InternalId}) {data.Title} <em>{data.DateAdded}</em>
    </li>
  )
}