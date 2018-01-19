var tableNameFrmAnnCtg = '#tblFrmAnnCtg';
var tableFrmAnnCtg;
var btnFrmAnnCtgAdd = $('#btnFrmAnnCtgAdd');
var btnFrmAnnCtgSave = $('#btnFrmAnnCtgSave');
var btnFrmAnnCtgUpdate = $('#btnFrmAnnCtgUpdate');
var formNameFrmAnnCtg = '#frmFrmAnnCtg';
var modalFormFrmAnnCtg = $('#modalFormFrmAnnCtg');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmAnnCtg = Sigma.createDT({
        tableName: tableNameFrmAnnCtg,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "CatId", mData: "CatId", visible: false, searchable: false },
        { title: "Kategori Adı", mData: "CatName" },
        { title: "Öncelik", mData: "Priority" },
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
        formName: formNameFrmAnnCtg,
        rules: {
            CatName: { required: true },
            Priority: { required: true },
        },
        messages: {
        }
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmAnnCtgAdd.click(function () {
        Sigma.clearForm(formNameFrmAnnCtg);
        Sigma.clearValidationClass(formNameFrmAnnCtg);

        btnFrmAnnCtgSave.removeClass("display-none");
        btnFrmAnnCtgUpdate.addClass("display-none");

        modalFormFrmAnnCtg.modal('show');
    });

    btnFrmAnnCtgSave.click(function () {
        if ($(formNameFrmAnnCtg).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmAnnCtg);
        Sigma.ajax({
            url: "../../Base/FrmAnnCtg/SaveFrmAnnCtg",
            data: obj,
            onSuccess: function () { modalFormFrmAnnCtg.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmAnnCtg + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmAnnCtg);
        Sigma.clearValidationClass(formNameFrmAnnCtg);

        var obj = Sigma.getSelectedRow(tableFrmAnnCtg, this);
        Sigma.fillForm(formNameFrmAnnCtg, obj);

        btnFrmAnnCtgSave.addClass("display-none");
        btnFrmAnnCtgUpdate.removeClass("display-none");

        modalFormFrmAnnCtg.modal('show');
    });

    $(tableNameFrmAnnCtg + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmAnnCtg, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmAnnCtg/DeleteFrmAnnCtg",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmAnnCtgUpdate.click(function () {
        if ($(formNameFrmAnnCtg).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmAnnCtg);
        Sigma.ajax({
            url: "../../Base/FrmAnnCtg/UpdateFrmAnnCtg",
            data: obj,
            onSuccess: function () { modalFormFrmAnnCtg.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmAnnCtg/GetFrmAnnCtgList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmAnnCtg.clear().draw();
            tableFrmAnnCtg.rows.add(JSON.parse(data)).draw();
        }
    });
}

