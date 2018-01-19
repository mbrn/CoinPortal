var tableNameFrmPrmCurrency = '#tblFrmPrmCurrency';
var tableFrmPrmCurrency;
var btnFrmPrmCurrencyAdd = $('#btnFrmPrmCurrencyAdd');
var btnFrmPrmCurrencySave = $('#btnFrmPrmCurrencySave');
var btnFrmPrmCurrencyUpdate = $('#btnFrmPrmCurrencyUpdate');
var formNameFrmPrmCurrency = '#frmFrmPrmCurrency';
var modalFormFrmPrmCurrency = $('#modalFormFrmPrmCurrency');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmPrmCurrency = Sigma.createDT({
        tableName: tableNameFrmPrmCurrency,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Birim Kodu", mData: "CurrencyCode" },
        { title: "Adı", mData: "Name" },
        { title: "Icon", mData: "IconCode", className: 'dt-body-center' },
        { title: "", searchable: false, orderable: false },
        ],
        columnDefs: [
        {
            targets: -1,
            defaultContent: "<div style=\"width:125px;\">" +
                            "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowUpdate\"><i class=\"fa fa-refresh\"></i> Güncelle</button>" +
                            "<button type=\"button\" class=\"btn red btn-xs btnRowDelete\"><i class=\"fa fa-times\"></i> Sil</button></div>"
        },
          {
              targets: 5,
              render: function (data, type, full, meta) {
                  return '<i class="' + full.IconCode + '"></i>';
              }
          },
        ]
    });

    Sigma.validate({
        formName: formNameFrmPrmCurrency,
        rules: {
            CurrencyCode: { required: true },
            Name: { required: true },
        },
        messages: {
            CurrencyCode: { required: 'Lütfen 3 karakterli para birimi kodunu giriniz' },
            Name: { required: 'Lütfen para birimi adını giriniz' },
        }
    });
     
    $("#IconCode optgroup").each(function () {
        if ($(this).attr("label") != 'Currency')
            $(this).remove();
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmPrmCurrencyAdd.click(function () {
        Sigma.clearForm(formNameFrmPrmCurrency);
        Sigma.clearValidationClass(formNameFrmPrmCurrency);

        btnFrmPrmCurrencySave.removeClass("display-none");
        btnFrmPrmCurrencyUpdate.addClass("display-none");

        modalFormFrmPrmCurrency.modal('show');
    });

    btnFrmPrmCurrencySave.click(function () {
        if ($(formNameFrmPrmCurrency).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrmCurrency);
        Sigma.ajax({
            url: "../../Base/FrmPrmCurrency/SaveFrmPrmCurrency",
            data: obj,
            onSuccess: function () { modalFormFrmPrmCurrency.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmPrmCurrency + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmPrmCurrency);
        Sigma.clearValidationClass(formNameFrmPrmCurrency);

        var d = tableFrmPrmCurrency.row($(this).parents('tr')).data();
        Sigma.fillForm(formNameFrmPrmCurrency, d);

        btnFrmPrmCurrencySave.addClass("display-none");
        btnFrmPrmCurrencyUpdate.removeClass("display-none");

        modalFormFrmPrmCurrency.modal('show');
    });

    $(tableNameFrmPrmCurrency + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = tableFrmPrmCurrency.row($(this).parents('tr')).data();

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmPrmCurrency/DeleteFrmPrmCurrency",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmPrmCurrencyUpdate.click(function () {
        if ($(formNameFrmPrmCurrency).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrmCurrency);
        Sigma.ajax({
            url: "../../Base/FrmPrmCurrency/UpdateFrmPrmCurrency",
            data: obj,
            onSuccess: function () { modalFormFrmPrmCurrency.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmPrmCurrency/GetFrmPrmCurrencyList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmPrmCurrency.clear().draw();
            tableFrmPrmCurrency.rows.add(JSON.parse(data)).draw();
        }
    });
}

