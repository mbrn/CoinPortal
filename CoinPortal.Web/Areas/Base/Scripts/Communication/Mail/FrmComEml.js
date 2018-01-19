var tableNameFrmComEml = '#tblFrmComEml';
var tableFrmComEml;
var btnFrmComEmlRetrieve = $('#btnFrmComEmlRetrieve');
var btnFrmComEmlCancel = $('#btnFrmComEmlCancel');
var btnFrmComEmlClear = $('#btnFrmComEmlClear');
var formNameFrmComEml = '#frmFrmComEml';

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmComEml = Sigma.createDT({
        tableName: tableNameFrmComEml,
        responsive: true,
        stateSave: true,
        showButtons: true,
        fixedHeader: false,
        columns: [
           { title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkboxes_0"><span></span></label>', searchable: false, orderable: false },
           { title: "Guid", mData: "Guid", visible: false, searchable: false },
           { title: "Status", mData: "Status", visible: false, searchable: false },
           { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
           { title: "Grup No", mData: "GrpId", visible: false, searchable: false },
           { title: "Gönderici Hesap", mData: "AccId", sgLookup: comEmlaccLookup },
           { title: "Gönderilen Adress", mData: "FromAddress" },
           { title: "Görünen Ad", mData: "DisplayName" },
           { title: "Mailler", mData: "Count" },
           { title: "Başarılı Adeti", mData: "SuccessCount" },
           { title: "Hatalı Adeti", mData: "ErrorCount" },
           { title: "Durumu", mData: "MailStatus", sgLookup: comEmlLookup },
           { title: "Kayıt Tarihi", mData: "InsertDate", sgType: "date", visible: false, searchable: false },
           { title: "Kayıt Zamanı", mData: "InsertTime", sgType: "time", visible: false, searchable: false },
           { title: "Gönderilme Tarihi", mData: "WaitDate", sgType: "date" },
           { title: "Gönderileceği Tarih", mData: "WaitTime", sgType: "time" },
           { title: "Gönderileceği Zaman", mData: "SendDate", sgType: "date", visible: false, searchable: false },
           { title: "Gönderilme Zamanı", mData: "SendTime", sgType: "time", visible: false, searchable: false },
           { title: "Hata", mData: "ErrorDscr" },
           { title: "CancelUser", mData: "CancelUser", visible: false, searchable: false },
           { title: "CancelDatetime", mData: "CancelDatetime", sgType: 'datetime', visible: false, searchable: false },
        ],
        columnDefs: [
             {
                 searchable: false,
                 orderable: false,
                 targets: 0,
                 render: function (data, type, full, meta) {
                     if (full.MailStatus == "W")
                         return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkboxes_0"><span></span></label>';
                     else
                         return '';
                 }
             },
               {
                   targets: 8,
                   render: function (data, type, full, meta) {
                       return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowBody\"><i class=\"fa fa-eye\"></i> Göster</button>";
                   }
               },
                {
                    targets: 11,
                    render: function (data, type, full, meta) {
                        if (full.MailStatus == "S")
                            return '<span class="label label-success"> ' + Sigma.lookup(comEmlLookup, data) + ' </span>'
                        else if (full.MailStatus == "W")
                            return '<span class="label label-warning">  ' + Sigma.lookup(comEmlLookup, data) + ' </span>';
                        else if (full.MailStatus == "E")
                            return '<span class="label label-danger"> ' + Sigma.lookup(comEmlLookup, data) + ' </span>';
                        else if (full.MailStatus == "P")
                            return '<span class="label label-info"> ' + Sigma.lookup(comEmlLookup, data) + ' </span>';
                        else if (full.MailStatus == "C")
                            return '<span class="label label-default"> ' + Sigma.lookup(comEmlLookup, data) + ' </span>';
                    }
                },
                {
                    targets: -3,
                    render: function (data, type, full, meta) {
                        return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowError\"><i class=\"fa fa-eye\"></i> Göster</button>";
                    }
                },
        ]
    });

    Sigma.createDateRangePicker({
        id: '#dateRange'
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    btnFrmComEmlRetrieve.click(function () {
        fillData();
    });

    btnFrmComEmlCancel.click(function () {

        var emlgrplist = Sigma.getCheckedRows(tableFrmComEml, undefined, 0);

        if (emlgrplist.length == 0) {
            Sigma.toastWarning("Lütfen iptal edilecek kayıtları seçiniz", "UYARI");
            return true;
        }

        Sigma.ajax({
            url: "../../Base/FrmComEml/CancelFrmComEmlGrpList",
            data: { emlgrplist: emlgrplist },
            showErrorToast: true,
            showSuccessToast: true,
            onSuccess: function (data) {
                fillData();
            }
        });
    });


    $(tableNameFrmComEml + ' tbody').on('click', 'button.btnShowBody', function () {
        var d = Sigma.getSelectedRow(tableFrmComEml, this);

        GetFrmComGroupMailList(d)
        if (d.MailStatus == "W")
            btnFrmComMailCancel.show();
        else
            btnFrmComMailCancel.hide();

        $('#modalMailList').modal('show');
    });

    $(tableNameFrmComEml + ' tbody').on('click', 'button.btnShowError', function () {
        var d = Sigma.getSelectedRow(tableFrmComEml, this);
        $('#mailBody').html(d.ErrorDscr);
        $('#modalBody').modal('show');

    });

    btnFrmComEmlClear.click(function () { clearForm(); });
    /*============================================================================================*/
});

function fillData() {
    var obj = Sigma.objectFromForm(formNameFrmComEml);

    var startDate = Sigma.getDateRangePickerStartDate('#dateRange');
    var endDate = Sigma.getDateRangePickerEndDate('#dateRange');

    obj.AccountId = $('#AccountId').val().replace('-1', '');

    Sigma.ajax({
        url: "../../Base/FrmComEml/GetFrmComEmlList",
        data: { AccountId: obj.AccountId, mailStatus: obj.MailStatus, startDate: startDate, endDate: endDate },
        showErrorToast: true,
        blockTarget: tableFrmComEml,
        onSuccess: function (data) {
            tableFrmComEml.clear().draw();
            tableFrmComEml.rows.add(JSON.parse(data)).draw();
        }
    });
}

function clearForm() {
    Sigma.clearForm(formNameFrmComEml);

    Sigma.clearValidationClass(formNameFrmComEml);
    tableFrmComEml.clear().draw();
}

/*============================================================================================*/
// Mail Detayları
/*============================================================================================*/

var tableNameFrmComMailList = '#tblFrmComMailList';
var tableFrmComMailList;
var btnFrmComMailCancel = $('#btnFrmComMailCancel');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmComMailList = Sigma.createDT({
        tableName: tableNameFrmComMailList,
        responsive: true,
        stateSave: true,
        showButtons: true,
        fixedHeader: false,
        columns:
        [
            { title: "<div class=\"checker\"><span><input type=\"checkbox\" class=\"checkboxes_" + 0 + "\"></span></div>", searchable: false, orderable: false },
             { title: "Guid", mData: "Guid", visible: false, searchable: false },
             { title: "Status", mData: "Status", visible: false, searchable: false },
             { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
             { title: "GrpId", mData: "GrpId", visible: false, searchable: false },
             { title: "EmlId", mData: "EmlId", visible: false, searchable: false },
             { title: "Konu", mData: "Subject" },
             { title: "Kime", mData: "MailTo" },
             { title: "Cc", mData: "Cc" },
             { title: "Bcc", mData: "Bcc" },
             { title: "Gövde", mData: "Body", visible: false, searchable: false },
             { title: "Html mi?", mData: "IsBodyHtml", sgType: 'boolean' },
             { title: "Mail Durumu", mData: "MailStatus", sgLookup: comEmlLookup },
             { title: "Gönderileceği Zaman", mData: "SendDate", sgType: "date", },
             { title: "Gönderilme Zamanı", mData: "SendTime", sgType: "time", },
             { title: "Hata", mData: "ErrorDscr" },
             { title: "CancelUser", mData: "CancelUser", visible: false, searchable: false },
             { title: "CancelDatetime", mData: "CancelDatetime", sgType: 'datetime', visible: false, searchable: false },

        ],
        columnDefs: [
              {
                  searchable: false,
                  orderable: false,
                  targets: 0,
                  render: function (data, type, full, meta) {
                      if (full.MailStatus == "W")
                          return '<div class="checker"><span><input type="checkbox" class="checkboxes_0"></span></div>';
                      else
                          return '';
                  }
              },
             {
                 targets: 12,
                 render: function (data, type, full, meta) {
                     if (full.MailStatus == "S")
                         return '<span class="label label-success"> ' + Sigma.lookup(comEmlLookup, full.MailStatus) + ' </span>'
                     else if (full.MailStatus == "W")
                         return '<span class="label label-warning">  ' + Sigma.lookup(comEmlLookup, full.MailStatus) + ' </span>';
                     else if (full.MailStatus == "E")
                         return '<span class="label label-danger"> ' + Sigma.lookup(comEmlLookup, full.MailStatus) + ' </span>';
                     else if (full.MailStatus == "P")
                         return '<span class="label label-info"> ' + Sigma.lookup(comEmlLookup, full.MailStatus) + ' </span>';
                     else if (full.MailStatus == "C")
                         return '<span class="label label-default"> ' + Sigma.lookup(comEmlLookup, full.MailStatus) + ' </span>';
                     else return "";
                 }
             },
        ]
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/


    btnFrmComMailCancel.click(function () {

        var mailCancelList = Sigma.getCheckedRows(tableFrmComMailList, undefined, 0);

        if (mailCancelList.length == 0) {
            Sigma.toastWarning("Lütfen iptal edilecek kayıtları seçiniz", "UYARI");
            return false;
        }

        Sigma.ajax({
            url: "../../Base/FrmComEml/CancelFrmComMailList",
            data: { emllist: mailCancelList },
            showErrorToast: true,
            showSuccessToast: true,
            onSuccess: function (data) {
                fillData();
            }
        });
    });

    /*============================================================================================*/
});
function GetFrmComGroupMailList(group) {
    tableFrmComMailList.clear().draw();
    Sigma.ajax({
        url: "../../Base/FrmComEml/GetFrmComGroupMailList",
        data: { GroupId: group.GrpId },
        showErrorToast: true,
        blockTarget: tableFrmComMailList,
        onSuccess: function (data) {
            tableFrmComMailList.rows.add(JSON.parse(data)).draw();
        }
    });
}