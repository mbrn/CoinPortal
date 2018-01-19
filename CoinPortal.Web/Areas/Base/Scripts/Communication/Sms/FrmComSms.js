var tableNameFrmComSms = '#tblFrmComSms';
var tableFrmComSms;
var btnFrmComSmsRetrieve = $('#btnFrmComSmsRetrieve');
var btnFrmComSmsCancel = $('#btnFrmComSmsCancel');
var btnFrmComSmsClear = $('#btnFrmComSmsClear');
var formNameFrmComSms = '#frmFrmComSms';

jQuery(document).ready(function () {
	/*============================================================================================*/
	// Init
	/*============================================================================================*/
	tableFrmComSms = Sigma.createDT({
		tableName: tableNameFrmComSms,
		responsive: true,
		stateSave: false,
		showButtons: true,
		fixedHeader: false,
		columns: [
            { title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkboxes_0"><span></span></label>', searchable: false, orderable: false },
            { title: "Guid", mData: "Guid", visible: false, searchable: false },
            { title: "Status", mData: "Status", visible: false, searchable: false },
            { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
            { title: "Grup No", mData: "GroupId" },
            { title: "Gönderici Hesap", mData: "AccountId", sgLookup: comSmsaccLookup },
            { title: "Sms Statüsü", mData: "SmsStatus", sgLookup: comSmsLookup },
            { title: "Gönderilen Adet", mData: "Count" },
            { title: "Gönderilenler", mData: "SmsBody" },
            { title: "Kayıt Tarihi", mData: "InsertDate", sgType: "date", visible: false, searchable: false },
            { title: "Kayıt Zamanı", mData: "InsertTime", sgType: "time", visible: false, searchable: false },
            { title: "Gönderilme Tarihi", mData: "WaitDate", sgType: "date" },
            { title: "Gönderilme Saati", mData: "WaitTime", sgType: "time" },
            { title: "Gönderileceği Tarih", mData: "SendDate", sgType: "date" },
            { title: "Gönderileceği Saati", mData: "SendTime", sgType: "time" },
            { title: "Hata", mData: "ErrorDscr" },
            { title: "CancelUser", mData: "CancelUser", visible: false, searchable: false },
            { title: "CancelDatetime", mData: "CancelDatetime", sgType: 'datetime', visible: false, searchable: false },
            { title: "Referans No", mData: "ResponseId" },
            { title: "Rapor Statüsü", mData: "SmsReportStatus", sgLookup: comSmsLookup },
            { title: "Referans No", mData: "ProviderSmsReportStatus", visible: false, searchable: false },
		],
		columnDefs: [
             {
             	searchable: false,
             	orderable: false,
             	targets: 0,
             	render: function (data, type, full, meta) {
             		if (full.SmsStatus == "W")
             			return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkboxes_0"><span></span></label>';
             		else
             			return '';
             	}
             },
            {
            	targets: 8,
            	defaultContent: "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowBody\"><i class=\"fa fa-eye\"></i> Göster</button>"
            },
            {
            	targets: 6,
            	render: function (data, type, full, meta) {
            		if (full.SmsStatus == "S")
            			return '<span class="label label-success"> ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>'
            		else if (full.SmsStatus == "W")
            			return '<span class="label label-warning">  ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>';
            		else if (full.SmsStatus == "E")
            			return '<span class="label label-danger"> ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>';
            		else if (full.SmsStatus == "P")
            			return '<span class="label label-info"> ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>';
            		else if (full.SmsStatus == "C")
            			return '<span class="label label-default"> ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>';
            		else return "";
            	}
            },
            {
            	targets: 19,
            	render: function (data, type, full, meta) {
            		if (full.SmsReportStatus == "S")
            			return '<span class="label label-success"> ' + Sigma.lookup(comSmsLookup, full.SmsReportStatus) + ' </span>'
            		else if (full.SmsReportStatus == "I")
            			return '<span class="label label-warning"> ' + ' Bekleniyor' + ' </span>'
            		else if (full.SmsReportStatus == "W")
            			return "<button type=\"button\" class=\"btn blue-madison btn-xs btnRequestReport\"><i class=\"fa fa-eye\"></i> Rapor İste</button>";
            		else if (full.SmsReportStatus == "E")
            			return '<span class="label label-danger"> ' + Sigma.lookup(comSmsLookup, full.SmsReportStatus) + ' </span>';
            		else if (full.SmsReportStatus == "P")
            			return '<span class="label label-info"> ' + Sigma.lookup(comSmsLookup, full.SmsReportStatus) + ' </span>';
            		else if (full.SmsReportStatus == "C")
            			return '<span class="label label-default"> ' + Sigma.lookup(comSmsLookup, full.SmsReportStatus) + ' </span>';
            		else return "";
            	}
            }
		]
	});

	Sigma.createDateRangePicker({
		id: '#dateRange'
	});

	/*============================================================================================*/

	/*============================================================================================*/
	// Events
	/*============================================================================================*/

	btnFrmComSmsRetrieve.click(function () {
		fillData();
	});

	btnFrmComSmsCancel.click(function () {

		var SmsCancelList = Sigma.getCheckedRows(tableFrmComSms, undefined, 0);

		if (SmsCancelList.length == 0) {
			Sigma.toastWarning("Lütfen iptal edilecek kayıtları seçiniz", "UYARI");
			return true;
		}

		Sigma.ajax({
			url: "../../Base/FrmComSms/CancelFrmComSmsList",
			data: { Smslist: SmsCancelList },
			showErrorToast: true,
			showSuccessToast: true,
			onSuccess: function (data) {
				fillData();
			}
		});
	});


	$(tableNameFrmComSms + ' tbody').on('click', 'button.btnShowBody', function () {
		var d = Sigma.getSelectedRow(tableFrmComSms, this);
		FillGroupNumbers(d)
		if (d.SmsStatus == "W")
			btnFrmComSmsNumberCancel.show();
		else
			btnFrmComSmsNumberCancel.hide();

		$('#modalBody').modal('show');

	});

	$(tableNameFrmComSms + ' tbody').on('click', 'button.btnRequestReport', function () {
		var d = Sigma.getSelectedRow(tableFrmComSms, this);
		Sigma.ajax({
			url: "../../Base/FrmComSms/RequestReport",
			data: { groupId: d.GroupId },
			showErrorToast: true,
			showSuccessToast: true,
			onSuccess: function (data) {
				clearForm();
			}
		});
	});

	btnFrmComSmsClear.click(function () { clearForm(); });
	/*============================================================================================*/
});

function fillData() {
	var obj = Sigma.objectFromForm(formNameFrmComSms);

	var startDate = Sigma.getDateRangePickerStartDate('#dateRange');
	var endDate = Sigma.getDateRangePickerEndDate('#dateRange');
	obj.AccountId = $('#AccountId').val().replace('-1', '');
	Sigma.ajax({
		url: "../../Base/FrmComSms/GetFrmComSmsList",
		data: { AccountId: obj.AccountId, phoneNo: obj.PhoneNo, smsStatus: obj.SmsStatus, startDate: startDate, endDate: endDate },
		showErrorToast: true,
		onSuccess: function (data) {
			tableFrmComSms.clear().draw();
			tableFrmComSms.rows.add(JSON.parse(data)).draw();
		}
	});
}

function clearForm() {
	Sigma.clearForm(formNameFrmComSms);

	Sigma.clearValidationClass(formNameFrmComSms);
	tableFrmComSms.clear().draw();
}

/*============================================================================================*/
// Sms Detayları
/*============================================================================================*/
var tableNameFrmComSmsBody = '#tblFrmComSmsBody';
var tableFrmComSmsBody;
var btnFrmComSmsNumberCancel = $('#btnFrmComSmsNumberCancel');

jQuery(document).ready(function () {
	/*============================================================================================*/
	// Init
	/*============================================================================================*/
	tableFrmComSmsBody = Sigma.createDT({
		tableName: tableNameFrmComSmsBody,
		columns:
        [
            { title: "<div class=\"checker\"><span><input type=\"checkbox\" class=\"checkboxes_" + 0 + "\"></span></div>", searchable: false, orderable: false },
             { title: "Guid", mData: "Guid", visible: false, searchable: false },
             { title: "Status", mData: "Status", visible: false, searchable: false },
             { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
             { title: "SmsId", mData: "SmsId", visible: false, searchable: false },
             { title: "GroupId", mData: "GroupId", visible: false, searchable: false },
             { title: "Telefon Numarsı", mData: "Number" },
             { title: "Text", mData: "Text" },
             { title: "Servis bağlantısı", mData: "SmsStatus", sgLookup: comSmsLookup, visible: false, searchable: false },
             { title: "Cevap Kodu", mData: "ResponseCode", sgLookup: comSmRspSttLookup, visible: false, searchable: false },
             { title: "Servis Cevap Bilgii", mData: "ProviderResponseCode", visible: false, searchable: false },
             { title: "CancelUser", mData: "CancelUser", visible: false, searchable: false },
             { title: "CancelDatetime", mData: "CancelDatetime", sgType: 'datetime', visible: false, searchable: false },

        ],
		columnDefs: [
              {
              	searchable: false,
              	orderable: false,
              	targets: 0,
              	render: function (data, type, full, meta) {
              		if (full.SmsStatus == "W")
              			return '<div class="checker"><span><input type="checkbox" class="checkboxes_0"></span></div>';
              		else
              			return '';
              	}
              },
             {
             	targets: 8,
             	render: function (data, type, full, meta) {
             		if (full.SmsStatus == "S")
             			return '<span class="label label-success"> ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>'
             		else if (full.SmsStatus == "W")
             			return '<span class="label label-warning">  ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>';
             		else if (full.SmsStatus == "E")
             			return '<span class="label label-danger"> ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>';
             		else if (full.SmsStatus == "P")
             			return '<span class="label label-info"> ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>';
             		else if (full.SmsStatus == "C")
             			return '<span class="label label-default"> ' + Sigma.lookup(comSmsLookup, full.SmsStatus) + ' </span>';
             		else return "";
             	}
             },
		]
	});

	/*============================================================================================*/

	/*============================================================================================*/
	// Events
	/*============================================================================================*/


	btnFrmComSmsNumberCancel.click(function () {

		var SmsCancelList = Sigma.getCheckedRows(tableFrmComSmsBody, undefined, 0);

		if (SmsCancelList.length == 0) {
			Sigma.toastWarning("Lütfen iptal edilecek kayıtları seçiniz", "UYARI");
			return false;
		}

		Sigma.ajax({
			url: "../../Base/FrmComSms/CancelFrmComSmsNumberList",
			data: { Smslist: SmsCancelList },
			showErrorToast: true,
			showSuccessToast: true,
			onSuccess: function (data) {
				fillData();
			}
		});
	});

	/*============================================================================================*/
});

function FillGroupNumbers(group) {
	tableFrmComSmsBody.clear().draw();
	Sigma.ajax({
		url: "../../Base/FrmComSms/GetFrmComSmsNumberList",
		data: { GroupId: group.GroupId },
		showErrorToast: true,
		onSuccess: function (data) {
			tableFrmComSmsBody.rows.add(JSON.parse(data)).draw();
		}
	});
}