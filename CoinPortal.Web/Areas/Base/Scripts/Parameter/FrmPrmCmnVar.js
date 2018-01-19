var tableNameFrmPrmCmnVar = '#tblFrmPrmCmnVar';
var tableFrmPrmCmnVar;
var btnFrmPrmCmnVarAdd = $('#btnFrmPrmCmnVarAdd');
var btnFrmPrmCmnVarSave = $('#btnFrmPrmCmnVarSave');
var btnFrmPrmCmnVarUpdate = $('#btnFrmPrmCmnVarUpdate');
var formNameFrmPrmCmnVar = '#frmFrmPrmCmnVar';
var modalFormFrmPrmCmnVar = $('#modalFormFrmPrmCmnVar');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmPrmCmnVar = Sigma.createDT({
        tableName: tableNameFrmPrmCmnVar,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Değişken Tipi", mData: "VarTyp" },
        { title: "Değişken Adı", mData: "VarKey" },
        { title: "Değer", mData: "Value"},
        { title: "Açıklama", mData: "Description" },
        { title: "", searchable: false, orderable: false },
        ],
        columnDefs: [{
            targets: -1,
            defaultContent: "<div style=\"width:125px;\">" +
            "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowUpdate\"><i class=\"fa fa-refresh\"></i> Güncelle</button>" +
            "<button type=\"button\" class=\"btn red-sunglo btn-xs btnRowDelete\"><i class=\"fa fa-times\"></i> Sil</button>" +
            "</div>"
        },
        {
            targets: 5,
            render: function (data, type, full, meta) {
                if (full.VarTyp == "boolean") {
                    if (full.Value == true || full.Value == "true") {
                        return  '<div class="text-center"><i class="fa fa-lg fa-check font-green-seagreen" aria-hidden="true"></i></div>';
                    }
                    else {
                        return '<div class="text-center"><i class="fa fa-lg fa-times font-red-soft" aria-hidden="true"></i></div>';
                    }
                }
                else if (full.VarTyp == "decimal" || full.VarTyp == "string" || full.VarTyp == "html") {
                    return full.Value;
                }                
                else if (full.VarTyp == "date") {
                    return $.datepicker.parseDate('yymmdd', full.Value.padLeft(8, '0')).ToTrString();                   
                }
                else if (full.VarTyp == "time") {
                    return full.Value.toString().padLeft(6, '0').insertAt(2, ':').insertAt(5, ':')
                }
                else if (full.VarTyp == "datetime") {
                    return $.datepicker.parseDate('yymmdd', full.Value.padLeft(14, '0').substring(0, 8)).ToTrString() + " " +
                           full.Value.padLeft(14, '0').substring(8, 14).insertAt(2, ':').insertAt(5, ':')
                }
                else {
                    return full.Value;
                }
            }
        }]
    });

    Sigma.validate({
        formName: formNameFrmPrmCmnVar,
        rules: {
            VarTyp: { required: true },
            VarKey: { required: true },
            Value: { required: true },
        },
        messages: {
            VarTyp: { required: 'Lütfen değişken tipini seçiniz' },
            VarKey: { required: 'Lütfen değişken adını giriniz' },
            Value: { required: 'Lütfen değer giriniz' }
        }
    });

    $('#value-html').sgRichTextBox();
    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmPrmCmnVarAdd.click(function () {
        Sigma.clearForm(formNameFrmPrmCmnVar);
        Sigma.clearValidationClass(formNameFrmPrmCmnVar);

        btnFrmPrmCmnVarSave.removeClass("display-none");
        btnFrmPrmCmnVarUpdate.addClass("display-none");

        modalFormFrmPrmCmnVar.modal('show');
    });

    btnFrmPrmCmnVarSave.click(function () {
        if ($(formNameFrmPrmCmnVar).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrmCmnVar);
        obj.Value = getValue(obj.VarTyp);

        Sigma.ajax({
            url: "../../Base/FrmPrmCmnVar/SaveFrmPrmCmnVar",
            data: obj,
            onSuccess: function () { modalFormFrmPrmCmnVar.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmPrmCmnVar + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmPrmCmnVar);
        Sigma.clearValidationClass(formNameFrmPrmCmnVar);

        var d = tableFrmPrmCmnVar.row($(this).parents('tr')).data();
        Sigma.fillForm(formNameFrmPrmCmnVar, d);
        setValue(d);

        btnFrmPrmCmnVarSave.addClass("display-none");
        btnFrmPrmCmnVarUpdate.removeClass("display-none");

        modalFormFrmPrmCmnVar.modal('show');
    });

    $(tableNameFrmPrmCmnVar + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = tableFrmPrmCmnVar.row($(this).parents('tr')).data();

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmPrmCmnVar/DeleteFrmPrmCmnVar",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmPrmCmnVarUpdate.click(function () {
        if ($(formNameFrmPrmCmnVar).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmPrmCmnVar);
        obj.Value = getValue(obj.VarTyp);

        Sigma.ajax({
            url: "../../Base/FrmPrmCmnVar/UpdateFrmPrmCmnVar",
            data: obj,
            onSuccess: function () { modalFormFrmPrmCmnVar.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(formNameFrmPrmCmnVar + " #VarTyp").change(function () {
        var value = $('#VarTyp').val();
        $(formNameFrmPrmCmnVar + ' div[id*="value-container-"]').hide();

        if (value == null)
            return;
        $(formNameFrmPrmCmnVar + ' div[id="value-container-' + value + '"]').show();
    });

    

    /*============================================================================================*/
});

function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmPrmCmnVar/GetFrmPrmCmnVarList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmPrmCmnVar.clear().draw();
            tableFrmPrmCmnVar.rows.add(JSON.parse(data)).draw();
        }
    });
}

function setValue(obj) {
    if (obj.VarTyp == "boolean") {
        if (obj.Value == true || obj.Value == "true") {            
            $('#value-boolean').bootstrapSwitch('state', true);
        }
        else {
            $('#value-boolean').bootstrapSwitch('state', false);
        }
    }
    else if(obj.VarTyp == "decimal"){
        $('#value-decimal').val(obj.Value);
    }
    else if (obj.VarTyp == "string") {
        $('#value-string').val(obj.Value);
    }
    else if (obj.VarTyp == "html") {
        $('#value-html').sgRichTextBox('value', obj.Value);
    }
    else if (obj.VarTyp == "date") {
        $('#value-date').datepicker('setDate', $.datepicker.parseDate('yymmdd', obj.Value));
    }
    else if (obj.VarTyp == "time") {
        $('#value-time').val(obj.Value.toString().padLeft(6, '0').insertAt(2, ':').insertAt(5, ':'))
    }
    else if (obj.VarTyp == "datetime") {
        $('#value-datetime-date').datepicker('setDate', $.datepicker.parseDate('yymmdd', obj.Value.padLeft(14, '0').substring(0, 8)));        
        $('#value-datetime-time').val(obj.Value.padLeft(14, '0').substring(8, 14).toString().padLeft(6, '0').insertAt(2, ':').insertAt(5, ':'))        
    }
}

function getValue(typ) {
    if (typ == "boolean") {        
        return $('#value-boolean').is(":checked").toString();        
    }
    else if (typ == "decimal") {
        return $('#value-decimal').val();
    }
    else if (typ == "string") {
        return $('#value-string').val();
    }
    else if (typ == "html") {
        return $('#value-html').sgRichTextBox('value');
    }
    else if (typ == "date") {
        var val = $('#value-date').datepicker('getDate');
        if(val == null)
            return "19000101";
        else
            return val.ToYYYYMMDD();
    }
    else if (typ == "time") {
        return $('#value-time').val().toString().replace(/\:/g, '').padLeft(6, '0');
    }
    else if (typ == "datetime") {
        return $('#value-datetime-date').datepicker('getDate').ToYYYYMMDD() + $('#value-datetime-time').val().toString().replace(/\:/g, '').padLeft(6, '0');
    }
}



