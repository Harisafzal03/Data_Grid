import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./styles.css";
import { getData } from "./newdata";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

const setPrinterFriendly = (api) => {
  const eGridDiv = document.querySelector("#myGrid");
  eGridDiv.style.width = "";
  eGridDiv.style.height = "";
  api.setGridOption("domLayout", "print");
};

const setNormal = (api) => {
  const eGridDiv = document.querySelector("#myGrid");
  eGridDiv.style.height = "400px";
  api.setGridOption("domLayout", undefined);
};

const GroupExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "40vh", width: "100%" }), []);
  const [rowData, setRowData] = useState(getData());
  const [columnDefs, setColumnDefs] = useState([
    { field: "group", rowGroup: true, hide: true },
    { field: "id", pinned: "left", minwidth: 70 },
    { field: "model", minwidth: 180 },
    { field: "color", minwidth: 100 },
    {
      field: "price",
      valueFormatter: "'$' + value.toLocaleString()",
      minwidth: 100,
    },
    { field: "year", minwidth: 100 },
    { field: "country", minwidth: 120 },
  ]);

  const onFirstDataRendered = useCallback((params) => {
    params.api.expandAll();
  }, []);

  const onBtPrint = useCallback(() => {
    setPrinterFriendly(gridRef.current.api);
    setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
      print();
      setNormal(gridRef.current.api);
    }, 2000);
    // eslint-disable-next-line no-restricted-globals
  }, [print]);

  return (
    <div style={containerStyle}>
      <button onClick={onBtPrint}>Print</button>
      <h3>Latin Text</h3>
      <p>
        Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae
        neglegentur ad nam, mei amet eros ea, populo deleniti scaevola et pri.
        Pro no ubique explicari, his reque nulla consequuntur in. His soleat
        doctus constituam te, sed at alterum repudiandae. Suas ludus electram te
        ius.
      </p>
      <div
        id="myGrid"
        style={gridStyle}
        className={
          "ag-theme-quartz"
        }
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          groupDisplayType={"groupRows"}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>
    </div>
  );
};

export default GroupExample;