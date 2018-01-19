var tableNameFrmTntTypCnt = '#tblFrmTntTypCnt';
var tableFrmTntTypCnt;
var btnFrmTntTypCntAdd = $('#btnFrmTntTypCntAdd');
var btnFrmTntTypCntSave = $('#btnFrmTntTypCntSave');
var btnFrmTntTypCntUpdate = $('#btnFrmTntTypCntUpdate');
var formNameFrmTntTypCnt = '#frmFrmTntTypCnt';
var modalFormFrmTntTypCnt = $('#modalFormFrmTntTypCnt');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmTntTypCnt = Sigma.createDT({
        tableName: tableNameFrmTntTypCnt,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "CntCode", mData: "CntCode" },
        { title: "CntName", mData: "CntName" },
        { title: "CntIcon", mData: "CntIcon" },
        { title: "Description", mData: "Description" },
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
                if (data == null || data == "")
                    return "";

                return '<i class="' + data + '"></i>';
            }
        }]
    });

    Sigma.validate({
        formName: formNameFrmTntTypCnt,
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
    btnFrmTntTypCntAdd.click(function () {
        Sigma.clearForm(formNameFrmTntTypCnt);
        Sigma.clearValidationClass(formNameFrmTntTypCnt);

        btnFrmTntTypCntSave.removeClass("display-none");
        btnFrmTntTypCntUpdate.addClass("display-none");

        modalFormFrmTntTypCnt.modal('show');
    });

    btnFrmTntTypCntSave.click(function () {
        if ($(formNameFrmTntTypCnt).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmTntTypCnt);
        Sigma.ajax({
            url: "../../FrmTntTypCnt/SaveFrmTntTypCnt",
            data: obj,
            onSuccess: function () { modalFormFrmTntTypCnt.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmTntTypCnt + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmTntTypCnt);
        Sigma.clearValidationClass(formNameFrmTntTypCnt);

        var d = tableFrmTntTypCnt.row($(this).parents('tr')).data();
        Sigma.fillForm(formNameFrmTntTypCnt, d);

        btnFrmTntTypCntSave.addClass("display-none");
        btnFrmTntTypCntUpdate.removeClass("display-none");

        modalFormFrmTntTypCnt.modal('show');
    });

    $(tableNameFrmTntTypCnt + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = tableFrmTntTypCnt.row($(this).parents('tr')).data();

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../FrmTntTypCnt/DeleteFrmTntTypCnt",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmTntTypCntUpdate.click(function () {
        if ($(formNameFrmTntTypCnt).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmTntTypCnt);
        Sigma.ajax({
            url: "../../FrmTntTypCnt/UpdateFrmTntTypCnt",
            data: obj,
            onSuccess: function () { modalFormFrmTntTypCnt.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../FrmTntTypCnt/GetFrmTntTypCntList",
        blockUI: false,
        onSuccess: function (data) {
            tableFrmTntTypCnt.clear().draw();
            tableFrmTntTypCnt.rows.add(JSON.parse(data)).draw();
        }
    });
}

