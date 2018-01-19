var tableNameFrmLngTxt = '#tblFrmLngTxt';
var tableFrmLngTxt;
var btnFrmLngTxtRetrieve = $('#btnFrmLngTxtRetrieve');
var btnFrmLngTxtSave = $('#btnFrmLngTxtSave');
var btnFrmLngTxtUpdate = $('#btnFrmLngTxtUpdate');
var btnFrmLngTxtDelete = $('#btnFrmLngTxtDelete');
var btnFrmLngTxtClear = $('#btnFrmLngTxtClear');
var formNameFrmLngTxt = '#frmFrmLngTxt';

var trnLst;

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    var columns = [];
    var columnsDefs = [];

    columns.push({ title: "Guid", mData: "Guid", visible: false, searchable: false });
    columns.push({ title: "Status", mData: "Status", visible: false, searchable: false });
    columns.push({ title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false });
    columns.push({ title: "TxtId", mData: "TxtId", visible: false, searchable: false });
    columns.push({ title: "TxtKey", mData: "TxtKey" });
    columns.push({ title: "Dinamik", mData: "IsDynamic" });
    columns.push({ title: "JavaScript", mData: "IsJsText" });

    var i = 7;
    $.each(lngs, function (key, value) {
        columns.push({ title: value });

        columnsDefs.push({
            targets: i,
            render: function (data, type, full, meta) {
                return getTranslation(full.TxtId, key);
            }
        });
        i++;
    });

    tableFrmLngTxt = Sigma.createDT({
        tableName: tableNameFrmLngTxt,
        columns: columns,
        columnDefs: columnsDefs
    });

    Sigma.validate({
        formName: formNameFrmLngTxt,
        rules: {
            txtKey: { required: true },

        },
        messages: {
            txtKey: { required: 'Lütfen text key giriniz' },
        }
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    Sigma.onDTRowSelected(tableNameFrmLngTxt, function (row) {
        Sigma.fillForm(formNameFrmLngTxt, row);
        $(formNameFrmLngTxt + " input[id^='trn']").each(function (index) {
            var trn = getTranslation(row.TxtId, $(this).attr('language'));
            $(this).val(trn);
        });


        btnFrmLngTxtRetrieve.addClass('disabled');
        btnFrmLngTxtSave.addClass('disabled');
        btnFrmLngTxtUpdate.removeClass('disabled');
        btnFrmLngTxtDelete.removeClass('disabled');
    });

    btnFrmLngTxtRetrieve.click(function () {
        fillData();
    });

    btnFrmLngTxtSave.click(function () {
        if ($(formNameFrmLngTxt).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = getData();
        Sigma.ajax({
            url: "../../Base/FrmLngTxt/SaveFrmLngTxt",
            data: obj,
            onSuccess: function () { clearForm(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnFrmLngTxtUpdate.click(function () {
        if ($(formNameFrmLngTxt).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = getData();
        Sigma.ajax({
            url: "../../Base/FrmLngTxt/UpdateFrmLngTxt",
            data: obj,
            onSuccess: function () { clearForm(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnFrmLngTxtDelete.click(function () {
        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                var obj = Sigma.objectFromForm(formNameFrmLngTxt);
                Sigma.ajax({
                    url: "../../Base/FrmLngTxt/DeleteFrmLngTxt",
                    data: { txtId: obj.TxtId },
                    onSuccess: function () { clearForm(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmLngTxtClear.click(function () { clearForm(); });
    /*============================================================================================*/
});


function getData() {
    var obj = new Object();
    obj.txt = Sigma.objectFromForm(formNameFrmLngTxt);

    obj.trnLst = [];
    $(formNameFrmLngTxt + " input[id^='trn']").each(function (index) {
        obj.trnLst[index] = new Object();
        obj.trnLst[index].LngKey = $(this).attr('language');
        obj.trnLst[index].Translation = $(this).val();
    });

    return obj;
}

function fillData() {
    var obj = Sigma.objectFromForm(formNameFrmLngTxt);

    Sigma.ajax({
        url: "/Base/FrmLngTxt/GetFrmLngTxtList",
        data: obj,
        showErrorToast: true,
        onSuccess: function (data) {
            var x = JSON.parse(data);
            trnLst = x.trnLst;

            tableFrmLngTxt.clear().draw();
            tableFrmLngTxt.rows.add(x.txtLst).draw();
        }
    });
}

function clearForm() {
    Sigma.clearForm(formNameFrmLngTxt);

    btnFrmLngTxtRetrieve.removeClass('disabled');
    btnFrmLngTxtSave.removeClass('disabled');
    btnFrmLngTxtUpdate.addClass('disabled');
    btnFrmLngTxtDelete.addClass('disabled');

    Sigma.clearValidationClass(formNameFrmLngTxt);
    tableFrmLngTxt.clear().draw();
}

function getTranslation(txtId, lgnKey) {
    var trn = $.grep(trnLst, function (e) { return e.TxtId == txtId && e.LngKey == lgnKey; });
    if (trn.length > 0)
        return trn[0].Translation;
    else
        return '[Çeviri bulunamadı]';
}


/*============================================================================================*/


/*============================================================================================*/
// Hizli Giris
/*============================================================================================*/
var modalQuickEntry = $('#modalQuickEntry');
var frmQuickEntry = $('#frmQuickEntry');
var quickEntryData;
var quickEntryCurrentIndex = 0;
var keyboardLock = false;

jQuery(document).ready(function () {
    $('.btn-quick-entry').click(function () {
        var lngKey = $(this).data('lng-key');
        var onlyEmpty = $(this).hasClass('empty-trns');
        var lngCount = $.map(lngs, function (n, i) { return i; }).length;
        quickEntryCurrentIndex = 0;

        Sigma.ajax({
            url: "/Base/FrmLngTxt/GetFrmLngTxtList",
            showErrorToast: true,
            onSuccess: function (data) {
                quickEntryData = JSON.parse(data);
                if (onlyEmpty) {
                    quickEntryData.txtLst = $.grep(quickEntryData.txtLst, function (e) {
                        var trns = $.grep(quickEntryData.trnLst, function (txt) {
                            return (lngKey == "*" || txt.LngKey == lngKey)
                                && txt.TxtKey == e.TxtKey
                                && lngs[txt.LngKey];
                        });
                        if (lngKey == "*") {
                            if (trns == undefined || trns.length < lngCount)
                                return true;

                            for (i = 0; i < trns.length; i++) {
                                if (trns[i] == undefined || trns[i].Translation == undefined || trns[i].Translation == "")
                                    return true;
                            }
                        }
                        else {
                            if (trns == undefined || trns.length == 0 || trns[0] == undefined || trns[0].Translation == undefined || trns[0].Translation == "")
                                return true;
                        }

                        return false;
                    });
                }

                if (quickEntryData.txtLst.length == 0) {
                    Sigma.toastWarning("Uygun çeviri bulunamadı");
                    return;
                }

                $('input.lng-text', frmQuickEntry).attr('readonly', false);
                if (lngKey != "*") {
                    $('input.lng-text[data-lng-key!="' + lngKey + '"]', frmQuickEntry).attr('readonly', true);
                }

                modalQuickEntry.modal('show');

                loadTranslationToQuickEntry();
            }
        });
    });

    modalQuickEntry.keydown(function (e) {
        if (keyboardLock)
            return;

        if (e.keyCode == 13 && e.ctrlKey && e.shiftKey == false) {
            var txt = { TxtKey: $('#TxtKey', frmQuickEntry).val() };
            var trnLst = [];
            $('input.lng-text', frmQuickEntry).each(function () {
                var trn = { LngKey: $(this).data('lng-key'), Translation: $(this).val(), TxtKey: txt.TxtKey };
                trnLst.push(trn);
            });

            keyboardLock = true;
            Sigma.ajax({
                url: "/Base/FrmLngTxt/UpdateFrmLngTxt",
                data: { txt: txt, trnLst: trnLst },
                onSuccess: function () {
                    loadTranslationToQuickEntry();
                    Sigma.toastSuccess('Çeviri güncellendi');

                    quickEntryData.trnLst = quickEntryData.trnLst.filter(function (el) {
                        return el.TxtKey != txt.TxtKey;
                    });
                    quickEntryData.trnLst = $.merge(quickEntryData.trnLst, trnLst);
                },
                showSuccessToast: false,
                blockTarget: frmQuickEntry,
                showErrorToast: true,
                onComplete: function () { keyboardLock = false; },
            });
        }
        else if (e.keyCode == 37 && e.ctrlKey && e.shiftKey == false) {// left
            if (quickEntryCurrentIndex > 1) {
                quickEntryCurrentIndex -= 2;
                loadTranslationToQuickEntry();
            }

            return true;
        }
        else if (e.keyCode == 39 && e.ctrlKey && e.shiftKey == false) {// right
            loadTranslationToQuickEntry();

            return true;
        }
    });
});

function loadTranslationToQuickEntry() {
    if (quickEntryCurrentIndex == quickEntryData.txtLst.length) {
        Sigma.toastSuccess('Tüm çeviriler için giriş tamamlandı');
        modalQuickEntry.modal('hide');
    }

    var txt = quickEntryData.txtLst[quickEntryCurrentIndex];
    $('#TxtKey', frmQuickEntry).val(txt.TxtKey);

    var trns = $.grep(quickEntryData.trnLst, function (trn) {
        return trn.TxtKey == txt.TxtKey && lngs[trn.LngKey];
    });

    $('input.lng-text').val('');
    for (i = 0; i < trns.length; i++) {
        $('input.lng-text[data-lng-key="' + trns[i].LngKey + '"]', frmQuickEntry).val(trns[i].Translation);
    }

    $('.note ul .counter', modalQuickEntry).text((quickEntryCurrentIndex + 1) + '/' + quickEntryData.txtLst.length);

    modalQuickEntry.on('shown.bs.modal', function () {
        var inputs = $('input.lng-text:not([readonly]):first', frmQuickEntry).filter(function () { return $(this).val() == ""; });
        if (inputs.length == 0) {
            inputs = $('input.lng-text:not([readonly]):first', frmQuickEntry);
        }
        inputs[0].focus();
    })

    quickEntryCurrentIndex++;

    return true;
}

/*============================================================================================*/