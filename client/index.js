import {Grid} from 'ag-grid-community';
import 'ag-grid-enterprise';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";


const datasource = {
    getRows(params) {
         console.log(JSON.stringify(params.request, null, 1));

         fetch('http://127.0.0.1:8000/api/olympicWinners', {
             method: 'post',
             body: JSON.stringify(params.request),
             headers: {"Content-Type": "application/json; charset=utf-8"}
         })
         .then(httpResponse => httpResponse.json())
            .then(response => {
		if(response.secondaryColDefs != null) {
		    gridOptions.columnApi.setSecondaryColumns(response.secondaryColDefs);
		}
		params.successCallback(response.rows, response.lastRow);
            })
         .catch(error => {
             console.error(error);
             params.failCallback();
         })
    },

    getValues: function(params) {
         console.log(JSON.stringify(params, null, 1));

         fetch('http://127.0.0.1:8000/api/olympicWinners/'+params.colDef.field, {
             method: 'get',
             headers: {"Content-Type": "application/json; charset=utf-8"}
         })
            .then(httpResponse => {return httpResponse.json()})
	    .then(response => params.success(response))
	    .catch(error => {
		console.error(error);
	    })

    }
};


const columnDefs = [
    {
	field: 'athlete', enablePivot: true, enableRowGroup: true,
	filter: 'agTextColumnFilter',
    },
    {field: 'country', enableRowGroup: true, rowGroup: true, hide: false, enablePivot: true,
     filter: 'agSetColumnFilter',
     filterParams: { values: datasource.getValues }
    },
    {field: 'sport', enableRowGroup: true, rowGroup: true, hide: false,
     filter: 'agSetColumnFilter',
     filterParams: { values: datasource.getValues }
    },
    {field: 'year', enablePivot: true, hide: false,
     filter: 'agSetColumnFilter',
     filterParams: { values: datasource.getValues }
    },
    {field: 'age', filter: 'agNumberColumnFilter'},
    {field: 'gold', type: 'valueColumn'},
    {field: 'silver', type: 'valueColumn'},
    {field: 'bronze', type: 'valueColumn'},
];

const gridOptions = {
  columnDefs,

  // use the server-side row model
  rowModelType: 'serverSide',
    enableServerSideFilter: true,
  // fetch 100 rows per at a time
  cacheBlockSize: 200,

  // only keep 10 blocks of rows
  maxBlocksInCache: 10,

  sideBar: true,
  pivotMode: false,

  enableColResize: true,
  enableSorting: true,
  enableFilter: true,

  columnTypes: {
    dimension: {
      enableRowGroup: true,
      enablePivot: true,
    },
    valueColumn: {
      width: 150,
      aggFunc: 'sum',
      enableValue: true,
      cellClass: 'number',
      allowedAggFuncs: ['avg','sum','min','max']
    }
  },
};

const gridDiv = document.querySelector('#myGrid');
new Grid(gridDiv, gridOptions);


gridOptions.api.setServerSideDatasource(datasource);
