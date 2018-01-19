var btnUpdateInfo = $('#btnUpdateInfo');
var formNameUpdateInfo = '#formUpdateInfo';
var formUpdateInfo = $(formNameUpdateInfo);

var btnUpdatePassword = $('#btnUpdatePassword');
var formNameUpdatePassword = '#formUpdatePassword';
var formUpdatePassword = $(formNameUpdatePassword);


jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    Sigma.validate({
        formName: formNameUpdateInfo,
        rules: {
            Name: { required: true },
            Surname: { required: true },            
        },
        messages: {
            Name: { required: "Lütfen adınızı giriniz" },
            Surname: { required: 'Lütfen soyadınızı giriniz' },            
        }
    });

    Sigma.validate({
        formName: formNameUpdatePassword,
        rules: {
            CurrentPassword: { required: true },
            NewPassword: { required: true, minlength: 6 },
            NewPasswordAgain: { equalTo: '#NewPassword' },            
        },
        messages: {
            CurrentPassword: { required: "Lütfen mevcut şifrenizi giriniz" },
            NewPassword: { required: "Lütfen yeni şifrenizi giriniz", minlength: "Yeni şifreniz en az 6 karakterden oluşmalıdır" },
            NewPasswordAgain: { equalTo: "Girdiğiniz yeni şifre uyumsuz" },
        }
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    $('body').on('click', '.profile-sidebar .nav li:not(.active) a', function (e) {
        var newLi = $(this).parent();

        var current = $('.profile-sidebar .nav li.active');
        current.removeClass('active');
        $('#' + current.attr('portlet-id')).slideUp(function () {
            $('#' + newLi.attr('portlet-id')).slideDown();
            newLi.addClass('active');
        });
    });

    btnUpdateInfo.click(function () {
        if ($(formNameUpdateInfo).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var name = formUpdateInfo.find('#Name').val();
        var surname = formUpdateInfo.find('#Surname').val();
        var cellPhone = formUpdateInfo.find('#CellPhone').val();
        var img = $('#imgPreviewDiv img').attr("src");

        Sigma.ajax({
            url: "../../Base/MyProfile/UpdateInfo",
            data: { name: name, surname: surname, cellPhone: cellPhone, img: img },
            onSuccess: function () {
                bootbox.alert("Bilgileriniz güncellenmiştir. Şimdi sayfa güncellenecektir", function () {
                    location.reload();
                });
            },
            showSuccessToast: false,
            showErrorToast: true
        });
    });

    btnUpdatePassword.click(function () {
        if ($(formNameUpdatePassword).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var currentPassword = formUpdatePassword.find('#CurrentPassword').val();
        var newPassword = formUpdatePassword.find('#NewPassword').val();

        Sigma.ajax({
            url: "../../Base/MyProfile/UpdatePassword",
            data: { currentPassword: currentPassword, newPassword: newPassword},
            onSuccess: function () {
                bootbox.alert("Şifreniz güncellenmiştir. Şimdi sayfa güncellenecektir", function () {
                    location.reload();
                });
            },
            showSuccessToast: false,
            showErrorToast: true
        });
    });


    /*============================================================================================*/
});


