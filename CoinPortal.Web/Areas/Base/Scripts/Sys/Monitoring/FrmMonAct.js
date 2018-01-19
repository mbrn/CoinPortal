var tableNameFrmMonAct = '#tblFrmMonAct';
var tableFrmMonAct;
var btnFrmMonActRetrieve = $('#btnFrmMonActRetrieve');
var btnFrmMonActClear = $('#btnFrmMonActClear');
var formNameFrmMonAct = '#frmFrmMonAct';
var oldRow = null;
var oldTr = null;
jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    tableFrmMonAct = Sigma.createDT({
        tableName: tableNameFrmMonAct,
        columns: [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,                
                "defaultContent": '<button type=\"button\" class=\"btn blue-madison btn-xs btnShowDbTxnEvt\"><i class=\"fa fa-database\"></i></button>'
            },
        { title: "İşlem No", mData: "LogId" },
        { title: "Session No", mData: "SsnId" },
        { title: "İşlem Tarihi", mData: "LogDate", sgType: 'date' },
        { title: "İşlem Zamanı", mData: "LogTime", sgType: 'time' },
        { title: "İşlem Durumu", mData: "LogStatus" },
        { title: "Tenant Tipi", mData: "TntType", sgLookup: tntTypeLookup },
        { title: "Tenant Adı", mData: "TntId", sgLookup: tntLookup },
        { title: "Kullanıcı Adı", mData: "Username" },
        { title: "Ekran", mData: "ScreenItemId", sgLookup: screenLookup },
        { title: "Area", mData: "Area"  },
        { title: "Controller", mData: "Controller" },
        { title: "Action", mData: "Action" },
        { title: "Çağıran Ekran", mData: "CallerScreenItemId", sgLookup: screenLookup },
        { title: "Çağıran Ekran", mData: "CallerArea" , visible: false, searchable: false },
        { title: "CallerController", mData: "CallerController" },
        { title: "CallerAction", mData: "CallerAction" },
        { title: "Parametreler", mData: "Parameters" },
        { title: "Ajax", mData: "IsAjax", sgType: 'boolean' },
        { title: "Action Baş.", mData: "ActionStartDateTime", sgType: 'datetime', visible: false, searchable: false },
        { title: "Action Bit.", mData: "ActionEndDateTime", sgType: 'datetime', visible: false, searchable: false },
        { title: "Result Baş.", mData: "ResultStartDateTime", sgType: 'datetime', visible: false, searchable: false },
        { title: "Result Bit.", mData: "ResultEndDateTime", sgType: 'datetime', visible: false, searchable: false },
        { title: "Action Süresi", mData: "ActionCost" },
        { title: "Result Süresi", mData: "ResultCost" },
        { title: "Toplam Süre", mData: "TotalCost" },
        { title: "Action Hata Tipi", mData: "ActionExceptionType" },
        { title: "ActionExceptionDetail", mData: "ActionExceptionDetail", visible: false, searchable: false },
        { title: "ResultExceptionType", mData: "ResultExceptionType" },
        { title: "Result Hata Tipi", mData: "ResultExceptionDetail", visible: false, searchable: false },
        ],
        columnDefs:[
        {
            targets: 4, // İşlem Durumu
            render: function (data, type, full, meta) {
                switch (full.LogStatus) {
                    case "AS": return '<span class="badge badge-info badge-roundless"> Action devam ediyor...  </span>'; break;
                    case "AE": return '<span class="badge badge-danger badge-roundless"> Action hata aldı  </span>'; break;
                    case "AF": return '<span class="badge badge-info badge-roundless"> Action bitti </span>'; break;
                    case "RS": return '<span class="badge badge-info badge-roundless"> Result devam ediyor...  </span>'; break;
                    case "RE": return '<span class="badge badge-danger badge-roundless"> Result hata aldı  </span>'; break;
                    case "RF": return '<span class="badge badge-success badge-roundless"> Başarılı </span>'; break;
                }
            }
        },
        {
            targets: 9, //  Ekran
            render: function (data, type, full, meta) {
                if (full.ScreenItemId == null ||full.ScreenItemId == 0) {
                    return "";
                }
                var rootUrl = window.location.origin ? window.location.origin + '/' : window.location.protocol + '/' + window.location.host + '/';

                if (screenLookup[full.ScreenItemId] != undefined) {
                    return '<a href="' + rootUrl + full.Area + '/' + full.Controller + '/Index' + '" target="_blank">' + screenLookup[full.ScreenItemId] + '</a>';
                }
                else {
                    if (full.Area == null || full.Area == "" || full.Area == undefined) {
                        return "";
                    }
                    return '<a href="' + rootUrl + full.Area + '/' + full.Controller + '/' + full.Action + '" target="_blank">' + full.Area + "/" + full.Controller + "/Index" +  + '</a>';
                }
            }
        },
        {
            targets: 13, // Çağıran Ekran
            render: function (data, type, full, meta) {
                if (full.CallerScreenItemId == null || full.CallerScreenItemId == 0) {
                    return "";
                }
                var rootUrl = window.location.origin ? window.location.origin + '/' : window.location.protocol + '/' + window.location.host + '/';
                
                if (screenLookup[full.CallerScreenItemId] != undefined) {
                    return '<a href="' + rootUrl + full.CallerArea + '/' + full.CallerController + '/' + full.CallerAction + '" target="_blank">' + screenLookup[full.CallerScreenItemId] + '</a>';
                }
                else {
                    if (full.CallerArea == null || full.CallerArea == "" || full.CallerArea == undefined) {
                        return "";
                    }
                    return '<a href="' + rootUrl + full.CallerArea + '/' + full.CallerController + '/' + full.CallerAction + '" target="_blank">' + full.CallerArea + "/" + full.CallerController + "/" + full.CallerAction + '</a>';
                }
            }
        },
        {
            targets: 17, // Parametreler
            render: function (data, type, full, meta) {
                if (full.Parameters == null || full.Parameters == "" || full.Parameters == undefined) {
                    return "";
                }
                if (full.Parameters.length <= 20)
                    return full.Parameters;
                else
                    return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> Göster</button>" +
                           '<div class="display-hide" header="Parametreler" type="json">' + full.Parameters + '</div>';
            }
        },
        {
            targets: 26, // Action Hata Detayı
            render: function (data, type, full, meta) {
                if (full.ActionExceptionType == null || full.ActionExceptionType == "" || full.ActionExceptionType == undefined) {
                    return "";
                }
                
                return '<button type=\"button\" class=\"btn red-soft btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> ' + full.ActionExceptionType + '</button>' +
                        '<div class="display-hide" header="Exception" type="exception">' + full.ActionExceptionDetail + '</div>';
            }
        },
        {
            targets: 28, // Result Hata Detayı
            render: function (data, type, full, meta) {
                if (full.ResultExceptionType == null || full.ResultExceptionType == "" || full.ResultExceptionType == undefined) {
                    return "";
                }
                return '<button type=\"button\" class=\"btn red-soft btn-xs btnShowGridData\"><i class=\"fa fa-eye\"></i> ' + full.ResultExceptionType + '</button>' +
                        '<div class="display-hide" header="Exception" type="exception">' + full.ResultExceptionDetail + '</div>';
            },

        }],
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
    btnFrmMonActRetrieve.click(function () {
      
        fillData();
    });
    
    var codeMirror = CodeMirror.fromTextArea(document.getElementById('modalTextArea'), {
        mode: 'text/x-sql',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
    });

    $(tableNameFrmMonAct + ' tbody').on('click', 'button.btnShowGridData', function () {
        var d = Sigma.getSelectedRow(tableFrmMonAct, this);

        var header = $(this).next().attr('header');
        var type = $(this).next().attr('type');
        var text = $(this).next().text();

        $('#modalTextHeader').text(header);
        $('#modalText').modal('show');

        if (type == "json") {
            $('#modalTextBody').show();
            $('#modalTextAreaContainer').hide();

            $('#modalTextBody').html('');
            $('#modalTextBody').jsonView(JSON.parse(text));
        }
        else if (type == "exception") {
            $('#modalTextBody').show();
            $('#modalTextAreaContainer').hide();

            $('#modalTextBody').text(text);
        }
        else {
            $('#modalTextBody').hide();
            $('#modalTextAreaContainer').show();

            codeMirror.setValue(text);                       

            setTimeout(function () {
                codeMirror.refresh();
            }, 200);
        }
    });

    //$(tableNameFrmMonAct + ' tbody').on('click', 'button.btnShowDbTxnEvt', function () {
    $(tableNameFrmMonAct + ' tbody').on('click', 'td.details-control', function () {        
        var tr = $(this).closest('tr');
        var row = tableFrmMonAct.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            //$(evtTableWrapper).hide();
            tr.removeClass('shown');
        }
        else {
            if (oldRow != null) {
                oldRow.child.hide();
                //$(evtTableWrapper).hide();
                oldTr.removeClass('shown');
            }
            oldRow = row;
            oldTr = tr;

            // Open this row
            //row.child(format(row.data())).show();
            
            $('#evtTableWrapper').closest('tr').addClass('bg-default');
            var html = ' <div class="portlet light  col-md-6">';
            html += '<div id ="evtTableWrapper" >' +
                //style="width:' + ($(tableNameFrmMonAct + '_wrapper').width() - 20) + 'px;"
                '<div class="portlet-title">                                                        ' +
                        '            <div class="caption">                                                          ' +
                        '                <span class="caption-subject font-blue-madison bold">VERİTABANI İŞLEMLERİ:</span>  ' +
                        '            </div>                                                                         ' +
                        '        </div>    '+
                                  '<table id="tblFrmMonDtbTxnEvt" class="table table-striped table-hover table-bordered dataTable no-footer" cellspacing="0" role="grid" aria-describedby="tblFrmMonDtbTxnEvt_info"></table>' +
                           '</div>' +  
                          '</div>';

            row.child(html).show();
            tableFrmMonDtbTxnEvt = Sigma.createDT({
                tableName: tableNameFrmMonDtbTxnEvt,
                responsive: true,
                fixexHeader: false,
                showSearch: true,
                showPagingSize: true,
                showTableInfo: true,
                columns: [
                { title: "No", mData: "EvtId" },
                { title: "İşlem No", mData: "ActLogId", visible: false, searchable: false },
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
                               var x = '<div class="display-hide" header="Query" type="sql">' + full.Query + '</div>';
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
                           targets: 8, // Old Json
                           render: function (data, type, full, meta) {
                               if (full.OldJson == null || full.OldJson == "" || full.OldJson == undefined) {
                                   return "";
                               }

                               return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowJsonObj\"><i class=\"fa fa-eye\"></i> Göster </button>" +
                                      '<div class="display-hide" header="Old Json">' + full.OldJson + '</div>';
                           }
                       },
                       {
                           targets: 9, // New Json
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

            Sigma.ajax({
                url: "../../Base/FrmMonDtbTxnEvt/GetFrmMonDtbTxnEvtListWithLogId",
                data: { logId: row.data().LogId, ssnId: row.data().SsnId },
                showErrorToast: true,
                onSuccess: function (data) {
                    var txnInfo = JSON.parse(data);
                    if (txnInfo.txnSsn != null)
                        $(GenSsnForm(txnInfo.txnSsn)).insertBefore("#evtTableWrapper");
                    tableFrmMonDtbTxnEvt.clear().draw();
                    tableFrmMonDtbTxnEvt.rows.add(txnInfo.txnEvt).draw();

                    tr.next('tr').attr("style", "background-color:#eef1f5 !important");
                  
                }
            });

            tr.addClass('shown');
        }
    });

    $('body').on('click', tableNameFrmMonDtbTxnEvt + ' tbody button.btnShowJsonObj', function () {
 
        var d = Sigma.getSelectedRow(tableFrmMonDtbTxnEvt, this);
        var header = $(this).next().attr('header');
        var text = getJsonObjForm(d);

        $('#modalTextBody').show();
        $('#modalTextAreaContainer').hide();

        $('#modalTextHeader').text(header);
        $('#modalTextBody').html(text);
        $('#modalText').modal('show');
    });

    btnFrmMonActClear.click(function () { clearForm(); });
    /*============================================================================================*/
});

function GenSsnForm(ssn)
{
    var ssnHtmlForm = ' ' +
                        '        <div class="portlet-title">                                                        ' +
                        '            <div class="caption">                                                          ' +
                        '                <span class="caption-subject font-red-sunglo bold">SESSION BİLGİSİ</span>  ' +
                        '            </div>                                                                         ' +
                        '        </div>                                                                             ' +
                        '        <div class="portlet-body form ">                                                   ' +
                        '            <form class="form-horizontal" role="form" style=" margin-bottom:20px;">                                     ' +
                        '                <div class="form-body" style="padding-top:0px;padding-bottom:0px;">        ' +
                        '                   <style> .form-group {margin-bottom : 0px !important;} </style>          ' +
                        '                    <div class="row">                                                      ' +
                                                 GenSsnFormField("Session No", ssn.SsnId) +
                                                 GenSsnFormField("Sistem Kullanıcı Id", ssn.UsrDisplayName) +
                                                 GenSsnFormField("Login Durumu", GetLoginStatus(ssn.LoginStatus)) +
                        '                    </div>                                                                 ' +
                        '                    <div class="row">                                                      ' +
                                                 GenSsnFormField("Login Tipi", GetLoginType(ssn.LoginType)) +
                                                 GenSsnFormField("Başlangıç Tarihi", moment(ssn.LoginStartDate).format('DD.MM.YYYY HH:mm:ss')) +
                                                 GenSsnFormField("Bitiş Tarihi", moment(ssn.LoginEndDate).format('DD.MM.YYYY HH:mm:ss')) +
                        '                    </div>                                                                 ' +
                        '                    <div class="row">                                                      ' +
                                                 GenSsnFormField("Ip Adresi", ssn.CltIpAddr) +
                                                 GenSsnFormField("Cihaz Bilgisi", ssn.CltUserName) +
                                                 GenSsnFormField("Dil Bilgisi", ssn.CltLanguage) +
                        '                    </div>                                                                 ' +
                        '                    <div class="row">                                                      ' +
                                                 GenSsnFormField("Tarayıcı adı", GetBrowser(ssn.BrowserName)) +
                                                 GenSsnFormField("Tarayıcı Versiyon", ssn.BrowserVersion) +
                                                 GenSsnFormField("JS Versiyon", ssn.JSVersion) +
                        '                    </div>                                                                 ' +
                        '                    <div class="row">                                                      ' +
                                                 GenSsnFormField("Mobil Cihaz mı", ssn.IsMobileDevice) +
                                                 GenSsnFormField("Mobil Üretici", ssn.MobileDeviceMan) +
                                                 GenSsnFormField("Mobil Model", ssn.MobileDeviceMod) +
                        '                    </div>                                                                 ' +
                        '                </div>                                                                     ' +
                        '            </form>                                                                        ' +
                        '        </div>                                                                             ';
    return ssnHtmlForm;
}

function GenSsnFormField(label,value)
{
    var ssnFormFld =    '   <div class="col-md-4">  ' +
                        '     <div class="form-group"> ' +
                        '           <label class="control-label col-md-6">' + label + ':</label>' +
                        '           <div class="col-md-6">' +
                        '               <p class="form-control-static  bold font-blue-madison">' + value + ' </p> ' +
                        '           </div>' +
                        '     </div>' +
                        '   </div> ';

    return ssnFormFld;
}

function GetLoginStatus(loginStatus)
{
    if (loginStatus == "L")
        return '<span class="label label-success"> Logged In  </span>'
    else if (loginStatus == "E")
        return '<span class="label label-warning"> Hatalı </span>';
    else if (loginStatus == "K")
        return '<span class="label label-danger"> Sonlandırılmış </span>';
    else if (loginStatus == "O")
        return '<span class="label label-info"> Logged out</span>';
    else
        return "";
}

function GetLoginType(loginType) {
    if (loginType == "N")
        return '<span class="label label-success"> Normal  </span>'
    else if (loginType == "C")
        return '<span class="label label-warning"> Cookie </span>';
    else if (loginType == "T")
        return '<span class="label label-danger"> Token </span>';
    else
        return "";
}

function GetBrowser(browserName)
{
    if (browserName == "Chrome")
        return '<i class="fa fa-chrome"></i> <span > Chrome </span>';
    else if (browserName == "InternetExplorer")
        return '<i class="fa fa-internet-explorer"></i> <span > Internet Explorer </span>';
    else if (browserName == "Firefox")
        return '<i class="fa fa-firefox"></i> <span > Firefox </span>';
    return browserName
                    
}
function fillData() {
    var obj = {};
    obj.logId = $('#LogId').val();
    obj.ssnId = $('#SsnId').val();
    obj.minDate = Sigma.getDateRangePickerStartDate('#dateRange');
    obj.maxDate = Sigma.getDateRangePickerEndDate('#dateRange');
    obj.logStatus = $('#LogStatus').val().replace('-1', '');
    obj.username = $('#Username').val().replace('-1', '');
    obj.TntType = $('#TntType').val().replace('-1', '');
    obj.TntId = $('#TntId').val();
    obj.callerScreen = $('#CallerScreen').val().replace('-1', '');
    obj.isAjax = $('#IsAjax').val().replace('-1', '');
    obj.area = $('#Area').val();
    obj.controller = $('#Controller').val();
    obj.action = $('#Action').val();
    obj.TotalCost = $('#TotalCost').val().replace('', '0');;
    

    Sigma.ajax({
        url: "../../Base/FrmMonAct/GetFrmMonActList",
        data: obj,
        showErrorToast: true,
        onSuccess: function (data) {
            tableFrmMonAct.clear().draw();
            tableFrmMonAct.rows.add(JSON.parse(data)).draw();
        }
    });
}

function clearForm() {
    tableFrmMonAct.clear().draw();
    $('#Area').val("");
    $('#Controller').val("");
    $('#Action').val("");
    $('#LogId').val("");
    $('#SsnId').val("");
    $('#TotalCost').val("");
    $('#LogStatus').val(-1).trigger("change");
    $('#TntType').val(-1).trigger("change");
    $('#TntId').val(-1).trigger("change");
    $('#Username').val(-1).trigger("change");
    $('#CallerScreen').val(-1).trigger("change");
    $('#IsAjax').val(-1).trigger("change");

}

/*============================================================================================*/
// MonDtbTxnEvt
/*============================================================================================*/


var tableNameFrmMonDtbTxnEvt = '#tblFrmMonDtbTxnEvt';
var evtTableWrapper = '#evtTableWrapper';
var tableFrmMonDtbTxnEvt;

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    

    //$(evtTableWrapper).hide();

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/


    /*============================================================================================*/
});

