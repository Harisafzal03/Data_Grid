import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./styles.css";
import { getData } from "./ data";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const DragExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "40vh" }), []);
  const gridStyle = useMemo(() => ({ height: "40vh", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Drag", valueGetter: "'Drag'", dndSource: true },
    { field: "id" },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ]);

  const defaultColDef = useMemo(() => ({
    width: 80,
    filter: true,
  }), []);

  const rowClassRules = useMemo(() => ({
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  }), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault(); // Necessary to allow dropping
    event.dataTransfer.dropEffect = "move"; // Shows the move cursor
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const jsonData = event.dataTransfer.getData("application/json");
    const eJsonRow = document.createElement("div");
    eJsonRow.classList.add("json-row");
    eJsonRow.innerText = jsonData;
    const eJsonDisplay = document.querySelector("#eJsonDisplay");
    eJsonDisplay.appendChild(eJsonRow);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="outer">
        <div className="grid-col">
          <div
            style={gridStyle}
            className="ag-theme-quartz"
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowClassRules={rowClassRules}
              rowDragManaged={true}
              rowDragMultiRow={true} // Optional: allow multi-row drag
            />
          </div>
        </div>
        <div
          className="drop-col"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <span id="eDropTarget" className="drop-target">
            {" "}==&gt; Drop to here{" "}
          </span>
          <div id="eJsonDisplay" className="json-display"></div>
        </div>
      </div>
    </div>
  );
};

export default DragExample;