var tableNameFrmPrv = '#tblFrmPrv';
var tableFrmPrv;
var btnFrmPrvRetrieve = $('#btnFrmPrvRetrieve');
var btnFrmPrvSave = $('#btnFrmPrvSave');
var btnFrmPrvUpdate = $('#btnFrmPrvUpdate');
var btnFrmPrvDelete = $('#btnFrmPrvDelete');
var btnFrmPrvClear = $('#btnFrmPrvClear');
var formNameFrmPrv = '#frmFrmPrv';
var modalFormProviders = $('#modalFormProviders');
var PrvKey =  $('#PrvKey');
jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmPrv = Sigma.createDT({
        tableName: tableNameFrmPrv,
        columns: [
        { title: "", searchable: false, orderable: false },
        { title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "PrvId", mData: "PrvId", visible: false, searchable: false },
        { title: "PrvType", mData: "PrvType" ,sgLookup : prvTypelookup},
        { title: "PrvKey", mData: "PrvKey" },
        { title: "PrvName", mData: "PrvName" },
        { title: "IsDefault", mData: "IsDefault", sgType: 'boolean' },
        { title: "IsSystemProvider", mData: "IsSystemProvider", sgType: 'boolean' },
        { title: "NeedAccount", mData: "NeedAccount" , sgType : 'boolean'},
        { title: "Implementation", mData: "Implementation" },
        ],
        columnDefs: [
          {
              targets: 0,
              defaultContent: "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowSelect\"><i class=\"fa fa-check\"></i> Seç</button>"
          },
        ]
    });

    Sigma.validate({
        formName: formNameFrmPrv,
        rules: {
            PrvType: { required: true },
            PrvKey: { required: true },
            PrvName: { required: true },
            Implementation: { required: true },
        },
        messages: {
        }
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    Sigma.onDTRowSelected(tableNameFrmPrv, function (row) {
        Sigma.fillForm(formNameFrmPrv, row);
        btnFrmPrvRetrieve.addClass('disabled');
        btnFrmPrvSave.addClass('disabled');
        btnFrmPrvUpdate.removeClass('disabled');
        btnFrmPrvDelete.removeClass('disabled');
    });

    btnFrmPrvSave.click(function () {
        if ($(formNameFrmPrv).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var prv = Sigma.objectFromForm(formNameFrmPrv);
        var prvFldList = tableFrmPrvFld.rows().data().toArray()
        Sigma.ajax({
            url: "../../Base/FrmPrv/SaveFrmPrv",
            data: { prv: prv, prvFldList: prvFldList },
            onSuccess: function () { clearForm(); GetFrmPrv(prv.PrvKey); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnFrmPrvUpdate.click(function () {
        if ($(formNameFrmPrv).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var prv = Sigma.objectFromForm(formNameFrmPrv);
        var prvFldList = tableFrmPrvFld.rows().data().toArray()
        Sigma.ajax({
            url: "../../Base/FrmPrv/UpdateFrmPrv",
            data: { prv: prv, prvFldList: prvFldList },
            onSuccess: function () { clearForm(); GetFrmPrv(prv.PrvKey);},
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnFrmPrvDelete.click(function () {
        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                var obj = Sigma.objectFromForm(formNameFrmPrv);
                Sigma.ajax({
                    url: "../../Base/FrmPrv/DeleteFrmPrv",
                    data: obj,
                    onSuccess: function () { clearForm();  },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmPrvClear.click(function () { clearForm(); });
    /*============================================================================================*/
    $(".SearchProvider").click(function () {
        fillPrvData();
    });

    PrvKey.keydown(function (e) {
        if (e.keyCode == 13) {
            if ($(this).val() != "") {
                GetFrmPrv($(this).val())
            }
        }
    });
    
    $(tableNameFrmPrv + ' tbody').on('click', 'button.btnRowSelect', function () {
        var d = Sigma.getSelectedRow(tableFrmPrv, this);
        Sigma.fillForm(formNameFrmPrv, d);
        GetFrmPrv(d.PrvKey);
    });
 
});

function GetFrmPrv(PrvKey)
{
    Sigma.ajax({
        url: "../../Base/FrmPrv/GetFrmPrv",
        data: { PrvKey: PrvKey },
        blockUI: false,
        onSuccess: function (data) {
            var prvData = JSON.parse(data);
            if (prvData != null)
            {
                Sigma.fillForm(formNameFrmPrv, prvData.prv);
                tableFrmPrvFld.clear().draw();
                tableFrmPrvFld.rows.add(prvData.prvFld).draw();
                modalFormProviders.modal('hide');
                btnFrmPrvRetrieve.addClass('disabled');
                btnFrmPrvSave.addClass('disabled');
                btnFrmPrvUpdate.removeClass('disabled');
                btnFrmPrvDelete.removeClass('disabled');
            }
        }
    });
}
function fillPrvData() {
    Sigma.ajax({
        url: "../../Base/FrmPrv/GetFrmPrvList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmPrv.clear().draw();
            tableFrmPrv.rows.add(JSON.parse(data)).draw();
            modalFormProviders.modal('show');
        }
    });
}


function clearForm() {
    Sigma.clearForm(formNameFrmPrv);

    btnFrmPrvRetrieve.removeClass('disabled');
    btnFrmPrvSave.removeClass('disabled');
    btnFrmPrvUpdate.addClass('disabled');
    btnFrmPrvDelete.addClass('disabled');

    Sigma.clearValidationClass(formNameFrmPrv);
    tableFrmPrv.clear().draw();
    tableFrmPrvFld.clear().draw();
}

/*============================================================================================*/
// Provider Detayları
/*============================================================================================*/
var tableNameFrmPrvFld = '#tblFrmPrvFld';
var tableFrmPrvFld;
var btnFrmPrvFldAdd = $('#btnFrmPrvFldAdd');
var btnFrmPrvFldSave = $('#btnFrmPrvFldSave');
var btnFrmPrvFldUpdate = $('#btnFrmPrvFldUpdate');
var formNameFrmPrvFld = '#frmFrmPrvFld';
var modalFormFrmPrvFld = $('#modalFormFrmPrvFld');
var selectedRow;
jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmPrvFld = Sigma.createDT({
        tableName: tableNameFrmPrvFld,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "PrvId", mData: "PrvId", visible: false, searchable: false },
        { title: "Alan Key", mData: "FldKey" },
        { title: "Değer Tipi", mData: "ValType" },
        { title: "Görünürlük", mData: "IsVisible"  ,sgType: "boolean", },
        { title: "Zorunlu mu", mData: "IsMandatory", sgType: "boolean", },
        { title: "Varsayılan Değer", mData: "DefaultValue" },
        { title: "Label Texti", mData: "LabelText" },
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
        formName: formNameFrmPrvFld,
        rules: {
            FldKey: { required: true },
            ValType: { required: true },
        },
        messages: {
        }
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmPrvFldAdd.click(function () {
        Sigma.clearForm(formNameFrmPrvFld);
        Sigma.clearValidationClass(formNameFrmPrvFld);

        btnFrmPrvFldSave.removeClass("display-none");
        btnFrmPrvFldUpdate.addClass("display-none");

        modalFormFrmPrvFld.modal('show');

        if (!$("#NeedAccount").is(':checked')) 
            $("#IsVisible").parents(".form-group").hide();
        else
            $("#IsVisible").parents(".form-group").show();
    });

    btnFrmPrvFldSave.click(function () {
        if ($(formNameFrmPrvFld).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrvFld);
        tableFrmPrvFld.row.add(obj).draw();
        modalFormFrmPrvFld.modal('hide');
    });

    $(tableNameFrmPrvFld + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmPrvFld);
        Sigma.clearValidationClass(formNameFrmPrvFld);

        selectedRow = $(this).parents('tr');
        var rowData = Sigma.getSelectedRow(tableFrmPrvFld, this);
        Sigma.fillForm(formNameFrmPrvFld, rowData);

        if (!$("#NeedAccount").is(':checked'))
            $("#IsVisible").parents(".form-group").hide();
        else
            $("#IsVisible").parents(".form-group").show();

        btnFrmPrvFldSave.addClass("display-none");
        btnFrmPrvFldUpdate.removeClass("display-none");

        modalFormFrmPrvFld.modal('show');
    });

    $(tableNameFrmPrvFld + ' tbody').on('click', 'button.btnRowDelete', function () {
        tableFrmPrvFld.row($(this).parents('tr')).remove().draw();
    });

    btnFrmPrvFldUpdate.click(function () {
        if ($(formNameFrmPrvFld).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrvFld);
        tableFrmPrvFld.row(selectedRow).data(obj).draw();
        modalFormFrmPrvFld.modal('hide');
    });
    /*============================================================================================*/
});

function fillPrvFields() {
    Sigma.ajax({
        url: "../../Base/FrmPrv/GetPrvFldList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmPrvFld.clear().draw();
            tableFrmPrvFld.rows.add(JSON.parse(data)).draw();
        }
    });
}