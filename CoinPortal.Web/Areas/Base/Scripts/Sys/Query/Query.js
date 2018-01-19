var btnFrmSysQrySave = $('#btnFrmSysQrySave');
var btnFrmSysQryDelete = $('#btnFrmSysQryDelete');
var btnFrmSysQryClear = $('#btnFrmSysQryClear');
var formNameFrmSysQry = '#frmFrmSysQry';

var codeMirror;

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    var substringMatcher = function (strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;
            matches = [];
            substrRegex = new RegExp(q, 'i');
            $.each(strs, function (i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });
            cb(matches);
        };
    };

    var queries = Sigma.ajaxGetData("../../Base/Query/GetQueryList");

    $('#QryName').typeahead({
        hint: true,
        highlight: true,
        minLength: 0
    },
    {
        name: 'queries',
        source: substringMatcher(queries)
    }).on('typeahead:selected', function (obj, datum) {
        fillQuery(datum);
    });

    codeMirror = CodeMirror.fromTextArea(document.getElementById('QryTxt'), {
        lineNumbers: true,
        lineWrapping: true,
        mode: "text/x-sql",
        extraKeys: { "Ctrl-Space": "autocomplete" }, // To invoke the auto complete
        hint: CodeMirror.hint.sql,
        hintOptions: {
            tables: Sigma.ajaxGetData("../../Base/Query/GetTableData"),
        }
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    btnFrmSysQrySave.click(function () {        
        var name = $('#QryName').val();
        if (name == null || name == "" || name == undefined) {
            Sigma.toastWarning("Lütfen sorgu adını giriniz");
            return;
        }

        var query = codeMirror.getValue();
        if (query == null || query == "" || query == undefined) {
            Sigma.toastWarning("Lütfen sorgu metnini giriniz");
            return;
        }

        
        Sigma.ajax({
            url: "../../Base/Query/SaveQuery",
            data: { name: name.toUpperCase(), query: query, dbName: $("#DbName").val(), description: $("#Description").val() },
            onSuccess: function () {
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnFrmSysQryDelete.click(function () {
        var name = $('#QryName').val();
        if (name == null || name == "" || name == undefined) {
            Sigma.toastWarning("Lütfen sorgu adını giriniz");
            return;
        }

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/Query/DeleteQuery",
                    data: { name: name.toUpperCase() },
                    onSuccess: function () {
                        clearForm();
                    },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmSysQryClear.click(function () { clearForm(); });

    $('#QryName').keypress(function (e) {
        if (e.which == 13) {
            fillQuery($('#QryName').val())
        }
    });
    /*============================================================================================*/
});

function fillQuery(name) {
    Sigma.ajax({
        url: "../../Base/Query/GetQuery",
        data: { name: name},
        onSuccess: function (data) {            
            codeMirror.setValue(data);
        },
        showSuccessToast: false,
        showErrorToast: true
    });
}

function clearForm() {
    Sigma.clearForm(formNameFrmSysQry);
    codeMirror.setValue('');
}

