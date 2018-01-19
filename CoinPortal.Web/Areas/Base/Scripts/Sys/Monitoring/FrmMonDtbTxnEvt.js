var tableNameFrmMonDtbTxnEvt = '#tblFrmMonDtbTxnEvt';
var tableFrmMonDtbTxnEvt;
var btnFrmMonDtbTxnEvtRetrieve = $('#btnFrmMonDtbTxnEvtRetrieve');
var btnFrmMonDtbTxnEvtClear = $('#btnFrmMonDtbTxnEvtClear');
var formNameFrmMonDtbTxnEvt = '#frmFrmMonDtbTxnEvt';

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmMonDtbTxnEvt = Sigma.createDT({
        tableName: tableNameFrmMonDtbTxnEvt,
        responsive: true,
        columns: [
        { title: "No", mData: "EvtId" },
        { title: "İşlem No", mData: "ActLogId" },
        { title: "Txn No", mData: "TxnId" },
        { title: "Query Tipi", mData: "EvtType" },
        { title: "Veritabanı Adı", mData: "DbName" },
        { title: "Schema", mData: "SchemaName" },
        { title: "Tablo Adı", mData: "TableName" },
        { title: "SQL", mData: "Query", visible: false, searchable: false },
        { title: "Old Json", mData: "OldJson" },
        { title: "New Json", mData: "NewJson" },
        { title: "Baş. Tarihi", mData: "EvtStartDateTime", sgType: 'datetime' },
        { title: "Bit. Tarihi", mData: "EvtEndDateTime", sgType: 'datetime' },
        { title: "Süre", mData: "Cost" },
        ],
        columnDefs:
            [
               {
                   targets: 3, // İşlem Durumu
                   render: function (data, type, full, meta) {
                       var x = '<div class="display-hide" header="Query">' + full.Query + '</div>';
                       switch (full.EvtType) {
                           case "SA": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select All </button>" + x; break;
                           case "SG": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select By Guid </button>" + x; break;
                           case "SK": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select By Key </button>" + x; break;
                           case "SE": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select Exists </button>" + x; break;
                           case "SV": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select Average </button>" + x; break;
                           case "SX": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select Max </button>" + x; break;
                           case "SN": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select Min </button>" + x; break;
                           case "SC": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select Count </button>" + x; break;
                           case "SS": return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Select Sum </button>" + x; break;                           
                           case "IN": return "<button type=\"button\" class=\"btn green-haze btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Insert </button>" + x; break;
                           case "UP": return "<button type=\"button\" class=\"btn green-haze btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Update </button>" + x; break;
                           case "DE": return "<button type=\"button\" class=\"btn red-soft btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Delete </button>" + x; break;
                           case "DA": return "<button type=\"button\" class=\"btn red-soft btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Delete All </button>" + x; break;
                           case "OP": return 'Open'; break;
                           case "CL": return 'Close'; break;
                           case "CM": return 'Commit'; break;
                           case "RB": return 'Rollback'; break;
                       }                       
                   }
               },
               {
                   targets: 8, // Çağıran Ekran
                   render: function (data, type, full, meta) {
                       if (full.OldJson == null || full.OldJson == "" || full.OldJson == undefined) {
                           return "";
                       }
                       
                       return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowJsonObj\"><i class=\"fa fa-eye\"></i> Göster </button>" +
                              '<div class="display-hide" header="Old Json">' + full.OldJson + '</div>';
                   }
               },
               {
                   targets: 9, // Parametreler
                   render: function (data, type, full, meta) {
                       if (full.NewJson == null || full.NewJson == "" || full.NewJson == undefined) {
                           return "";
                       }

                       return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowJsonObj\"><i class=\"fa fa-eye\"></i> Göster </button>" +
                              '<div class="display-hide" header="New Json">' + full.NewJson + '</div>';
                   }
               },               
            ],
    });

    Sigma.createDateRangePicker({
        id: '#dateRange',
        timePicker: true,
        startDate: moment().startOf('day'),
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    //Sigma.onDTRowSelected(tableNameFrmMonDtbTxnEvt, function (row) {
    //});

    btnFrmMonDtbTxnEvtRetrieve.click(function () {
        fillData();
    });

    $(tableNameFrmMonDtbTxnEvt + ' tbody').on('click', 'button.btnShowJsonObj', function () {
        var d = tableFrmMonDtbTxnEvt.row($(this).parents('tr')).data();

        var header = $(this).next().attr('header');
        var text = getJsonObjForm(d);

        $('#modalTextBody').show();
        $('#modalTextAreaContainer').hide();

        $('#modalTextHeader').text(header);
        $('#modalTextBody').html(text);
        $('#modalText').modal('show');
    });

    var codeMirror = CodeMirror.fromTextArea(document.getElementById('modalTextArea'), {
        mode: 'text/x-sql',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
    });

    $(tableNameFrmMonDtbTxnEvt + ' tbody').on('click', 'button.btnShowGridData', function () {
        var d = tableFrmMonDtbTxnEvt.row($(this).parents('tr')).data();

        var header = $(this).next().attr('header');
        var text = $(this).next().text();

        $('#modalTextBody').hide();
        $('#modalTextAreaContainer').show();

        $('#modalTextHeader').text(header);
        $('#modalText').modal('show');

        codeMirror.setValue(text);

        setTimeout(function () {
            codeMirror.refresh();
        }, 200);
    });

    btnFrmMonDtbTxnEvtClear.click(function () { clearForm(); });
    /*============================================================================================*/
});

function fillData() {
    var obj = {};
    obj.evtId = $('#EvtId').val();
    obj.actLogId = $('#ActLogId').val();
    obj.txnId = $('#TxnId').val();
    obj.evtType = $('#EvtType').val().replace('-1', '');
    obj.minDate = Sigma.getDateRangePickerStartDate('#dateRange');
    obj.maxDate = Sigma.getDateRangePickerEndDate('#dateRange');
    obj.dbName = $('#DbName').val().replace('-1', '');
    obj.schemaName = $('#SchemaName').val();
    obj.tableName = $('#TableName').val();

    Sigma.ajax({
        url: "../../Base/FrmMonDtbTxnEvt/GetFrmMonDtbTxnEvtList",
        data: obj,
        showErrorToast: true,
        onSuccess: function (data) {
            tableFrmMonDtbTxnEvt.clear().draw();
            tableFrmMonDtbTxnEvt.rows.add(JSON.parse(data)).draw();
        }
    });
}

function clearForm() {
    tableFrmMonDtbTxnEvt.clear().draw();
    $('#EvtId').val("");
    $('#ActLogId').val("");
    $('#TxnId').val("");
    $('#SchemaName').val("");
    $('#TableName').val("");
    $('#EvtType').val(-1).trigger("change");
    $('#DbName').val(-1).trigger("change");
}

