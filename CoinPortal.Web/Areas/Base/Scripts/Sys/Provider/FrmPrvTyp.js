var tableNameFrmPrvTyp = '#tblFrmPrvTyp';
var tableFrmPrvTyp;
var btnFrmPrvTypAdd = $('#btnFrmPrvTypAdd');
var btnFrmPrvTypSave = $('#btnFrmPrvTypSave');
var btnFrmPrvTypUpdate = $('#btnFrmPrvTypUpdate');
var formNameFrmPrvTyp = '#frmFrmPrvTyp';
var modalFormFrmPrvTyp = $('#modalFormFrmPrvTyp');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmPrvTyp = Sigma.createDT({
        tableName: tableNameFrmPrvTyp,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Tipi", mData: "PrvType" },
        { title: "Adı", mData: "Name" },
        { title: "", searchable: false, orderable: false },
        ],
        columnDefs: [{
            targets: -1,
            defaultContent: "<div style=\"width:125px;\">" +
            '<button type="button" data-container="body" data-placement="top" data-original-title="Güncelle" class="tooltips btn blue-soft btn-sm btn-outline btnRowUpdate"><i class="fa fa-refresh"></i></button>' +
           '<button type="button" data-container="body" data-placement="top" data-original-title="Sil" class="tooltips btn red-soft btn-sm btn-outline btnRowDelete"><i class="fa fa-times"></i></button>' +
            "</div>"
        }]
    });

    Sigma.validate({
        formName: formNameFrmPrvTyp,
        rules: {
            PrvType: { required: true },
            Name: { required: true },
        },
        messages: {
        }
    });

    fillData();

    $(tableNameFrmPrvTyp).on('draw.dt', function () {
        $('.tooltips').tooltip();
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmPrvTypAdd.click(function () {
        Sigma.clearForm(formNameFrmPrvTyp);
        Sigma.clearValidationClass(formNameFrmPrvTyp);

        btnFrmPrvTypSave.removeClass("display-none");
        btnFrmPrvTypUpdate.addClass("display-none");

        modalFormFrmPrvTyp.modal('show');
    });

    btnFrmPrvTypSave.click(function () {
        if ($(formNameFrmPrvTyp).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrvTyp);
        Sigma.ajax({
            url: "../../Base/FrmPrvTyp/SaveFrmPrvTyp",
            data: obj,
            onSuccess: function () { modalFormFrmPrvTyp.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmPrvTyp + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmPrvTyp);
        Sigma.clearValidationClass(formNameFrmPrvTyp);

        var obj = Sigma.getSelectedRow(tableFrmPrvTyp, this);
        Sigma.fillForm(formNameFrmPrvTyp, obj);

        btnFrmPrvTypSave.addClass("display-none");
        btnFrmPrvTypUpdate.removeClass("display-none");

        modalFormFrmPrvTyp.modal('show');
    });

    $(tableNameFrmPrvTyp + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmPrvTyp, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmPrvTyp/DeleteFrmPrvTyp",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmPrvTypUpdate.click(function () {
        if ($(formNameFrmPrvTyp).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrvTyp);
        Sigma.ajax({
            url: "../../Base/FrmPrvTyp/UpdateFrmPrvTyp",
            data: obj,
            onSuccess: function () { modalFormFrmPrvTyp.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmPrvTyp/GetFrmPrvTypList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmPrvTyp.clear().draw();
            tableFrmPrvTyp.rows.add(JSON.parse(data)).draw();
        }
    });
}

