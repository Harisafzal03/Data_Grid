import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./styles.css";
import CompanyLogoRenderer from "./companyLogoRenderer.jsx";
import CompanyRenderer from "./companyRenderer.jsx";
import CustomButtonComponent from "./customButtonComponent.jsx";
import MissionResultRenderer from "./missionResultRenderer.jsx";
import PriceRenderer from "./priceRenderer.jsx";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  SetFilterModule,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "40vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);

  const defaultColDef = useMemo(() => ({
    flex: 10,
    sortable: true, 
    filter: true,
    resizable: true,
  }), []);

  const [columnDefs] = useState([
    {
      field: "company",
      flex: 6,
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: "website",
      cellRenderer: CompanyRenderer,
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: "Logo",
      field: "company",
      cellRenderer: CompanyLogoRenderer,
      cellClass: "logoCell",
      minWidth: 100,
      sortable: false, 
    },
    {
      field: "revenue",
      cellRenderer: PriceRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter', 
    },
    {
      field: "hardware",
      headerName: "Hardware",
      cellRenderer: MissionResultRenderer,
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: CustomButtonComponent,
      sortable: false, 
    },
  ]);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/small-company-data.json")
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact
          rowData={rowData}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          sideBar={{
            toolPanels: [
              { id: "columns", labelDefault: "Columns", labelKey: "columns", iconKey: "columns", toolPanel: "agColumnsToolPanel" },
              { id: "filters", labelDefault: "Filters", labelKey: "filters", iconKey: "filters", toolPanel: "agFiltersToolPanel" }
            ],
            defaultToolPanel: "filters",
            position:"left"
          }}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default GridExample;
