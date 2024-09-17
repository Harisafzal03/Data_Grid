import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import * as XLSX from 'xlsx';

const AgGridExample = () => {
  const [rowData, setRowData] = useState([]);

  const defaultColDef = useMemo(() => ({
    flex: 10,
    sortable: true, 
    filter: true,
    resizable: true,
  }), []);

  const [columnDefs] = useState([
    { headerName: "Make", field: "Make", sortable: true, filter: true, checkboxSelection: true },
    { headerName: "Model", field: "Model", sortable: true, filter: true },
    { headerName: "Price", field: "Price", sortable: true, filter: true }
  ]);

  useEffect(() => {
    const localData = [
      { Make: 'Toyota', Model: 'Celica', Price: 35000 },
      { Make: 'Ford', Model: 'Mondeo', Price: 32000 },
      { Make: 'Porsche', Model: 'Boxster', Price: 72000 }
    ];
    setRowData(localData);
  }, []);

  const onExportClick = () => {
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "export.xlsx");
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      // Transform data to match field names in columnDefs
      const transformedData = json.map(item => ({
        Make: item.Make,
        Model: item.Model,
        Price: item.Price
      }));

      console.log("Imported Data:", transformedData); // Log transformed data to inspect
      setRowData(transformedData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onExportClick}
        >
          Export to XLSX
        </button>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={onFileChange}
          className="file-input"
        />
      </div>
      <AgGridReact
        rowData={rowData}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default AgGridExample;
