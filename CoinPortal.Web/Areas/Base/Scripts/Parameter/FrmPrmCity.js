var tableNameFrmPrmCity = '#tblFrmPrmCity';
var tableFrmPrmCity;
var btnFrmPrmCityAdd = $('#btnFrmPrmCityAdd');
var btnFrmPrmCitySave = $('#btnFrmPrmCitySave');
var btnFrmPrmCityUpdate = $('#btnFrmPrmCityUpdate');
var formNameFrmPrmCity = '#frmFrmPrmCity';
var modalFormFrmPrmCity = $('#modalFormFrmPrmCity');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmPrmCity = Sigma.createDT({
        tableName: tableNameFrmPrmCity,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Şehir No", mData: "CityId" },
        { title: "Şehir Adı", mData: "CityName" },
        { title: "Ülke", mData: "CountryCode", sgLookup: prmCountryLookup },
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
        formName: formNameFrmPrmCity,
        rules: {
        },
        messages: {
        }
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmPrmCityAdd.click(function () {
        Sigma.clearForm(formNameFrmPrmCity);
        Sigma.clearValidationClass(formNameFrmPrmCity);

        btnFrmPrmCitySave.removeClass("display-none");
        btnFrmPrmCityUpdate.addClass("display-none");

        modalFormFrmPrmCity.modal('show');
    });

    btnFrmPrmCitySave.click(function () {
        if ($(formNameFrmPrmCity).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrmCity);
        Sigma.ajax({
            url: "../../Base/FrmPrmCity/SaveFrmPrmCity",
            data: obj,
            onSuccess: function () { modalFormFrmPrmCity.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmPrmCity + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmPrmCity);
        Sigma.clearValidationClass(formNameFrmPrmCity);

        var obj = Sigma.getSelectedRow(tableFrmPrmCity, this);
        Sigma.fillForm(formNameFrmPrmCity, obj);

        btnFrmPrmCitySave.addClass("display-none");
        btnFrmPrmCityUpdate.removeClass("display-none");

        modalFormFrmPrmCity.modal('show');
    });

    $(tableNameFrmPrmCity + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmPrmCity, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmPrmCity/DeleteFrmPrmCity",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmPrmCityUpdate.click(function () {
        if ($(formNameFrmPrmCity).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrmCity);
        Sigma.ajax({
            url: "../../Base/FrmPrmCity/UpdateFrmPrmCity",
            data: obj,
            onSuccess: function () { modalFormFrmPrmCity.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmPrmCity/GetFrmPrmCityList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmPrmCity.clear().draw();
            tableFrmPrmCity.rows.add(JSON.parse(data)).draw();
        }
    });
}

