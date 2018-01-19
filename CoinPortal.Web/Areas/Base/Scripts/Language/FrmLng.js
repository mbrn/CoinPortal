var tableNameFrmLng = '#tblFrmLng';
var tableFrmLng;
var btnFrmLngAdd = $('#btnFrmLngAdd');
var btnFrmLngSave = $('#btnFrmLngSave');
var btnFrmLngUpdate = $('#btnFrmLngUpdate');
var formNameFrmLng = '#frmFrmLng';
var modalFormFrmLng = $('#modalFormFrmLng');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmLng = Sigma.createDT({
        tableName: tableNameFrmLng,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "LngKey", mData: "LngKey" },
        { title: "LngName", mData: "LngName" },
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
        formName: formNameFrmLng,
        rules: {
            LngKey: { required: true },
            LngName: { required: true },
        },
        messages: {
        }
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmLngAdd.click(function () {
        Sigma.clearForm(formNameFrmLng);
        Sigma.clearValidationClass(formNameFrmLng);

        btnFrmLngSave.removeClass("display-none");
        btnFrmLngUpdate.addClass("display-none");

        modalFormFrmLng.modal('show');
    });

    btnFrmLngSave.click(function () {
        if ($(formNameFrmLng).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmLng);
        Sigma.ajax({
            url: "../../Base/FrmLng/SaveFrmLng",
            data: obj,
            onSuccess: function () { modalFormFrmLng.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmLng + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmLng);
        Sigma.clearValidationClass(formNameFrmLng);

        var d = tableFrmLng.row($(this).parents('tr')).data();
        Sigma.fillForm(formNameFrmLng, d);

        btnFrmLngSave.addClass("display-none");
        btnFrmLngUpdate.removeClass("display-none");

        modalFormFrmLng.modal('show');
    });

    $(tableNameFrmLng + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = tableFrmLng.row($(this).parents('tr')).data();

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmLng/DeleteFrmLng",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmLngUpdate.click(function () {
        if ($(formNameFrmLng).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmLng);
        Sigma.ajax({
            url: "../../Base/FrmLng/UpdateFrmLng",
            data: obj,
            onSuccess: function () { modalFormFrmLng.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmLng/GetFrmLngList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmLng.clear().draw();
            tableFrmLng.rows.add(JSON.parse(data)).draw();
        }
    });
}

