//== Class Definition
var SnippetLogin = function () {

    var login = $('#m_login');

    var showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        alert.animateClass('fadeIn animated');
        alert.find('span').html(msg);
    }

    //== Private Functions

    var displaySignUpForm = function () {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signin');

        login.addClass('m-login--signup');
        login.find('.m-login__signup').animateClass('flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signup');

        login.addClass('m-login--signin');
        login.find('.m-login__signin').animateClass('flipInX animated');
    }

    var displayForgetPasswordForm = function () {
        login.removeClass('m-login--signin');
        login.removeClass('m-login--signup');

        login.addClass('m-login--forget-password');
        login.find('.m-login__forget-password').animateClass('flipInX animated');
    }

    var handleFormSwitch = function () {
        $('#m_login_forget_password').click(function (e) {
            e.preventDefault();
            displayForgetPasswordForm();
        });

        $('#m_login_forget_password_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#m_login_signup').click(function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#m_login_signup_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    var handleSignInFormSubmit = function () {
        $('#m_login_signin_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    email: { required: 'Lütfen mail adresinizi giriniz', email: 'Lütfen geçerli bir mail adresi giriniz' },
                    password: {required: 'Lütfen şifrenizi giriniz'}
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '/Base/Login/Validation',
                success: function (response, status, xhr, $form) {

                    if (response.result == true) {
                        window.location = '/';
                        return;
                    }
                    else {
                        if (response.showCaptcha == true) {
                            window.location = '';
                            return;
                        }
                        
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        showErrorMsg(form, 'danger', 'Girdiğiniz kullanıcı adı veya şifre hatalı. Lütfen kontrol ederek tekrar deneyiniz.');
                    }
                }
            });
        });
    }

    var handleSignUpFormSubmit = function () {
        $('#m_login_signup_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    name: { required: true },
                    surname: { required: true },
                    mail: { required: true, email: true },
                    password: { required: true, minlength: 6 },
                    rpassword: { required: true, equalTo: '.m-login__signup #password' }                    
                },
                messages: {
                    name: { required: 'Lütfen adınızı giriniz' },
                    surname: { required: 'Lütfen soyadınızı giriniz' },
                    mail: { required: 'Lütfen mail adresinizi giriniz', email: 'Lütfen geçerli bir mail adresi giriniz' },
                    password: { required: 'Lütfen şifrenizi giriniz', minlength: 'Şifreniz en az 6 karakter olmalıdır' },
                    rpassword: { required: 'Lütfen şifrenizi tekrar giriniz', equalTo: 'Şifre uyuşmuyor' }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '/Membership/SignUp',
                success: function (response, status, xhr, $form) {
                    if (response.result == true) {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        form.clearForm();
                        form.validate().resetForm();

                        displaySignInForm();
                        var signInForm = login.find('.m-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(signInForm, 'success', 'Teşekkürler. Üyeliğinizi tamamlamak için lütfen mailinize gelen aktivasyon linkine tıklayınız.');
                    }
                    else {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        if (response.description == "System Error") {
                            showErrorMsg(form, 'danger', 'Bilgileriniz kaydedilirken bir sistem hatası oluştu. Lütfen daha sonra tekrar deneyiniz.');
                        }
                        else {
                            showErrorMsg(form, 'danger', response.description);
                        }
                    }                    
                }
            });
        });
    }

    var handleForgetPasswordFormSubmit = function () {
        $('#m_login_forget_password_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    mail: {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    mail: { required: 'Lütfen mail adresinizi giriniz', email: 'Lütfen geçerli bir mail adresi giriniz' }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '/Membership/SendPasswordResetLink',
                success: function (response, status, xhr, $form) {
                    if (response.result == true) {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        form.clearForm();
                        form.validate().resetForm();

                        displaySignInForm();
                        var signInForm = login.find('.m-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(signInForm, 'success', 'Mail adresinize şifre yenileme linkiniz gönderildi. Lütfen mailinizi kontrol ediniz');
                    }
                    else {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        if (response.description == "System Error") {
                            showErrorMsg(form, 'danger', 'Bilgileriniz kaydedilirken bir sistem hatası oluştu. Lütfen daha sonra tekrar deneyiniz.');
                        }
                        else {
                            showErrorMsg(form, 'danger', response.description);
                        }
                    }                          
                }
            });
        });
    }

    //== Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgetPasswordFormSubmit();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function () {
    SnippetLogin.init();
});