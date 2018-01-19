var tableName = '#tblFrmPrmCountry';
var table;
var btnAdd = $('#btnAdd');
var btnSave = $('#btnSave');
var btnUpdate = $('#btnUpdate');
var formName = '#frmFrmPrmCountry';
var modalForm = $('#modalForm');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    table = Sigma.createDT({
        tableName: tableName,
        stateSave:false,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Ülke Kodu", mData: "CountryCode" },
        { title: "Ülke Adı", mData: "CountryName" },        
        { title: "Kıta", mData: "ContinentId", sgLookup: prmContinentLookup },
        { title: "Bölge", mData: "Region" },
        { title: "Yerel Ad", mData: "LocalName"},
        { title: "CountryCode3", mData: "CountryCode3", visible: false, searchable: false },
        { title: "", searchable: false, orderable:false },
        ],
        columnDefs: [{
            targets: -1,
            defaultContent: "<div style=\"width:125px;\">" +
                            "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowUpdate\"><i class=\"fa fa-refresh\"></i> Güncelle</button>" +
                            "<button type=\"button\" class=\"btn red btn-xs btnRowDelete\"><i class=\"fa fa-times\"></i> Sil</button></div>"
        },        
        ]
    });


    Sigma.validate({
        formName: formName,
        rules: {
            CountryCode: { required: true },
            CountryName: { required: true },
            ContinentId: { required: true },
            LocalName: { required: true }
        },
        messages: {
            CountryCode: { required: 'Lütfen 2 karakterli ülke kodunu giriniz' },
            CountryName: { required: 'Lütfen ülke adı giriniz' },
            ContinentId: { required: 'Lütfen kıta seçiniz' },
            LocalName: { required: 'Lütfen ülke yerel adını giriniz' },
        }
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnAdd.click(function () {
        Sigma.clearForm(formName);
        Sigma.clearValidationClass(formName);

        btnSave.removeClass("display-none");
        btnUpdate.addClass("display-none");

        modalForm.modal('show');
    });

    btnSave.click(function () {
        if ($(formName).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formName);
        Sigma.ajax({
            url: "../../Base/FrmPrmCountry/SaveFrmPrmCountry",
            data: obj,
            onSuccess: function () { modalForm.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableName + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formName);
        Sigma.clearValidationClass(formName);

        var d = table.row($(this).parents('tr')).data();
        Sigma.fillForm(formName, d);

        btnSave.addClass("display-none");
        btnUpdate.removeClass("display-none");

        modalForm.modal('show');
    });

    $(tableName + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = table.row($(this).parents('tr')).data();

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmPrmCountry/DeleteFrmPrmCountry",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnUpdate.click(function () {
        if ($(formName).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formName);
        Sigma.ajax({
            url: "../../Base/FrmPrmCountry/UpdateFrmPrmCountry",
            data: obj,
            onSuccess: function () { modalForm.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmPrmCountry/GetFrmPrmCountryList",
        blockUI: false,
        onSuccess: function (data) {
            table.clear().draw();
            table.rows.add(JSON.parse(data)).draw();
        }
    });
}

