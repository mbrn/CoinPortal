var tableNameFrmMonSsn = '#tblFrmMonSsn';
var tableFrmMonSsn;
var btnFrmMonSsnRetrieve = $('#btnFrmMonSsnRetrieve');
var btnFrmMonSsnSave = $('#btnFrmMonSsnSave');
var btnFrmMonSsnUpdate = $('#btnFrmMonSsnUpdate');
var btnFrmMonSsnDelete = $('#btnFrmMonSsnDelete');
var btnFrmMonSsnClear = $('#btnFrmMonSsnClear');
var modalBrowserInfoBody = '#modalBrowserInfoBody';
var formNameFrmMonSsn = '#frmFrmMonSsn';

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmMonSsn = Sigma.createDT({
        tableName: tableNameFrmMonSsn,
        responsive: false,
        stateSave: true,
        showButtons: true,
        fixedHeader: false,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Session No", mData: "SsnId" },
        { title: "Sistem Kullanıcı Adı", mData: "UsrId", sgLookup: tntAutUserLookup },
        { title: "Login Durumu", mData: "LoginStatus" },
        { title: "LoginResult", mData: "LoginResult", visible: false, searchable: false },
        { title: "Login Tipi", mData: "LoginType" },
        { title: "Başlangıç Tarihi", mData: "LoginStartDate" , sgType:'datetime'},
        { title: "Bitiş Tarihi", mData: "LoginEndDate", sgType: 'datetime' },
        { title: "Cihaz Bilgisi", mData: "CltUserName"},
        { title: "Ip Adresi", mData: "CltIpAddr"},
        { title: "Dil Bilgisi", mData: "CltLanguage" },
        { title: "Tarayıcı adı", mData: "BrowserName" },
        { title: "Tarayıcı Versiyon", mData: "BrowserVersion"},
        { title: "JS Versiyon", mData: "JsVersion" },
        { title: "Tarayıcı Bilgisi", mData: "BrowserInfo" },
        { title: "Mobil Cihaz mı", mData: "IsMobileDevice", sgType:'boolean' },
        { title: "Mobil Üretici", mData: "MobileDeviceMan" },
        { title: "Mobil Model", mData: "MobileDeviceMod" },
        ],
        columnDefs: [
              {
                  targets: 5,
                  render: function (data, type, full, meta) {
                      if (full.LoginStatus == "L")
                          return '<span class="label label-success"> Logged In  </span>'
                      else if (full.LoginStatus == "E")
                          return '<span class="label label-warning"> Hatalı </span>';
                      else if (full.LoginStatus == "K")
                          return '<span class="label label-danger"> Sonlandırılmış </span>';
                      else if (full.LoginStatus == "O")
                          return '<span class="label label-info"> Logged out</span>';
                      else
                          return "";
                  }
              },
               {
                   targets: 7,
                   render: function (data, type, full, meta) {
                       if (full.LoginType == "N")
                           return '<span class="label label-success"> Normal  </span>'
                       else if (full.LoginType == "C")
                           return '<span class="label label-warning"> Cookie </span>';
                       else if (full.LoginType == "T")
                           return '<span class="label label-danger"> Token </span>';
                       else
                           return "";
                   }
               },
            {
                targets: -7,
                render: function (data, type, full, meta) {
                    if (full.BrowserName == "Chrome")
                        return '<i class="fa fa-chrome"></i> <span > Chrome </span>';
                    else if (full.BrowserName == "InternetExplorer")
                        return '<i class="fa fa-internet-explorer"></i> <span > Internet Explorer </span>';
                    else if (full.BrowserName == "Firefox")
                        return '<i class="fa fa-firefox"></i> <span > Firefox </span>';
                    return full.BrowserName
                    
                }
            },
               
        ]
    });

    Sigma.validate({
        formName: formNameFrmMonSsn,
        rules: {
        },
        messages: {
        }
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    
    Sigma.createDateRangePicker({
        id: '#dateRange'
    });

    btnFrmMonSsnRetrieve.click(function () {
        GetFrmMonSsnInfo();
    });

    btnFrmMonSsnClear.click(function () { clearForm(); });
    /*============================================================================================*/

  
});

function GetFrmMonSsnInfo() {
    var obj = Sigma.objectFromForm(formNameFrmMonSsn);

    var minDate = Sigma.getDateRangePickerStartDate('#dateRange');
    var maxDate = Sigma.getDateRangePickerEndDate('#dateRange');
    var usrId = $('#UsrId').val().replace('-1', '');
    var loginStatus = $('#LoginStatus').val().replace('-1', '');
    var loginType = $('#LoginType').val().replace('-1', '');
    var browserName = $('#BrowserName').val().replace('-1', '');
    var deviceType = $('#deviceType').val().replace('-1', '');
    
    Sigma.ajax({
        url: "../../Base/FrmMonSsn/GetFrmMonSsnInfo",
        data: {
            ssnId: obj.SsnId, cltIpAddr: obj.CltIpAddr, usrId: usrId, loginStatus: loginStatus,
            loginType: loginType, browserName: browserName, deviceType: deviceType, minDate: minDate, maxDate: maxDate
        },
        showErrorToast: true,
        onSuccess: function (data) {
            tableFrmMonSsn.clear().draw();
            tableFrmMonSsn.rows.add(JSON.parse(data)).draw();
        }
    });
}

function clearForm() {

    $('#SsnId').val("");
    $('#CltIpAddr').val("");
    $('#CltIpAddr').val("");
    $('#UsrId').val(-1).trigger("change");
    $('#LoginStatus').val(-1).trigger("change");
    $('#LoginType').val(-1).trigger("change");
    $('#BrowserName').val(-1).trigger("change");
    $('#deviceType').val(-1).trigger("change");
    tableFrmMonSsn.clear().draw();
}

