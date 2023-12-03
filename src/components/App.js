import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './table.js';
import './App.css';
import {  FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

const App = () => {
  

  const toggleEditMode = (id) => {
    setEditModeRows((prevEditModeRows) =>
      prevEditModeRows.includes(id)
        ? prevEditModeRows.filter((rowId) => rowId !== id)
        : [...prevEditModeRows, id]
    );
  };

  const handleSaveChanges = (id) => {
    
    toggleEditMode(id);
  };

  const handleCancelEdit = (id) => {
    
    toggleEditMode(id);
  };

  const handleDeleteSelected = () => {
    
    const rowsToDelete = selectedRows.filter((id) =>
      filteredData.slice(page * 10, (page + 1) * 10).some((item) => item.id === id)
    );
  
    
    setData((prevData) =>
      prevData.filter((item) => !rowsToDelete.includes(item.id))
    );
    setFilteredData((prevFilteredData) =>
      prevFilteredData.filter((item) => !rowsToDelete.includes(item.id))
    );
    setSelectedRows([]); 
  };
  
  


  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editModeRows, setEditModeRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await axios.get(
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
    );
    setData(result.data);
    setFilteredData(result.data);
    setTotalPages(Math.ceil(result.data.length / 10));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
    setFilteredData(
      data.filter((item) => JSON.stringify(item).includes(e.target.value))
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]); 
  };

  const handleCheckboxChange = (id) => {
    
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const handleDeleteRow = (id) => {
  
    setData((prevData) => prevData.filter((item) => item.id !== id));
    setFilteredData((prevFilteredData) =>
      prevFilteredData.filter((item) => item.id !== id)
    );
    
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((rowId) => rowId !== id)
    );
  };

  const renderRow = (item, i) => {
    const isInEditMode = editModeRows.includes(item.id);
    const isSelected = selectedRows.includes(item.id);
    return (
      <tr key={i} className={isSelected ? 'selected-row' : ''}>
        <td>
          <input
            type="checkbox"
            checked={selectedRows.includes(item.id)}
            onChange={() => handleCheckboxChange(item.id)}
          />
        </td>
        {Object.values(item).map((value, j) => (
          <td key={j} className={` ${isInEditMode ? 'edit-mode' : ''}`} >
            {isInEditMode ? (
              <input
                type="text"
                value={value}
                onChange={(e) => handleEditChange(item.id, j, e.target.value)}
              />
            ) : (
              value
            )}
          </td>
        ))}
        <td>
          {isInEditMode ? (
            <>
              <button
                className="btn mr-2"
                onClick={() => handleSaveChanges(item.id)}
              >
                <FaSave />
              </button>
              <button
                className="btn"
                onClick={() => handleCancelEdit(item.id)}
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <button
              className="btn mr-2"
              onClick={() => toggleEditMode(item.id)}
            >
              <FaEdit />
            </button>
          )}
          <button
            className="btn"
            onClick={() => handleDeleteRow(item.id)}
          >
            <AiFillDelete />
          </button>
        </td>
      </tr>
    );
  };

  const handleEditChange = (id, columnIndex, newValue) => {
   
    setFilteredData((prevFilteredData) =>
      prevFilteredData.map((item) =>
        item.id === id
          ? { ...item, [Object.keys(item)[columnIndex]]: newValue }
          : item
      )
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
   
      setSelectedRows([]);
    } else {
      
      setSelectedRows(filteredData.map((item) => item.id));
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
        className="search-bar m-2"
      />
      <button
        className="btn btn-danger"
        onClick={handleDeleteSelected}
        disabled={selectedRows.length === 0}
      >
        <MdDelete />
      </button>
      <Table
        columns={[ 'ID','Name', 'Email', 'Role']}
        data={filteredData.slice(page * 10, (page + 1) * 10)}
        renderRow={renderRow}
        handleSelectAll={handleSelectAll}
      />
      <div className="footer">
        <div>
          {selectedRows.length > 0 && (
            <div className="selected-rows">
            <span>{`${selectedRows.length} row(s) selected`}</span>
            </div>
          )}
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(0)} disabled={page === 0}>
            First
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={page === totalPages - 1}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;