var tableNameFrmTntAutUsr = '#tblFrmTntAutUsr';
var tableFrmTntAutUsr;
var btnFrmTntAutUsrAdd = $('#btnFrmTntAutUsrAdd');
var btnFrmTntAutUsrSave = $('#btnFrmTntAutUsrSave');
var btnFrmTntAutUsrUpdate = $('#btnFrmTntAutUsrUpdate');
var btnFrmTntAutUsrInviteModal = $('#btnFrmTntAutUsrInviteModal');
var btnFrmTntAutUsrInvite = $('#btnFrmTntAutUsrInvite');
var formNameFrmTntAutUsr = '#frmFrmTntAutUsr';
var formNameFrmTntAutUsrInvite = '#frmFrmTntAutUsrInvite';
var modalFormFrmTntAutUsr = $('#modalFormFrmTntAutUsr');
var modalFormFrmTntAutUsrInvite = $('#modalFormFrmTntAutUsrInvite');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tableFrmTntAutUsr = Sigma.createDT({
        tableName: tableNameFrmTntAutUsr,
        columns: [
            { title: "", searchable: false, orderable: false, width: 20 },
            { title: "Guid", mData: "Guid", visible: false, searchable: false },
            { title: "Status", mData: "Status", visible: false, searchable: false },
            { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
            { title: "UsrId", mData: "UsrId", visible: false, searchable: false },
            { title: "Ad Soyad", mData: "DisplayName" },
            { title: "Kullanıcı Adı", mData: "Username", visible: false, searchable: false },
            { title: "Mail Adresi", mData: "Mail", },
            { title: "CellPhone", mData: "CellPhone", visible: false, },
            { title: "Name", mData: "Name", visible: false, },
            { title: "Surname", mData: "Surname", visible: false, },
            { title: "AutType", mData: "AutType", visible: false, searchable: false },
            { title: "Password", mData: "Password", visible: false, searchable: false },
            { title: "VerificationCode", mData: "VerificationCode", visible: false, searchable: false },
            { title: "ImgPath", mData: "ImgPath", visible: false, searchable: false },
            { title: "Aktiflik", mData: "IsActive", sgType: "boolean", visible: false, searchable: false, orderable: false },
            { title: "Sahip", mData: "IsTenantOwner", sgType: "boolean", visible: false, searchable: false, orderable: false },
            { title: "Roller", mData: "Roles", visible: false, searchable: false, orderable: false },
            //{ title: "Yetkiler", searchable: false, orderable: false },
            { title: "Aktiflik", searchable: false, orderable: false, className: 'dt-body-center' },
            { title: "Durum", searchable: false, orderable: false, className: 'dt-body-center' },
            { title: "Son Giriş", mData: "LastLoginDate", searchable: false, className: 'dt-body-center' },
            { title: "", searchable: false, orderable: false }, ],
        columnDefs: [
        {
            targets: 0,
            render: function (data, type, full, meta) {
                var imgPath = window.location.protocol + "//" + window.location.host + "/" + full.ImgPath;
                return '<img alt="" width="50px" height="50px" class="img-circle" src="' + imgPath + '" onerror="this.src = &quot;/Theme/Sigma/img/empty_user_2.png&quot;;">'
            }
        },
        {
            targets: 5, // DisplayName
            render: function (data, type, full, meta) {
                if (full.IsTenantOwner == true || full.IsTenantOwner == "true") {
                    return '<span class="font-blue-madison bold">' + full.DisplayName + '</span>';
                }
                else {
                    return full.DisplayName;
                }
            }
        },
        {
            targets: 7, // Mail
            render: function (data, type, full, meta) {
                if (full.IsTenantOwner == true || full.IsTenantOwner == "true") {
                    return '<span class="font-blue-madison bold">' + full.Mail + '</span>';
                }
                else {
                    return full.Mail;
                }
            }
        },
        {
            targets: -4,
            render: function (data, type, full, meta) {
                if (full.UsrId == 0 || (full.IsTenantOwner == true || full.IsTenantOwner == "true")) {
                    return '';
                }
                else {
                    return '<input type="checkbox" class="table-switch" ' + (full.IsActive ? "checked" : "") + ' data-on-text="<span class=\'fa fa-check\'></span>" data-off-text="<span class=\'fa fa-times\'></span>">';
                }
            }
        },
        {
            targets: -3,
            render: function (data, type, full, meta) {
                if (full.UsrId == 0) {
                    return '<span class="label label-warning"> Onay Bekleniyor </span>';
                }
                else if (full.IsTenantOwner == true || full.IsTenantOwner == "true") {
                    return '<span class="label label-success"> Hesap Sahibi </span>';
                }
                else {
                    return '<span class="label label-info"> Onaylandı </span>';
                }
            }
        },
        {
            targets: -2,
            render: function (data, type, full, meta) {
                if (full.LastLoginDate.startsWith("1900"))
                    return "-";

                var tooltip = moment(full.LastLoginDate).format('DD.MM.YYYY HH:mm:ss');                
                return '<span data-container="body" data-placement="top" data-original-title="' + tooltip + '" class="tooltips">' + moment(full.LastLoginDate).fromNow() + '</span>';
            }
        },
        {
            targets: -1,
            render: function (data, type, full, meta) {
                var result = "<div style=\"width:125px;\">";
                if (full.UsrId == 0) {
                    result += '<button type="button" data-container="body" data-placement="top" data-original-title="Davetiye mailini yeniden gönder" class="tooltips btn green-haze btn-sm btn-outline btnSendMail"><i class="fa fa-paper-plane"></i></button>';
                    result += '<button type="button" data-container="body" data-placement="top" data-original-title="Davetiyeyi iptal et" class="tooltips btn red-soft btn-sm btn-outline btnRowDelete"><i class="fa fa-times"></i></button>';
                }
                else {
                    result += '<button type="button" data-container="body" data-placement="top" data-original-title="Güncelle" class="tooltips btn blue-soft btn-sm btn-outline btnRowUpdate"><i class="fa fa-refresh"></i></button>';
                    if (full.IsTenantOwner == false || full.IsTenantOwner == "false")
                        result += '<button type="button" data-container="body" data-placement="top" data-original-title="Sil" class="tooltips btn red-soft btn-sm btn-outline btnRowDelete"><i class="fa fa-times"></i></button>';
                }

                result += "</div>";

                return result;
            }
        },
        ]
    });

    $(tableNameFrmTntAutUsr).on('draw.dt', function () {
        $(".table-switch").bootstrapSwitch({
            size: 'mini'
        });
    });

    Sigma.validate({
        formName: formNameFrmTntAutUsr,
        rules: {
            Name: { required: true },
            Surname: { required: true },
            DisplayName: { required: true },
            Mail: { required: true, email: true },
            Username: { required: true },
        },
        messages: {
            Name: { required: "Lütfen kullanıcının adını giriniz" },
            Surname: { required: 'Lütfen kullanıcının soyadını giriniz' },
            DisplayName: { required: 'Lütfen kullanıcı için sistemde kullanılacak bir isim giriniz' },
            Mail: { required: 'Lütfen kullanıcının mail adresini giriniz', email: 'Lütfen geçerli bir mail adresi giriniz' },
            Username: { required: 'Lütfen kullanıcının login olurken kullanacağı kullanıcı adını giriniz' },
        }
    });

    if ($(formNameFrmTntAutUsr).find("#AutType").length)
        $(formNameFrmTntAutUsr + " select[id=AutType]").rules("add", { required: true });

    Sigma.validate({
        formName: formNameFrmTntAutUsrInvite,
        rules: {
            Mail: { required: true, email: true },
        },
        messages: {
            Mail: { required: 'Lütfen kullanıcının mail adresini giriniz', email: 'Lütfen geçerli bir mail adresi giriniz' },
        }
    });

    $('.bs-select').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check'
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    $("#cmbIsActive").change(function () {
        fillData();
    });

    btnFrmTntAutUsrAdd.click(function () {
        clearForm();

        modalFormFrmTntAutUsr.find('#header').html('<i class="fa fa-user-plus"> </i> KULLANICI EKLE');
        modalFormFrmTntAutUsr.find('a[href*="tab_user_perms"]').parent().show();
        modalFormFrmTntAutUsr.find('a[href*="tab_user_info"]').parent().addClass("active")
        modalFormFrmTntAutUsr.find('#tab_user_info').addClass("active");
        modalFormFrmTntAutUsr.find('a[href*="tab_user_perms"]').parent().removeClass("active")
        modalFormFrmTntAutUsr.find('#tab_user_perms').removeClass("active");

        btnFrmTntAutUsrSave.removeClass("display-none");
        btnFrmTntAutUsrUpdate.addClass("display-none");

        modalFormFrmTntAutUsr.modal('show');
    });

    btnFrmTntAutUsrSave.click(function () {
        if ($(formNameFrmTntAutUsr).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var usr = Sigma.objectFromForm(formNameFrmTntAutUsr);
        var img = $('#imgPreviewDiv img').attr("src");
        var isActive = $(formNameFrmTntAutUsr + ' #IsActive').val();
        var roles = [];

        $('#roles div.role-box input.make-switch').each(function (index, role) {
            if ($(role).val() == true || $(role).val() == "true") {
                roles.push($(role).parents('div.role-box:first').attr('role-id'));
            }
        });

        Sigma.ajax({
            url: "../../Base/FrmTntAutUsr/SaveFrmTntAutUsr",
            data: { usr: usr, isActive: isActive, roles: roles, img: img },
            onSuccess: function () { modalFormFrmTntAutUsr.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $(tableNameFrmTntAutUsr + ' tbody').on('click', 'button.btnRowUpdate', function () {
        clearForm();
        $(formNameFrmTntAutUsr + ' #Mail').prop('disabled', true);

        var d = tableFrmTntAutUsr.row($(this).parents('tr')).data();
        modalFormFrmTntAutUsr.find('#header').html('<i class="fa fa-user"> </i> ' + d.DisplayName);

        modalFormFrmTntAutUsr.find('a[href*="tab_user_info"]').parent().addClass("active")
        modalFormFrmTntAutUsr.find('#tab_user_info').addClass("active");
        modalFormFrmTntAutUsr.find('a[href*="tab_user_perms"]').parent().removeClass("active")
        modalFormFrmTntAutUsr.find('#tab_user_perms').removeClass("active");

        if (d.IsTenantOwner == true || d.IsTenantOwner == "true") {
            modalFormFrmTntAutUsr.find('#IsActive').parents(".form-group:first").hide();
            modalFormFrmTntAutUsr.find('a[href*="tab_user_perms"]').parent().hide()
        }
        else
        {
            modalFormFrmTntAutUsr.find('a[href*="tab_user_perms"]').parent().show()
        }
            


        Sigma.fillForm(formNameFrmTntAutUsr, d);
        if (d.ImgPath != "") {
            var imgPath = window.location.protocol + "//" + window.location.host + "/" + d.ImgPath;
            $('#imgPreviewDiv').append('<img src="' + imgPath + '"/>');
            $('#imgPreviewDiv').parent().removeClass('fileinput-new').addClass('fileinput-exists');
        }


        if (d.Roles != undefined && d.Roles != "") {
            var roles = d.Roles.split(",");
            for (i = 0; i < roles.length; i++) {
                $('#roles div.role-box[role-id="' + roles[i] + '"] input.make-switch').prop('checked', true).trigger('change');
            }
        }

        btnFrmTntAutUsrSave.addClass("display-none");
        btnFrmTntAutUsrUpdate.removeClass("display-none");

        modalFormFrmTntAutUsr.modal('show');
    });

    $(tableNameFrmTntAutUsr + ' tbody').on('click', 'button.btnRowDelete', function () {
        var usr = tableFrmTntAutUsr.row($(this).parents('tr')).data();

        if (usr.UsrId == 0) {
            Sigma.dialogConfirm({
                message: 'Davetiyeyi iptal etmek istediğinize emin misiniz?',
                onConfirm: function () {
                    Sigma.ajax({
                        url: "../../Base/FrmTntAutUsr/DeleteFrmTntAutUsrTntInv",
                        data: { mail: usr.Mail },
                        onSuccess: function () { fillData(); },
                        showSuccessToast: true,
                        showErrorToast: true
                    });
                }
            });
        }
        else {
            Sigma.dialogConfirm({
                message: usr.DisplayName + ' kullanıcısını silmek istediğinize emin misiniz?',
                onConfirm: function () {
                    Sigma.ajax({
                        url: "../../Base/FrmTntAutUsr/DeleteFrmTntAutUsr",
                        data: usr,
                        onSuccess: function () { fillData(); },
                        showSuccessToast: true,
                        showErrorToast: true
                    });
                }
            });
        }
    });

    $(tableNameFrmTntAutUsr + ' tbody').on('click', 'button.btnSendMail', function () {
        var usr = tableFrmTntAutUsr.row($(this).parents('tr')).data();

        Sigma.ajax({
            url: "../../Base/FrmTntAutUsr/SendInviteMail",
            data: { mail: usr.Mail },
            onSuccess: function () { fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnFrmTntAutUsrUpdate.click(function () {
        if ($(formNameFrmTntAutUsr).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var usr = Sigma.objectFromForm(formNameFrmTntAutUsr);
        var img = $('#imgPreviewDiv img').attr("src");
        var isActive = $(formNameFrmTntAutUsr + ' #IsActive').val();
        var rolesTrue = [];
        var rolesFalse = [];

        $('#roles div.role-box input.make-switch').each(function (index, role) {
            if ($(role).val() == true || $(role).val() == "true") {
                rolesTrue.push($(role).parents('div.role-box:first').attr('role-id'));
            }
            else {
                rolesFalse.push($(role).parents('div.role-box:first').attr('role-id'));
            }
        });

        Sigma.ajax({
            url: "../../Base/FrmTntAutUsr/UpdateFrmTntAutUsr",
            data: { usr: usr, isActive: isActive, rolesTrue: rolesTrue, rolesFalse: rolesFalse, img: img },
            onSuccess: function () {  modalFormFrmTntAutUsr.modal('hide'); fillData(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('#Name, #Surname').on('input propertychange paste', function () {
        $('#DisplayName').val($('#Name').val() + " " + $('#Surname').val());
    });

    $('#Mail').on('input propertychange paste', function () {
        $('#Username').val($('#Mail').val());
    });

    $('body').on('switchChange.bootstrapSwitch', 'input.table-switch', function (e, data) {
        var user = tableFrmTntAutUsr.row($(this).parents('tr')).data();
        var bsSwitch = $(this);

        Sigma.ajax({
            url: "../../Base/FrmTntAutUsr/UpdateFrmTntAutUsrIsActive",
            data: { usrId: user.UsrId, isActive: data },
            onSuccess: function () {
                if (data) {
                    Sigma.toastSuccess('Kullanıcı aktifleştirildi');
                    user.IsActive = true;
                }
                else {
                    Sigma.toastSuccess('Kullanıcı pasifleştirildi');
                    user.IsActive = false;
                }

            },
            onError: function () {
                bsSwitch.bootstrapSwitch('state', !data, true);
            },
            showSuccessToast: false,
            showErrorToast: true
        });
    });

    btnFrmTntAutUsrInviteModal.click(function () {
        Sigma.clearForm(formNameFrmTntAutUsrInvite);
        Sigma.clearValidationClass(formNameFrmTntAutUsrInvite);

        modalFormFrmTntAutUsrInvite.modal('show');
    });

    btnFrmTntAutUsrInvite.click(function () {
        if ($(formNameFrmTntAutUsrInvite).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var mail = $(formNameFrmTntAutUsrInvite + ' #Mail').val();

        Sigma.ajax({
            url: "../../Base/FrmTntAutUsr/SaveFrmTntAutUsrInvite",
            data: { mail: mail },
            onSuccess: function () {
                Sigma.toastSuccess("Kullanıcı davet maili gönderildi")
                modalFormFrmTntAutUsrInvite.modal('hide');
                fillData();
            },
            showSuccessToast: false,
            showErrorToast: true
        });

    });

    /*============================================================================================*/
});
function fillData() {
    var isActive = $('#cmbIsActive').val();
    Sigma.ajax({
        url: "../../Base/FrmTntAutUsr/GetFrmTntAutUsrList",
        data: { isActive: isActive },
        blockUI: true,
        blockMessage: "",
        blockTarget: tableNameFrmTntAutUsr,
        onSuccess: function (data) {
            tableFrmTntAutUsr.clear().draw();
            tableFrmTntAutUsr.rows.add(JSON.parse(data)).draw();

            $('.tooltips').tooltip();
        }
    });
}

function clearForm() {
    Sigma.clearForm(formNameFrmTntAutUsr);
    Sigma.clearValidationClass(formNameFrmTntAutUsr);

    $(formNameFrmTntAutUsr + ' #IsActive').parents(".form-group:first").show();
    $(formNameFrmTntAutUsr + ' #roles').show();

    $(formNameFrmTntAutUsr + ' #Mail').prop('disabled', false);
    $('.fileinput').fileinput('clear');
    $('#roles input.make-switch').prop('checked', false).trigger('change');
}