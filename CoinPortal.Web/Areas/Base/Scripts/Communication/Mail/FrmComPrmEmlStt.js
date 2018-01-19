var tableNameFrmComPrmEmlStt = '#tblFrmComPrmEmlStt';
var tableFrmComPrmEmlStt;
var btnFrmComPrmEmlSttAdd = $('#btnFrmComPrmEmlSttAdd');
var btnFrmComPrmEmlSttSave = $('#btnFrmComPrmEmlSttSave');
var btnFrmComPrmEmlSttUpdate = $('#btnFrmComPrmEmlSttUpdate');
var formNameFrmComPrmEmlStt = '#frmFrmComPrmEmlStt';
var modalFormFrmComPrmEmlStt = $('#modalFormFrmComPrmEmlStt');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmComPrmEmlStt = Sigma.createDT({
        tableName: tableNameFrmComPrmEmlStt,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Mail Statüsü", mData: "EmailStatus" },
        { title: "Açıklama", mData: "Description" },
        { title: "", searchable: false, orderable: false },
        ],
        columnDefs: [{
            targets: -1,
            defaultContent: "<div style=\"width:125px;\">" +
                            "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowUpdate\"><i class=\"fa fa-refresh\"></i> Güncelle</button>" +
                            "<button type=\"button\" class=\"btn red btn-xs btnRowDelete\"><i class=\"fa fa-times\"></i> Sil</button></div>"
        }]
    });

    Sigma.validate({
        formName: formNameFrmComPrmEmlStt,
        rules: {
            EmailStatus: { required: true },
            Description: { required: true },
        },
        messages: {
        }
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmComPrmEmlSttAdd.click(function () {
        Sigma.clearForm(formNameFrmComPrmEmlStt);
        Sigma.clearValidationClass(formNameFrmComPrmEmlStt);

        btnFrmComPrmEmlSttSave.removeClass("display-none");
        btnFrmComPrmEmlSttUpdate.addClass("display-none");

        modalFormFrmComPrmEmlStt.modal('show');
    });

    btnFrmComPrmEmlSttSave.click(function () {
        if ($(formNameFrmComPrmEmlStt).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmComPrmEmlStt);
        Sigma.ajax({
            url: "../../Base/FrmComPrmEmlStt/SaveFrmComPrmEmlStt",
            data: obj,
            onSuccess: function () { modalFormFrmComPrmEmlStt.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmComPrmEmlStt + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmComPrmEmlStt);
        Sigma.clearValidationClass(formNameFrmComPrmEmlStt);

        var d = tableFrmComPrmEmlStt.row($(this).parents('tr')).data();
        Sigma.fillForm(formNameFrmComPrmEmlStt, d);

        btnFrmComPrmEmlSttSave.addClass("display-none");
        btnFrmComPrmEmlSttUpdate.removeClass("display-none");

        modalFormFrmComPrmEmlStt.modal('show');
    });

    $(tableNameFrmComPrmEmlStt + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = tableFrmComPrmEmlStt.row($(this).parents('tr')).data();

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmComPrmEmlStt/DeleteFrmComPrmEmlStt",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmComPrmEmlSttUpdate.click(function () {
        if ($(formNameFrmComPrmEmlStt).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmComPrmEmlStt);
        Sigma.ajax({
            url: "../../Base/FrmComPrmEmlStt/UpdateFrmComPrmEmlStt",
            data: obj,
            onSuccess: function () { modalFormFrmComPrmEmlStt.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmComPrmEmlStt/GetFrmComPrmEmlSttList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmComPrmEmlStt.clear().draw();
            tableFrmComPrmEmlStt.rows.add(JSON.parse(data)).draw();
        }
    });
}

