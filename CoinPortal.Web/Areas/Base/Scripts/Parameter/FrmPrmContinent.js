var tableName = '#tblFrmPrmContinent';
var table;
var btnAdd = $('#btnAdd');
var btnSave = $('#btnSave');
var btnUpdate = $('#btnUpdate');
var formName = '#frmFrmPrmContinent';
var modalForm =  $('#modalForm');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    table = Sigma.createDT({
        tableName: tableName,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Kıta No", mData: "ContinentId" },
        { title: "Kıta Adı", mData: "ContinentName" },
        { title: "", searchable: false, orderable: false},
        ],
        columnDefs: [{
            targets: -1,
            defaultContent: "<div style=\"width:125px;\">" +
                            "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowUpdate\"><i class=\"fa fa-refresh\"></i> Güncelle</button>" +                            
                            "<button type=\"button\" class=\"btn red btn-xs btnRowDelete\"><i class=\"fa fa-times\"></i> Sil</button></div>"
        }]
    });

    Sigma.validate({
        formName: formName,
        rules: {
            ContinentName: { required: true }
        },
        messages: {
            ContinentName: { required: 'Lütfen kıta adı giriniz' }
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
            url: "../../Base/FrmPrmContinent/SaveFrmPrmContinent",
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
                    url: "../../Base/FrmPrmContinent/DeleteFrmPrmContinent",
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
            url: "../../Base/FrmPrmContinent/UpdateFrmPrmContinent",
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
        url: "../../Base/FrmPrmContinent/GetFrmPrmContinentList",
        blockUI: false,
        onSuccess: function (data) {
            table.clear().draw();
            table.rows.add(JSON.parse(data)).draw();
        }
    });
}
