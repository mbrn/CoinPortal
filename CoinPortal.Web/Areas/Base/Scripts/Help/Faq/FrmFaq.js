var tableNameFrmFaq = '#tblFrmFaq';
var tableFrmFaq;
var btnFrmFaqAdd = $('#btnFrmFaqAdd');
var btnFrmFaqSave = $('#btnFrmFaqSave');
var btnFrmFaqUpdate = $('#btnFrmFaqUpdate');
var formNameFrmFaq = '#frmFrmFaq';
var modalFormFrmFaq = $('#modalFormFrmFaq');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmFaq = Sigma.createDT({
        tableName: tableNameFrmFaq,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "QuestionId", mData: "QuestionId", visible: false, searchable: false },
        { title: "Kategori Adı", mData: "CatId", sgLookup: catLookup, "width": "15%" },
        { title: "Soru", mData: "Question" , "width":"20%"},
        { title: "Cevap", mData: "Answer"},
        { title: "Öncelik", mData: "Priority", "width": "5%" },
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
        formName: formNameFrmFaq,
        rules: {
            CatId: { required: true },
            Question: { required: true },
            Answer:   { required: true },
            Priority: { required: true },
        },
        messages: {
        }
    });

    $('#Answer').sgRichTextBox({ height: 400 });
    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnFrmFaqAdd.click(function () {
        $('#Answer').sgRichTextBox('value', '');
        Sigma.clearForm(formNameFrmFaq);
        Sigma.clearValidationClass(formNameFrmFaq);

        btnFrmFaqSave.removeClass("display-none");
        btnFrmFaqUpdate.addClass("display-none");

        modalFormFrmFaq.modal('show');
    });

    btnFrmFaqSave.click(function () {

        $('#Answer').val($('#Answer').sgRichTextBox('value').trim());
        if ($(formNameFrmFaq).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmFaq);
        Sigma.ajax({
            url: "../../Base/FrmFaq/SaveFrmFaq",
            data: obj,
            onSuccess: function () { modalFormFrmFaq.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmFaq + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmFaq);
        Sigma.clearValidationClass(formNameFrmFaq);

        var obj = Sigma.getSelectedRow(tableFrmFaq, this);
        Sigma.fillForm(formNameFrmFaq, obj);
        $('#Answer').sgRichTextBox('value', obj.Answer);
        btnFrmFaqSave.addClass("display-none");
        btnFrmFaqUpdate.removeClass("display-none");

        modalFormFrmFaq.modal('show');
    });

    $(tableNameFrmFaq + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmFaq, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmFaq/DeleteFrmFaq",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmFaqUpdate.click(function () {
        $('#Answer').val($('#Answer').sgRichTextBox('value').trim());
        if ($(formNameFrmFaq).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmFaq);
        Sigma.ajax({
            url: "../../Base/FrmFaq/UpdateFrmFaq",
            data: obj,
            onSuccess: function () { modalFormFrmFaq.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmFaq/GetFrmFaqList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmFaq.clear().draw();
            tableFrmFaq.rows.add(JSON.parse(data)).draw();
        }
    });
}

