import React from 'react';

const Table = ({ columns, data, renderRow, handleSelectAll }) => {
  return (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th>
            <input
              type="checkbox"
              onChange={handleSelectAll}
            />
          </th>
          {columns.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => renderRow(item, i))}
      </tbody>
    </table>
  );
};

export default Table;
