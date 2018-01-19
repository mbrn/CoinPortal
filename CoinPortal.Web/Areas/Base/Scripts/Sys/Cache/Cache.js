var tableNameCache = '#tblCache';
var tableCache;
var btnCacheRetrieve = $('#btnCacheRetrieve');
var btnCacheRefreshAll = $('#btnCacheRefreshAll');
var btnCacheRefreshSelected = $('#btnCacheRefreshSelected');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableCache = Sigma.createDT({
        tableName: tableNameCache,
        columns: [
            { sgType: "checkable" },
            { title: "Güncelle" , sortable: false, width: 50},
        { title: "DataBase", mData: "DataBase" },
        { title: "Schema", mData: "Schema" },
        { title: "Table", mData: "Table" },
        { title: "Namespace", mData: "Namespace", visible: false, searchable: false },
        { title: "Class", mData: "Class" },
        { title: "Load DateTime", mData: "LoadDateTime", sgType: 'datetime'},
        { title: "Item Count", mData: "ItemCount" },
        
        ],        
        columnDefs: [
            {
                targets: 1,
                defaultContent: "<button type=\"button\" class=\"btn blue-madison btn-xs btnRefreshCache\"><i class=\"fa fa-refresh\"></i> Güncelle</button>"
            }
        ]
    });    

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    btnCacheRetrieve.click(function () {
        fillData();
    });

    btnCacheRefreshAll.click(function () {
        Sigma.ajax({
            url: "../../Base/Cache/ReloadAllCaches",
            showErrorToast: true,
            showSuccessToast: true,
            onSuccess: function () {
                fillData();
            }
        });
    });

    btnCacheRefreshSelected.click(function () {
        var arr = Sigma.getCheckedRows(tableCache);

        if (arr == null || arr.length == 0) {
            Sigma.toastWarning('En az bir tane seçim yapmalısınız');
            return;
        }
            
        Sigma.ajax({
            url: "../../Base/Cache/ReloadCaches",
            data: arr,
            showErrorToast: true,
            showSuccessToast: true,
            onSuccess: function () {
                fillData();
            }
        });
    });

    $(tableNameCache + ' tbody').on('click', 'button.btnRefreshCache', function () {
        var d = tableCache.row($(this).parents('tr')).data();

        Sigma.ajax({
            url: "../../Base/Cache/ReloadCache",
            data: { namezpace: d.Namespace, className: d.Class },
            showErrorToast: true,
            showSuccessToast: true,
            onSuccess: function () {
                fillData();
            }
        });
    });

    fillData();
    
    /*============================================================================================*/
});

function fillData() {    
    Sigma.ajax({
        url: "../../Base/Cache/GetCacheList",        
        showErrorToast: true,
        onSuccess: function (data) {
            tableCache.clear().draw();
            tableCache.rows.add(JSON.parse(data)).draw();
        }
    });
}

