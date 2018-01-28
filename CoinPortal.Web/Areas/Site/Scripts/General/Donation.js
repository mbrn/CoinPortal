jQuery(document).ready(function () {

    $('.donateLink').click(function () {
        $('#donation-qrcode').text('');

        var title = $('.m-nav__link-text', this).text();
        var address = $('.donation-address', this).text();

        $('#donationModal').appendTo("body").modal('show');
        $('#donationModal .modal-title').text(title);
        $('#donationModal .donation-address').text(address);

        new QRCode(document.getElementById("donation-qrcode"), address);
    });
});