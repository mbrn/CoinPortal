jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    $('#form_wizard_1').bootstrapWizard({
        previousSelector: '#btnBack',
        nextSelector: '#btnForward',        
        onTabShow: function (tab, navigation, index) {
        },
        onTabClick: function (tab, navigation, index, clickedIndex) {
            return false;
        },
        onPrevious: function (tab, navigation, index) {
            var id = tab.attr('id');

            if (id == 'tabAddress') {
                $('#btnBack').hide();
            }
            else if (id == 'tabPayment') {
                $('#btnConfirm').hide();
                $('#btnForward').show();
            }

            $(navigation).find("li:eq(" + index + ")").removeClass('done');
        },
        onNext: function (tab, navigation, index) {
            var id = tab.attr('id');

            if (id == 'tabBasket') {
                $('#btnBack').show();
            }                        
            else if (id == 'tabAddress') {
                var shpAdr = Sigma.objectFromForm('#frmFrmCmrOrdAdr_S');
                var blnAdr = Sigma.objectFromForm('#frmFrmCmrOrdAdr_B');

                Sigma.ajax({
                    url: '../../Base/Order/SaveOrdAdr',
                    data: { shpAdr: shpAdr, blnAdr: blnAdr },
                    blockTarget: '#form_wizard_1',
                    //async: false,
                    onSuccess: function (data) {
                        var d = JSON.parse(data);

                        Sigma.fillForm('#frmFrmCmrOrdAdr_S', d.shpAdr);
                        Sigma.fillForm('#frmFrmCmrOrdAdr_B', d.blnAdr);

                        $(navigation).find("li:eq(" + (index - 1) + ")").addClass('done');
                        $('#form_wizard_1').bootstrapWizard('show', 2);
                        $('#btnConfirm').show();
                        $('#btnForward').hide();
                    },
                    showSuccessToast: false,
                    showErrorToast: true
                });

                return false;
            }

            $(navigation).find("li:eq(" + (index - 1) + ")").addClass('done');            

            return true;
        }
    });

    refreshBasketData(model);

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    $('body').on('click', '.btnUpdatePrd', function (e) {
        var row = $(this).parents('.ord-prd-row:first');
        var ordPrdId = row.attr('ord-prd-id');
        var quantity = row.find('.quantity').val();

        Sigma.ajax({
            url: "../../Base/Order/UpdateOrdPrd",
            data: { ordPrdId: ordPrdId, quantity: quantity },
            onSuccess: function (data) {
                var order = JSON.parse(data);
                refreshBasketData(order);
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('body').on('click', '.btnDeletePrd', function (e) {        
        return;
        var row = $(this).parents('.ord-prd-row:first');
        var ordPrdId = row.attr('ord-prd-id');

        Sigma.dialogConfirm({
            message: 'Ürünü sepetinizden çıkarmak istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/Order/DeleteOrdPrd",
                    data: { ordPrdId: ordPrdId },
                    onSuccess: function (data) {
                        var order = JSON.parse(data);
                        refreshBasketData(order);
                    },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    $('#frmFrmCmrOrdAdr_B #SameAsShipment').change(function () {
        if ($(this).is(':checked')){
            $('#frmFrmCmrOrdAdr_B #CityId').parents('.form-group:first').hide();
            $('#frmFrmCmrOrdAdr_B #TownId').parents('.form-group:first').hide();
            $('#frmFrmCmrOrdAdr_B #AddressText').parents('.form-group:first').hide();
            $('#frmFrmCmrOrdAdr_B #ZipCode').parents('.form-group:first').hide();
            $('#frmFrmCmrOrdAdr_B #Phone').parents('.form-group:first').hide();
        }
        else {
            $('#frmFrmCmrOrdAdr_B #CityId').parents('.form-group:first').show();
            $('#frmFrmCmrOrdAdr_B #TownId').parents('.form-group:first').show();
            $('#frmFrmCmrOrdAdr_B #AddressText').parents('.form-group:first').show();
            $('#frmFrmCmrOrdAdr_B #ZipCode').parents('.form-group:first').show();
            $('#frmFrmCmrOrdAdr_B #Phone').parents('.form-group:first').show();
        }        
    });

    $('#frmFrmCmrOrdAdr_B input[type=radio][name=BillingType]').change(function () {
        if (this.value == 'B') {
            $('#frmFrmCmrOrdAdr_B #TaxOffice').parents('.form-group:first').hide();
        }
        else if (this.value == 'K') {
            $('#frmFrmCmrOrdAdr_B #TaxOffice').parents('.form-group:first').show();
        }
    });

    $('[id="CityId"]').change(function () {
        var form = $(this).parents('form:first');        
        var townSelect = form.find('#TownId');
        townSelect.val('').change();

        var val = $(this).val();
        if (val == "") {
            townSelect.html('');
            townSelect.attr('disabled', 'disabled');
            return;
        }

        Sigma.ajax({
            url: '../../Base/FrmPrmCityTown/GetFrmPrmCityTownList',
            data: { CityId: val },
            blockTarget: $('#' + form.attr("Id") + " " + "#TownId").parents('.form-group:first').find('span.select2'),
            onSuccess: function (data) {
                var townList = JSON.parse(data);
                townSelect.find('option').remove();
                townSelect.removeAttr('disabled');
                townSelect.append('<option></option>');
                for (i = 0; i < townList.length; i++) {
                    townSelect.append('<option value="' + townList[i].TownId + '">' + townList[i].TownName + '</option>');
                }
            },
            showSuccessToast: false,
            showErrorToast: true
        });

       

       

        
    });

    $('#btnConfirm').click(function () {
        $('#btnClose3dsModal').parent().slideUp();
        $('#frame3ds').attr('src', "");

        var obj = Sigma.objectFromForm('#frmFrmCmrOrdPym');


        Sigma.ajax({
            url: "../../Base/Order/DoPayment",
            data: obj,
            onSuccess: function (data) {
                var result = JSON.parse(data);

                if (result.Result == true || result.Result == "true") {
                    $('#modal3ds').modal({
                        backdrop: 'static',
                        keyboard: false
                    });                    
                    App.blockUI({ target: $('#modal3ds .modal-body'), animate: !0 });

                    $('#frame3ds').attr('src', result.UcdUrl);
                    
                }
                else {
                    bootbox.alert("İşlem yapılamamıştır. Hata: " + result.PrvRspText);
                }
            },
            showSuccessToast: false,
            showErrorToast: true
        });
    });

    $('#frame3ds').load(function () {
        App.unblockUI($('#modal3ds .modal-body'));

        var url = window.frames["frame3ds"].location.href;
        if (url && url.length > 0 && url != "about:blank") { // Baska browserlarda bunlardan baska bisey cikar mi acaba. 
            if (url.indexOf("/PrvResultSuccess") >= 0) {
                $('#modal3ds').modal('hide');
                App.blockUI();
                window.location = window.location.origin + "/Base/Order/OrderCompleted/" + model.Ord.OrdId;                
            }
            else if (url.indexOf("/PrvResultError")) {
                $('#btnClose3dsModal').parent().slideDown();
            }
        }
    });

    /*============================================================================================*/
});

function refreshBasketData(order) {
    $('#ordPrdContainer').html('');
    var totalAmnt = 0;
    for (i = 0; i < order.PrdLst.length; i++) {
        totalAmnt += order.PrdLst[i].TotalAmnt;
        $('#ordPrdContainer').append(getOrdPrdRow(order.PrdLst[i]));
    }

    $('#totalAmnt, #totalAmnt2').text(totalAmnt);
    $('#shipmentAmnt, #shipmentAmnt2').text(0);
    $('#generalTotalAmnt, #generalTotalAmnt2').text(totalAmnt);
}

function getOrdPrdRow(ordPrd){
    return '<tr class="ord-prd-row" ord-prd-id="' + ordPrd.OrdPrdId + '">' +
                '<td data-th="Ürün">' +
                    '<div class="row">' +
                        '<div class="col-sm-2 hidden-xs"><img src="http://placehold.it/100x100" alt="..." class="img-responsive" /></div>' +
                        '<div class="col-sm-10">' +
                            '<h4 class="nomargin">' + ordPrd.PrdName + '</h4>' +
                            '<p>' + ordPrd.PrdShortDscr + '</p>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td data-th="Fiyat">&#x20BA;' + ordPrd.Amnt + '</td>' +
                '<td data-th="Adet / Süre">' +
                    '<input type="number" class="form-control text-center quantity" value="' + ordPrd.Quantity + '">' +
                '</td>' +
                '<td data-th="Tutar" class="text-center">&#x20BA;' + ordPrd.TotalAmnt + '</td>' +
                '<td class="actions" data-th="">' +
                    '<a class="btnUpdatePrd btn blue-soft btn-sm btn-outline" ord-prd-id="' + ordPrd.OrdPrdId + '"><i class="fa fa-refresh"></i></a>' +
                    '<a class="btnDeletePrd btn red-soft btn-sm btn-outline" ord-prd-id="' + ordPrd.OrdPrdId + '"><i class="fa fa-trash-o"></i></a>' +
                '</td>' +
            '</tr>';
}

function saveOrdAdr() {
    
}
