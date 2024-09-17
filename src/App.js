import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { ModuleRegistry } from '@ag-grid-community/core';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import React, { useCallback, useMemo, useState, useRef } from 'react';
import GridExample from './components/GridExample';
import AgGridExample from './components/AgGridExample';
import DragExample from './components/DragExample';
import DragandCreate from './components/DragandCreate';
import GroupExample from './components/GroupExample';

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
  minValidYear: 2000,
  maxValidYear: 2021,
  inRangeFloatingFilterDateFormat: "Do MMM YYYY",
};

const getBoolean = (inputSelector) => {
  const input = document.querySelector(inputSelector);
  return input ? !!input.checked : false;
};

const getParams = () => ({
  suppressQuotes: getBoolean("#suppressQuotes"),
});

const ragCellClassRules = {
  'rag-green-outer': (params) => params.value === 2008,
  'rag-blue-outer': (params) => params.value === 2004,
  'rag-red-outer': (params) => params.value === 2000,
};

const ragRenderer = (params) => <span className="rag-element">{params.value}</span>;

const numberParser = (params) => {
  const newValue = params.newValue;
  const valueAsNumber = parseFloat(newValue);
  return isNaN(valueAsNumber) ? null : valueAsNumber;
};

const App = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '100vh' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState(null);

  const [columnDefs] = useState([
    { 
      field: 'athlete', 
      headerClass: 'bg-blue-500 text-white',
      filter: 'agTextColumnFilter', 
      floatingFilter: true,  
      multiFilter: true      
    },
    { 
      field: 'age', 
      maxWidth: 90, 
      valueParser: numberParser, 
      filter: 'agNumberColumnFilter', 
      floatingFilter: true, 
      multiFilter: true               
    },
    { 
      field: 'country', 
      filter: 'agTextColumnFilter',    
      floatingFilter: true, 
      multiFilter: true 
    },
    { 
      field: 'year', 
      maxWidth: 90, 
      cellClassRules: ragCellClassRules, 
      cellRenderer: ragRenderer, 
      filter: 'agNumberColumnFilter',  
      floatingFilter: true, 
      multiFilter: true 
    },
    { 
      field: 'date', 
      cellClass: 'bg-green-300',
      filter: "agDateColumnFilter",
      filterParams: filterParams,
      floatingFilter: true, 
      multiFilter: true 
    },
    { 
      field: 'sport', 
      cellClass: (params) => params.value === 'Swimming' ? 'bg-blue-300' : 'bg-red-300', 
      filter: 'agTextColumnFilter',    
      floatingFilter: true, 
      multiFilter: true 
    },
    { 
      field: 'gold', 
      valueParser: numberParser, 
      cellStyle: { backgroundColor: '#aaffaa' },
      filter: 'agNumberColumnFilter',  
      floatingFilter: true, 
      multiFilter: true 
    },
    { 
      field: 'silver', 
      valueParser: numberParser,
      filter: 'agNumberColumnFilter',  
      floatingFilter: true, 
      multiFilter: true 
    },
    { 
      field: 'bronze', 
      valueParser: numberParser,
      filter: 'agNumberColumnFilter',  
      floatingFilter: true, 
      multiFilter: true 
    },
  ]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 150,
    editable: true,
    sortable: true,
    resizable: true,
    filter: true,              
  }), []);

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onBtnExport = useCallback(() => {
    const params = getParams();
    if (params.suppressQuotes) {
      alert(
        "NOTE: you are downloading a file with non-standard quotes - it may not render correctly in Excel.",
      );
    }
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv(params);
    }
  }, []);

  const onBtnUpdate = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      const csv = gridRef.current.api.getDataAsCsv(getParams());
      document.querySelector("#csvResult").value = csv;
    }
  }, []);

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-center text-2xl font-bold mb-4">Olympic Winners Data Grid</h1>
      <div className='flex gap-5 my-10'>
        <button onClick={onBtnUpdate} className='rounded-xl border border-blue-600 px-4 py-2 bg-blue-500 text-white'>Show CSV export content text</button>
        <button onClick={onBtnExport} className='rounded-xl border border-gray-600 px-4 py-2 bg-gray-500 text-slate-50'>Download CSV export file</button>
      </div>
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            animateRows={true}
            multiSortKey="ctrl"  
          />
        </div>
      </div>
      <div className='container mx-auto my-10'>
        <h2 className="text-center text-2xl font-bold mb-4">Small Company Data Grid</h2>
        <GridExample />
      </div>
      <div className='container mx-auto my-10'>
        <h2 className="text-center text-2xl font-bold mb-4">Import Xlsx Data Grid</h2>
        <AgGridExample/>
      </div>
      <div className='container mx-auto my-10'>
        <h2 className="text-center text-2xl font-bold mb-4">Drag and Drop Data Grid</h2>
        <DragExample/>
      </div>
      <div className='container mx-auto my-10'>
        <h2 className="text-center text-2xl font-bold mb-4">Drag and Drop Data Grid</h2>
        <DragandCreate/>
      </div>
      <div className='container mx-auto my-10'>
        <h2 className="text-center text-2xl font-bold mb-4">Print Data Grid</h2>
        <GroupExample/>
      </div>
      <textarea id="csvResult" className="w-full"></textarea>
    </div>
  );
};

export default App;