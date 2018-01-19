var tableNameFrmAnnDef = '#tblFrmAnnDef';
var tableFrmAnnDef;
var btnFrmAnnDefAdd = $('#btnFrmAnnDefAdd');
var btnFrmAnnDefSave = $('#btnFrmAnnDefSave');
var btnFrmAnnDefUpdate = $('#btnFrmAnnDefUpdate');
var formNameFrmAnnDef = '#frmFrmAnnDef';
var modalFormFrmAnnDef = $('#modalFormFrmAnnDef');
var annList = null;
jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init 
    /*============================================================================================*/
    tableFrmAnnDef = Sigma.createDT({
        tableName: tableNameFrmAnnDef,
        responsive:true,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "AnnounceId", mData: "AnnounceId", visible: false, searchable: false },
        { title: "Resim", mData: "ImageId" },
        { title: "Icon", mData: "Icon", className:'dt-body-center' },
        { title: "Aktiflik", mData: "IsActive", sgType: "boolean" },
        { title: "Öncelik", mData: "Priority" },
        { title: "Duyuru Durumu"},
        { title: "Kategori Adı", mData: "CtgId", sgLookup: catLookup },
        { title: "Tenant Tipi", mData: "TntType", visible: isSuperTenancy, searchable: false, sgLookup: tntTypeLookup },
        { title: "Tenant Adı", mData: "TntId", visible: isSuperTenancy, searchable: false, sgLookup: tntLookup  },
        { title: "Konu", mData: "Subject" },
        { title: "Duyuru Özeti", mData: "AnnounceSummary" },
        { title: "Duyuru", mData: "Announce", "width": "5%" },
        { title: "Etiketler", mData: "Tags", "width": "10%" },
        { title: "Başlama Tarihi", mData: "StartDate", sgType: 'date' },
        { title: "Bitiş Tarihi", mData: "FinishDate", sgType: 'date' },
        { title: "InsertDatetime", mData: "InsertDatetime", visible: false, searchable: false },
        { title: "InsertUser", mData: "InsertUser", visible: false, searchable: false },
        { title: "", searchable: false, orderable: false },
        ],
        columnDefs: [
            {
                targets: -1,
                defaultContent: "<div style=\"width:125px;\">" +
                "<button type=\"button\" class=\"btn blue-madison btn-xs btnRowUpdate\"><i class=\"fa fa-refresh\"></i> Güncelle</button>" +
                "<button type=\"button\" class=\"btn red-sunglo btn-xs btnRowDelete\"><i class=\"fa fa-times\"></i> Sil</button>" +
                "</div>"
            },
            {
                targets: 4,
                render: function (data, type, full, meta) {
                    var imgPath = window.location.protocol + "//" + window.location.host + "/" + full.ImagePath;
                    return '<img alt="" width="70px" height="70px" src="' + imgPath + '" onerror="this.src = &quot;/Theme/Sigma/Img/empty_user_2.png&quot;;">'
                }
            },
            {
                 targets: 5,
                 render: function (data, type, full, meta) {
                     return '<i class="' + full.Icon + '"></i>';
                 }
            },
            {
                targets: 8,
                render: function (data, type, full, meta) {

                    var startdate = new Date(full.StartDate);
                    var enddate = new Date(full.FinishDate);
                    var isActive = false;
                    if (full.IsActive)
                    {
                        if (startdate <= Date.now() && enddate >= Date.now()) {
                            isActive = true;
                        }
                    }
                  
                    if(isActive)
                    {
                        return '<span class="label label-success"> Devam ediyor </span>';
                    }
                    else
                    {
                        return '<span class="label label-warning"> Sona erdi </span>';
                    }
                }
            },
              {
                  targets: 13,
                  render: function (data, type, full, meta) {
                      return "<button type=\"button\" class=\"btn blue-madison btn-xs show-moreSummary\"><i class=\"fa fa-eye\"></i> Göster</button>";
                  }
              },
             
            {
                targets: 14,
                render: function (data, type, full, meta) {
                    return  "<button type=\"button\" class=\"btn blue-madison btn-xs show-more\"><i class=\"fa fa-eye\"></i> Göster</button>";
                }
            },
              {
                  targets: 15,
                  render: function (data, type, full, meta) {
                      var arr = data.split(',');
                      var text = "";

                      arr.forEach(function (item) {
                          if (item.trim() != "") {
                              text += '<span class="label label-info"> ' + item + ' </span>&nbsp;'
                          }
                      });

                      return text;
                  }
              },
        ]
    });

    Sigma.validate({
        formName: formNameFrmAnnDef,
        rules: {
            CtgId: { required: true },
            Subject: { required: true },
            AnnounceSummary: { required: true },
            StartDate: { required: true },
            FinishDate: { required: true },
            Announce: { required: true },
            Icon: { required: true },
        },
        messages: {
        }
    });

    fillData();
    $('#Announce').sgRichTextBox();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    $('body').on('click', '.show-more', function (event) {
        var obj = Sigma.getSelectedRow(tableFrmAnnDef, this);
        $("#txtAnnouncePopup").html( obj.Announce);
        $("#modalAnnouncetPopup").modal("show");
    });

    $('body').on('click', '.show-moreSummary', function (event) {
        var obj = Sigma.getSelectedRow(tableFrmAnnDef, this);
        $("#txtAnnouncePopup").html(obj.AnnounceSummary);
        //$("#txtAnnouncePopup").text($(event.target).next().text());
        $("#modalAnnouncetPopup").modal("show");
    });

    $('.bs-select').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check'
    });

    $("#cmbIsActive").change(function () {
        FilterGrid($(this).val());
    });

    //$("#TntType").change(function () {
    //    if ($(this).val() != "")
    //    {
    //        $("#TntType").rules("add", "required");
    //        $("#TntId").rules("remove", "required");
    //        $("#TntId").val("").change();
    //    }
      
    //});

    //$("#TntId").change(function () {
    //    if ($(this).val() != "") {
    //        $("#TntId").rules("add", "required");
    //        $("#TntType").rules("remove", "required");
    //        $("#TntType").val("").change();
    //    }
    //});

    btnFrmAnnDefAdd.click(function () {
        $('#Announce').sgRichTextBox('value', '');
        Sigma.clearForm(formNameFrmAnnDef);
        Sigma.clearValidationClass(formNameFrmAnnDef);

        btnFrmAnnDefSave.removeClass("display-none");
        btnFrmAnnDefUpdate.addClass("display-none");

        modalFormFrmAnnDef.modal('show');
    });

    btnFrmAnnDefSave.click(function () {
        $('#Announce').val($('#Announce').sgRichTextBox('value').trim());
        if ($(formNameFrmAnnDef).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmAnnDef);
        Sigma.ajax({
            url: "../../Base/FrmAnnDef/SaveFrmAnnDef",
            data: obj,
            onSuccess: function () { modalFormFrmAnnDef.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmAnnDef + ' tbody').on('click', 'button.btnRowUpdate', function () {
        Sigma.clearForm(formNameFrmAnnDef);
        Sigma.clearValidationClass(formNameFrmAnnDef);

        var obj = Sigma.getSelectedRow(tableFrmAnnDef, this);
        Sigma.fillForm(formNameFrmAnnDef, obj);
        $('#Announce').sgRichTextBox('value', obj.Announce);
        if (obj.ImagePath != "") {
            var imgPath = window.location.protocol + "//" + window.location.host + "/" + obj.ImagePath;
            $('#AnnounceImagePath').append('<img src="' + imgPath + '"/>');
            $('#AnnounceImagePath').parent().removeClass('fileinput-new').addClass('fileinput-exists');
        }
        btnFrmAnnDefSave.addClass("display-none");
        btnFrmAnnDefUpdate.removeClass("display-none");

        modalFormFrmAnnDef.modal('show');
    });

    $(tableNameFrmAnnDef + ' tbody').on('click', 'button.btnRowDelete', function () {
        var obj = Sigma.getSelectedRow(tableFrmAnnDef, this);

        Sigma.dialogConfirm({
            message: 'Kaydı silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/FrmAnnDef/DeleteFrmAnnDef",
                    data: obj,
                    onSuccess: function () { fillData(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    btnFrmAnnDefUpdate.click(function () {
        $('#Announce').val($('#Announce').sgRichTextBox('value').trim());
        if ($(formNameFrmAnnDef).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }
        var img = $('#AnnounceImagePath img').attr("src")
        var obj = Sigma.objectFromForm(formNameFrmAnnDef);
        Sigma.ajax({
            url: "../../Base/FrmAnnDef/UpdateFrmAnnDef",
            data: { obj: obj, img: img },
            onSuccess: function () { modalFormFrmAnnDef.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
    /*============================================================================================*/
});
function fillData() {
    Sigma.ajax({
        url: "../../Base/FrmAnnDef/GetFrmAnnDefList",
        onSuccess: function (data) {
            tableFrmAnnDef.clear().draw();
            tableFrmAnnDef.rows.add(JSON.parse(data)).draw();
            annList = JSON.parse(data);
            FilterGrid($("#cmbIsActive").val());
        }
    });
}
 
function FilterGrid(status) {
    tableFrmAnnDef.clear().draw();
     
    if (status == "-1")
        tableFrmAnnDef.rows.add(annList).draw();
    for (var i = 0; i < annList.length; i++) {

        var isActive = IsActiveDate(annList[i]);
        if (status == "1" && isActive)
            tableFrmAnnDef.row.add(annList[i]).draw();
        else if (status == "0" && !isActive)
            tableFrmAnnDef.row.add(annList[i]).draw();
    }
}

function IsActiveDate(row)
{
    var startdate = new Date(row.StartDate);
    var enddate = new Date(row.FinishDate);
    var isActive = false;
    if (row.IsActive) {
        if (startdate <= Date.now() && enddate >= Date.now()) {
            isActive = true;
        }
    }

    return isActive;
}