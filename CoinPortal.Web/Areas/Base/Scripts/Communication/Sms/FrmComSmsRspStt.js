var tableNameFrmComSmsRspStt = '#tblFrmComSmsRspStt';
var tableFrmComSmsRspStt;
var btnFrmComSmsRspSttAdd = $('#btnFrmComSmsRspSttAdd');
var btnFrmComSmsRspSttSave = $('#btnFrmComSmsRspSttSave');
var btnFrmComSmsRspSttUpdate = $('#btnFrmComSmsRspSttUpdate');
var formNameFrmComSmsRspStt = '#frmFrmComSmsRspStt';
var modalFormFrmComSmsRspStt = $('#modalFormFrmComSmsRspStt');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmComSmsRspStt = Sigma.createDT({
        tableName: tableNameFrmComSmsRspStt,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Id", mData: "Id", visible: false, searchable: false },
        { title: "Sms durum Kod", mData: "ValueKey" },
        { title: "Açıklama", mData: "Value" },
        { title: "", searchable: false, orderable: false },
        ],
        columnDefs: [{
            targets: -1,
            defaultContent: "<div style=\"width:125px;\">" +
            "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowUpdate\"><i class=\"fa fa-refresh\"></i> Güncelle</button>" +
            "<button type=\"button\" class=\"btn red-sunglo btn-xs btnRowDelete\"><i class=\"fa fa-times\"></i> Sil</button>" +
            "</div>"
        }]
    });

    Sigma.validate({
        formName: formNameFrmComSmsRspStt,
        rules: {
            Key: { required: true },
            Value: { required: true },
        },
        messages: {
        }
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmComSmsRspSttAdd.click(function () {
        Sigma.clearForm(formNameFrmComSmsRspStt);
        Sigma.clearValidationClass(formNameFrmComSmsRspStt);

        btnFrmComSmsRspSttSave.removeClass("display-none");
        btnFrmComSmsRspSttUpdate.addClass("display-none");

        modalFormFrmComSmsRspStt.modal('show');
    });

    btnFrmComSmsRspSttSave.click(function () {
        if ($(formNameFrmComSmsRspStt).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmComSmsRspStt);
        Sigma.ajax({
            url: "../../Base/FrmComSmsRspStt/SaveFrmComSmsRspStt",
            data: obj,
            onSuccess: function () { modalFormFrmComSmsRspStt.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmComSmsRspStt + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmComSmsRspStt);
        Sigma.clearValidationClass(formNameFrmComSmsRspStt);

        var obj = Sigma.getSelectedRow(tableFrmComSmsRspStt, this);
        Sigma.fillForm(formNameFrmComSmsRspStt, obj);

        btnFrmComSmsRspSttSave.addClass("display-none");
        btnFrmComSmsRspSttUpdate.removeClass("display-none");

        modalFormFrmComSmsRspStt.modal('show');
    });

    $(tableNameFrmComSmsRspStt + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmComSmsRspStt, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmComSmsRspStt/DeleteFrmComSmsRspStt",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmComSmsRspSttUpdate.click(function () {
        if ($(formNameFrmComSmsRspStt).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmComSmsRspStt);
        Sigma.ajax({
            url: "../../Base/FrmComSmsRspStt/UpdateFrmComSmsRspStt",
            data: obj,
            onSuccess: function () { modalFormFrmComSmsRspStt.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmComSmsRspStt/GetFrmComSmsRspSttList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmComSmsRspStt.clear().draw();
            tableFrmComSmsRspStt.rows.add(JSON.parse(data)).draw();
        }
    });
}

