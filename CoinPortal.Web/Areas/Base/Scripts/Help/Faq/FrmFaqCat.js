var tableNameFrmFaqCat = '#tblFrmFaqCat';
var tableFrmFaqCat;
var btnFrmFaqCatAdd = $('#btnFrmFaqCatAdd');
var btnFrmFaqCatSave = $('#btnFrmFaqCatSave');
var btnFrmFaqCatUpdate = $('#btnFrmFaqCatUpdate');
var formNameFrmFaqCat = '#frmFrmFaqCat';
var modalFormFrmFaqCat = $('#modalFormFrmFaqCat');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmFaqCat = Sigma.createDT({
        tableName: tableNameFrmFaqCat,
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
        formName: formNameFrmFaqCat,
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
    btnFrmFaqCatAdd.click(function () {
        Sigma.clearForm(formNameFrmFaqCat);
        Sigma.clearValidationClass(formNameFrmFaqCat);

        btnFrmFaqCatSave.removeClass("display-none");
        btnFrmFaqCatUpdate.addClass("display-none");

        modalFormFrmFaqCat.modal('show');
    });

    btnFrmFaqCatSave.click(function () {
        if ($(formNameFrmFaqCat).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmFaqCat);
        Sigma.ajax({
            url: "../../Base/FrmFaqCat/SaveFrmFaqCat",
            data: obj,
            onSuccess: function () { modalFormFrmFaqCat.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmFaqCat + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmFaqCat);
        Sigma.clearValidationClass(formNameFrmFaqCat);

        var obj = Sigma.getSelectedRow(tableFrmFaqCat, this);
        Sigma.fillForm(formNameFrmFaqCat, obj);

        btnFrmFaqCatSave.addClass("display-none");
        btnFrmFaqCatUpdate.removeClass("display-none");

        modalFormFrmFaqCat.modal('show');
    });

    $(tableNameFrmFaqCat + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmFaqCat, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmFaqCat/DeleteFrmFaqCat",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmFaqCatUpdate.click(function () {
        if ($(formNameFrmFaqCat).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmFaqCat);
        Sigma.ajax({
            url: "../../Base/FrmFaqCat/UpdateFrmFaqCat",
            data: obj,
            onSuccess: function () { modalFormFrmFaqCat.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmFaqCat/GetFrmFaqCatList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmFaqCat.clear().draw();
            tableFrmFaqCat.rows.add(JSON.parse(data)).draw();
        }
    });
}

