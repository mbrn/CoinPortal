var tableNameFrmPrmCityTown = '#tblFrmPrmCityTown';
var tableFrmPrmCityTown;
var btnFrmPrmCityTownAdd = $('#btnFrmPrmCityTownAdd');
var btnFrmPrmCityTownSave = $('#btnFrmPrmCityTownSave');
var btnFrmPrmCityTownUpdate = $('#btnFrmPrmCityTownUpdate');
var formNameFrmPrmCityTown = '#frmFrmPrmCityTown';
var modalFormFrmPrmCityTown = $('#modalFormFrmPrmCityTown');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmPrmCityTown = Sigma.createDT({
        tableName: tableNameFrmPrmCityTown,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "TownId", mData: "TownId", visible: false, searchable: false },
        { title: "İlçe No", mData: "TownName" },
        { title: "İlçe Adı", mData: "CityId", sgLookup: prmCityLookup },
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
        formName: formNameFrmPrmCityTown,
        rules: {
            TownName: { required: true },
            CityId: { required: true },
        },
        messages: {
            TownName: { required: 'Lütfen ilçe adı giriniz' },
            CityId: { required: 'Lütfen şehir seçiniz' }
        }
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmPrmCityTownAdd.click(function () {
        Sigma.clearForm(formNameFrmPrmCityTown);
        Sigma.clearValidationClass(formNameFrmPrmCityTown);

        btnFrmPrmCityTownSave.removeClass("display-none");
        btnFrmPrmCityTownUpdate.addClass("display-none");

        modalFormFrmPrmCityTown.modal('show');
    });

    btnFrmPrmCityTownSave.click(function () {
        if ($(formNameFrmPrmCityTown).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrmCityTown);
        Sigma.ajax({
            url: "../../Base/FrmPrmCityTown/SaveFrmPrmCityTown",
            data: obj,
            onSuccess: function () { modalFormFrmPrmCityTown.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmPrmCityTown + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmPrmCityTown);
        Sigma.clearValidationClass(formNameFrmPrmCityTown);

        var obj = Sigma.getSelectedRow(tableFrmPrmCityTown, this);
        Sigma.fillForm(formNameFrmPrmCityTown, obj);

        btnFrmPrmCityTownSave.addClass("display-none");
        btnFrmPrmCityTownUpdate.removeClass("display-none");

        modalFormFrmPrmCityTown.modal('show');
    });

    $(tableNameFrmPrmCityTown + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmPrmCityTown, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmPrmCityTown/DeleteFrmPrmCityTown",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmPrmCityTownUpdate.click(function () {
        if ($(formNameFrmPrmCityTown).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrmCityTown);
        Sigma.ajax({
            url: "../../Base/FrmPrmCityTown/UpdateFrmPrmCityTown",
            data: obj,
            onSuccess: function () { modalFormFrmPrmCityTown.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmPrmCityTown/GetFrmPrmCityTownList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmPrmCityTown.clear().draw();
            tableFrmPrmCityTown.rows.add(JSON.parse(data)).draw();
        }
    });
}

