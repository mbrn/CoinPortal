var tableNameFrmPrvAcc = '#tblFrmPrvAcc';
var tableFrmPrvAcc;
var btnFrmPrvAccRetrieve = $('#btnFrmPrvAccRetrieve');
var btnFrmPrvAccSave = $('#btnFrmPrvAccSave');
var btnFrmPrvAccUpdate = $('#btnFrmPrvAccUpdate');
var btnFrmPrvAccDelete = $('#btnFrmPrvAccDelete');
var btnFrmPrvAccClear = $('#btnFrmPrvAccClear');
var formNameFrmPrvAcc = '#frmFrmPrvAcc';
var modalFormProviderAccounts = $('#modalFormProviderAccounts');
var AccName = $('#AccName');
var formNameFrmPrvAccFld = '#frmFrmPrvAccFld';
var FirePrvid = true;
jQuery(document).ready(function () {
	/*============================================================================================*/
	// Init
	/*============================================================================================*/
	tableFrmPrvAcc = Sigma.createDT({
		tableName: tableNameFrmPrvAcc,
		columns: [
        { title: "", searchable: false, orderable: false },
        { title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "AccId", mData: "AccId", visible: false, searchable: false },
        { title: "PrvId", mData: "PrvId", visible: false, searchable: false },
        { title: "Provider Tipi", mData: "PrvType" },
        { title: "Hesap Adı", mData: "AccName" },
        { title: "Varsayılan", mData: "IsDefault", sgType: 'boolean' },
		],
		columnDefs: [
        {
        	targets: 0,
        	defaultContent: "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowSelect\"><i class=\"fa fa-check\"></i> Seç</button>"
        },
		]
	});

	Sigma.validate({
		formName: formNameFrmPrvAcc,
		rules: {
			AccName: { required: true },
			PrvType: { required: true },
		},
		messages: {
		}
	});

	Sigma.validate({
		formName: formNameFrmPrvAccFld,
		rules: {

		},
		messages: {
		}
	});



	/*============================================================================================*/

	/*============================================================================================*/
	// Events
	/*============================================================================================*/
	//Sigma.onDTRowSelected(tableNameFrmPrvAcc, function (row) {
	//	Sigma.fillForm(formNameFrmPrvAcc, row);
	//	btnFrmPrvAccRetrieve.addClass('disabled');
	//	btnFrmPrvAccSave.addClass('disabled');
	//	btnFrmPrvAccUpdate.removeClass('disabled');
	//	btnFrmPrvAccDelete.removeClass('disabled');
	//});

	btnFrmPrvAccSave.click(function () {
		if ($(formNameFrmPrvAcc).valid() == false || $(formNameFrmPrvAccFld).valid() == false) {
			Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
			return true;
		}

		var accFldList = [];

		$(formNameFrmPrvAccFld + " :input").each(function () {
			var item = new Object();
			item.FldKey = $(this).attr("id");
			item.Value = $(this).val();
			accFldList.push(item);
		});

		var obj = Sigma.objectFromForm(formNameFrmPrvAcc);
		Sigma.ajax({
			url: "../../Base/FrmPrvAcc/SaveFrmPrvAcc",
			data: { acc: obj, fields: accFldList },
			onSuccess: function () { clearForm(); GetFrmPrvAcc(obj.AccName) },
			showSuccessToast: true,
			showErrorToast: true
		});
	});

	btnFrmPrvAccUpdate.click(function () {
		if ($(formNameFrmPrvAcc).valid() == false || $(formNameFrmPrvAccFld).valid() == false) {
			Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
			return true;
		}

		var accFldList = [];

		$(formNameFrmPrvAccFld + " :input").each(function () {
			var item = new Object();
			item.FldKey = $(this).attr("id");
			item.Value = $(this).val();
			accFldList.push(item);
		});

		var obj = Sigma.objectFromForm(formNameFrmPrvAcc);
		Sigma.ajax({
			url: "../../Base/FrmPrvAcc/UpdateFrmPrvAcc",
			data: { acc: obj, fields: accFldList },
			onSuccess: function () { clearForm(); GetFrmPrvAcc(obj.AccName) },
			showSuccessToast: true,
			showErrorToast: true
		});
	});

	btnFrmPrvAccDelete.click(function () {
		Sigma.dialogConfirm({
			message: 'Kaydı silmek istediğinize emin misiniz?',
			onConfirm: function () {
				var obj = Sigma.objectFromForm(formNameFrmPrvAcc);
				Sigma.ajax({
					url: "../../Base/FrmPrvAcc/DeleteFrmPrvAcc",
					data: obj,
					onSuccess: function () { clearForm(); },
					showSuccessToast: true,
					showErrorToast: true
				});
			}
		});
	});

	btnFrmPrvAccClear.click(function () { clearForm(); $("#dynamicFields").html(""); });
	/*============================================================================================*/

	$(".SearchAccount").click(function () {
		fillData();
	});

	$("#PrvId").change(function () {
		if ($(this).val() != "" && FirePrvid)
			GetFrmPrvFields($(this).val());

		FirePrvid = true;
	});


	AccName.keydown(function (e) {
		if (e.keyCode == 13) {
			if ($(this).val() != "") {
				GetFrmPrvAcc($(this).val())
			}
		}
	});

	$(tableNameFrmPrvAcc + ' tbody').on('click', 'button.btnRowSelect', function () {
		var d = Sigma.getSelectedRow(tableFrmPrvAcc, this);
		Sigma.fillForm(formNameFrmPrvAcc, d);
		btnFrmPrvAccRetrieve.addClass('disabled');
		btnFrmPrvAccSave.addClass('disabled');
		btnFrmPrvAccUpdate.removeClass('disabled');
		btnFrmPrvAccDelete.removeClass('disabled');
		GetFrmPrvAcc(d.AccName);
	});
});

function fillData() {
	var obj = Sigma.objectFromForm(formNameFrmPrvAcc);

	Sigma.ajax({
		url: "../../Base/FrmPrvAcc/GetFrmPrvAccList",
		data: obj,
		showErrorToast: true,
		onSuccess: function (data) {
			tableFrmPrvAcc.clear().draw();
			tableFrmPrvAcc.rows.add(JSON.parse(data)).draw();
			modalFormProviderAccounts.modal('show')
		}
	});
}


function GetFrmPrvAcc(AccName) {
	Sigma.ajax({
		url: "../../Base/FrmPrvAcc/GetFrmPrvAcc",
		data: { accName: AccName },
		blockUI: true,
		onSuccess: function (data) {
			var prvAccData = JSON.parse(data);
			if (prvAccData != null && prvAccData.prvAcc != null) {
				FirePrvid = false;
				modalFormProviderAccounts.modal('hide');
				btnFrmPrvAccRetrieve.addClass('disabled');
				btnFrmPrvAccSave.addClass('disabled');
				btnFrmPrvAccUpdate.removeClass('disabled');
				btnFrmPrvAccDelete.removeClass('disabled');
				DrawAccFields(prvAccData);
			}
		}
	});
}

function GetFrmPrvFields(prvId) {
	Sigma.ajax({
		url: "../../Base/FrmPrvAcc/GetFrmPrvFields",
		data: { prvId: prvId },
		blockUI: true,
		onSuccess: function (data) {
			var prvAccData = JSON.parse(data);
			if (prvAccData != null) {
				DrawAccFields(prvAccData)
			}
		}
	});
}

function clearForm() {
	Sigma.clearForm(formNameFrmPrvAcc);

	btnFrmPrvAccRetrieve.removeClass('disabled');
	btnFrmPrvAccSave.removeClass('disabled');
	btnFrmPrvAccUpdate.addClass('disabled');
	btnFrmPrvAccDelete.addClass('disabled');

	Sigma.clearValidationClass(formNameFrmPrvAcc);
	tableFrmPrvAcc.clear().draw();
}

function DrawAccFields(acc) {
	var divHtml = "";
	$("#dynamicFields").html(divHtml);
	$(formNameFrmPrvAccFld + " :input").each(function () { $(this).rules("remove"); });
	if (acc.prvFlds == null)
		return;
	for (var i = 0; i < acc.prvFlds.length; i++) {

		if (acc.prvFlds[i].IsVisible) {
			var value = "";
			if (acc.prvAccFlds != null) {
				var result = $.grep(acc.prvAccFlds, function (e) { return e.FldKey == acc.prvFlds[i].FldKey; });
				if (result.length == 0)
					value = "";
				else
					value = result[0].Value;
			}

			divHtml = DrawField(acc.prvFlds[i].LabelText, acc.prvFlds[i].ValType, acc.prvFlds[i].FldKey, value);
			$("#dynamicFields").append(divHtml);
			if (acc.prvFlds[i].IsMandatory)
				$(formNameFrmPrvAccFld + " input[id=" + acc.prvFlds[i].FldKey + "]").rules("add", { required: true });
		}
	}
}

function DrawField(label, valType, name, value) {
	var text = "";
	text += '<div class="form-group col-md-4">';
	text += '<label class="control-label">' + label + '</label>';
	text += '<div class="input-icon right">';
	text += '<i class="fa"></i>';
	switch (valType) {
		case "string": text += '<input type="text" class="form-control" id="' + name + '" name="' + name + '" value="' + value + '" placeholder="' + label + '">'; break;
		case "number": text += '<input type="text" class="form-control" id="' + name + '" name="' + name + '" value="' + value + '" placeholder="' + label + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57">'; break;
	}
	text += '</div>';
	text += '</div>';
	return text;
}
