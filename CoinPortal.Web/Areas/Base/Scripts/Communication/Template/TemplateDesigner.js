var tableNameFrmComTmp = '#tblFrmComTmp';
var tableFrmComTmp;
var btnFrmComTmpAdd = $('#btnFrmComTmpAdd');
var btnFrmComTmpSave = $('#btnFrmComTmpSave');
var btnFrmComTmpUpdate = $('#btnFrmComTmpUpdate');
var formNameFrmComTmp = '#frmFrmComTmp';
var carousel = $('#carousel');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmComTmp = Sigma.createDT({
        tableName: tableNameFrmComTmp,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "TmpId", mData: "TmpId", visible: false, searchable: false },
        { title: "Şablon Kodu", mData: "TmpKey" },
        { title: "Şablon Tipi", mData: "TmpTyp", sgLookup: { "S": "SMS", "M": "Mail" } },
        { title: "Başlık", mData: "Header" },
        { title: "Sistem Şablonu", mData: "IsSystemTemplate", sgType:"boolean" },
        { title: "Şablon", mData: "Text", visible: false, searchable: false },
        { title: "", searchable: false, orderable: false },
        ],
        columnDefs: [{
            targets: -1,
            defaultContent: "<div style=\"width:125px;\">" +                
                '<button type="button" data-container="body" data-placement="top" data-original-title="Düzenle" class="tooltips btn blue-soft btn-sm btn-outline btnRowEdit"><i class="fa fa-fw fa-edit"></i></button>' +
                '<button type="button" data-container="body" data-placement="top" data-original-title="Sil" class="tooltips btn red-soft btn-sm btn-outline btnRowDelete"><i class="fa fa-fw fa-times"></i></button>' +
            "</div>"
        }]
    });

    Sigma.validate({
        formName: formNameFrmComTmp,
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

    $(tableNameFrmComTmp).on('draw.dt', function () {
        $('.tooltips').tooltip();
    });

    $('.btnBack').click(function () {
        carousel.carousel(0);
    });

    $(tableNameFrmComTmp + ' tbody').on('click', 'button.btnRowEdit', function () {
        var obj = Sigma.getSelectedRow(tableFrmComTmp, this);
        if (obj.TmpTyp == "M") {
            Sigma.clearForm(formNameMailTemplate);
            Sigma.clearValidationClass(formNameMailTemplate);
            Sigma.fillForm(formNameMailTemplate, obj);
            $('#Text', $(formNameMailTemplate)).sgMultiLang('value',obj.Text);
            btnSaveMailTemplate.addClass("display-none");
            btnUpdateMailTemplate.removeClass("display-none");
            mailTemplateHeader.text(obj.TmpKey);

            carousel.carousel(1);
        }
        else if (obj.TmpTyp == "S") {
            Sigma.clearForm(formNameSmsTemplate);
            Sigma.clearValidationClass(formNameSmsTemplate);
            Sigma.fillForm(formNameSmsTemplate, obj);            

            btnSaveSmsTemplate.addClass("display-none");
            btnUpdateSmsTemplate.removeClass("display-none");
            smsTemplateHeader.text(obj.TmpKey);

            carousel.carousel(2);
        }
    });

    $(tableNameFrmComTmp + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmComTmp, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/TemplateDesigner/DeleteTemplate",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmComTmpUpdate.click(function () {
        if ($(formNameFrmComTmp).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmComTmp);
        Sigma.ajax({
            url: "../../Base/FrmComTmp/UpdateFrmComTmp",
            data: obj,
            onSuccess: function () { modalFormFrmComTmp.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "/Base/TemplateDesigner/GetTemplates",
        blockUI: true,       
        onSuccess: function (data) {
            tableFrmComTmp.clear().draw();
            tableFrmComTmp.rows.add(JSON.parse(data)).draw();
        }
    });
}

function saveTemplate(tmp) {
    Sigma.ajax({
        url: "/Base/TemplateDesigner/SaveTemplate",
        data: tmp,
        onSuccess: function () {
            carousel.carousel(0);
            fillData();
        },
        showSuccessToast: true,
        showErrorToast: true
    });
}

function updateTemplate(tmp) {
    Sigma.ajax({
        url: "/Base/TemplateDesigner/UpdateTemplate",
        data: tmp,
        onSuccess: function () {
            carousel.carousel(0);
            fillData();
        },
        showSuccessToast: true,
        showErrorToast: true
    });
}

/*============================================================================================*/
// Mail Template
/*============================================================================================*/

var formNameMailTemplate = '#frmMailTemplate';
var btnSaveMailTemplate = $('#btnSaveMailTemplate');
var btnUpdateMailTemplate = $('#btnUpdateMailTemplate');
var mailTemplateHeader = $('#mailTemplateHeader');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    Sigma.validate({
        formName: formNameMailTemplate,
        rules: {
            TmpKey: { required: true },
        },
        messages: {
            TmpKey: { required: 'Lütfen şablon kodunu giriniz' },            
        }
    });

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    $('#btnAddMailTemplate').click(function () {
        Sigma.clearForm(formNameMailTemplate);
        $('#Text', $(formNameMailTemplate)).sgMultiLang('value', '');
        Sigma.clearValidationClass(formNameMailTemplate);

        btnSaveMailTemplate.removeClass("display-none");
        btnUpdateMailTemplate.addClass("display-none");
        mailTemplateHeader.text('Yeni Mail Şablonu');

        carousel.carousel(1);
    });

    btnSaveMailTemplate.click(function () {
        if ($(formNameMailTemplate).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }
       
        var tmp = Sigma.objectFromForm(formNameMailTemplate);
        tmp.Text = $('#Text').sgMultiLang('value');
        
        tmp.TmpTyp = "M";
        saveTemplate(tmp);
    });

    btnUpdateMailTemplate.click(function () {
        if ($(formNameMailTemplate).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var tmp = Sigma.objectFromForm(formNameMailTemplate);
        tmp.Text = $('#Text').sgMultiLang('value');
        updateTemplate(tmp);
    });

    /*============================================================================================*/
});

/*============================================================================================*/

/*============================================================================================*/
// SMS Template
/*============================================================================================*/

var formNameSmsTemplate = '#frmSmsTemplate';
var btnSaveSmsTemplate = $('#btnSaveSmsTemplate');
var btnUpdateSmsTemplate = $('#btnUpdateSmsTemplate');
var smsTemplateHeader = $('#smsTemplateHeader');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    Sigma.validate({
        formName: formNameSmsTemplate,
        rules: {
            TmpKey: { required: true },
            Text: { required: true },
        },
        messages: {
            TmpKey: { required: 'Lütfen şablon kodunu giriniz' },
            Text: { required: 'Lütfen sms şablonunu giriniz' },
        }
    });

    /*============================================================================================*/
    // Events
    /*============================================================================================*/


    $('#btnAddSmsTemplate').click(function () {
        Sigma.clearForm(formNameSmsTemplate);
        Sigma.clearValidationClass(formNameSmsTemplate);

        btnSaveSmsTemplate.removeClass("display-none");
        btnUpdateSmsTemplate.addClass("display-none");

        carousel.carousel(2);
    });

    btnSaveSmsTemplate.click(function () {
        if ($(formNameSmsTemplate).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var tmp = Sigma.objectFromForm(formNameSmsTemplate);
        tmp.TmpTyp = "S";
        saveTemplate(tmp);
    });

    btnUpdateSmsTemplate.click(function () {
        if ($(formNameSmsTemplate).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var tmp = Sigma.objectFromForm(formNameSmsTemplate);
        updateTemplate(tmp);
    });

    /*============================================================================================*/
});

/*============================================================================================*/


