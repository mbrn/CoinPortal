/*============================================================================================*/
// Tenancy Type
/*============================================================================================*/

var formNameFrmTntTyp = '#frmFrmTntTyp';
var btnAddFrmTntTyp = $('#btnAddFrmTntTyp');
var modalFormFrmTntTyp = $('#modalFormFrmTntTyp');
var btnFrmTntTypSave = $('#btnFrmTntTypSave');
var btnFrmTntTypUpdate = $('#btnFrmTntTypUpdate');


var tntTypLst;
var currentTntTypData;

var tableNameFrmAutRol = '#tblFrmAutRol';
var tableFrmAutRol;

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    tableFrmAutRol = Sigma.createDT({
        tableName: tableNameFrmAutRol,
        stateSave: false,
        columns: [
        { sgType: "checkable" },
        { title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "Role No", mData: "RoleId" },
        { title: "Role Adı", mData: "RoleName" },
        { title: "Açıklama", mData: "Dscr" },
        ],
    });

    Sigma.validate({
        formName: formNameFrmTntTyp,
        rules: {
            TypCode: { required: true, minlength: 3 },
            TypName: { required: true },            
        },
        messages: {
            TypCode: { required: 'Lütfen tip kodu giriniz', minlength: 'Tip kodu en az 3 karakter olmalıdır' },
            TypName: { required: 'Lütfen tip adını Giriniz' },
        }
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    btnAddFrmTntTyp.click(function () {
        clearFrmTntTypModal();

        btnFrmTntTypSave.removeClass("display-none");
        btnFrmTntTypUpdate.addClass("display-none");

        modalFormFrmTntTyp.modal('show');
    });

    btnFrmTntTypSave.click(function () {
        if ($(formNameFrmTntTyp).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmTntTyp);
        Sigma.ajax({
            url: "../../Base/Tenancy/SaveFrmTntTyp",
            data: { obj: obj },
            onSuccess: function () { modalFormFrmTntTyp.modal('hide'); refreshFrmTntTypLst(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('body').on('click', '#frmTntTypLst .tnt-typ-btn-grp button.btnTntTypUpdate', function (e) {
        var typCode = $(this).parent().attr("tnt-typ-code");
        var tntTyp = getFrmTntTyp(typCode);
        if (tntTyp == "")
            return;

        clearFrmTntTypModal();

        Sigma.fillForm(formNameFrmTntTyp, tntTyp);

        btnFrmTntTypSave.addClass("display-none");
        btnFrmTntTypUpdate.removeClass("display-none");

        modalFormFrmTntTyp.modal('show');
    });

    btnFrmTntTypUpdate.click(function () {
        if ($(formNameFrmTntTyp).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(formNameFrmTntTyp);
        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateFrmTntTyp",
            data: { obj: obj },
            onSuccess: function () { modalFormFrmTntTyp.modal('hide'); refreshFrmTntTypLst(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('body').on('click', '#frmTntTypLst .tnt-typ-btn-grp button.btnTntTypDelete', function (e) {
        var typCode = $(this).parent().attr("tnt-typ-code");
        var tntTyp = getFrmTntTyp(typCode);
        if (tntTyp == "")
            return;

        Sigma.dialogConfirm({
            message: tntTyp.TypName + ' tenant tipini silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/Tenancy/DeleteFrmTntTyp",
                    data: { obj: tntTyp },
                    onSuccess: function () { refreshFrmTntTypLst(); },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    $('body').on('click', '#frmTntTypLst .tnt-typ-btn-grp button.btnTntTypSelect', function (e) {
        var typCode = $(this).parent().attr("tnt-typ-code");
        $('#frmTntTypLst div.tnt-typ-btn-grp[tnt-typ-code!=' + typCode + '] button.btnTntTypSelect').attr('aria-pressed', 'false').removeClass('active');

        if ($(this).attr('aria-pressed') == "true" || $(this).attr('aria-pressed') == true) {
            $('#tntDetailContainer').slideUp();
            $(this).blur();
        }
        else {
            $('#tntDetailContainer').slideUp();
            clearTntTypPckTab();
            // fillData from server

            Sigma.ajax({
                url: "../../Base/Tenancy/GetFrmTntTypDetail",
                data:  { typCode: typCode },
                onSuccess: function (data) {
                    currentTntTypData = JSON.parse(data);

                    currentTntTypData.PckLst.forEach(function (pckDetail) {
                        $('#pckContainer').append(getPckHtml(pckDetail));
                    });

                    currentTntTypData.PckCntLst.forEach(function (pckCnt) {
                        var cnt = $.grep(currentTntTypData.CntLst, function (e) { return e.CntCode == pckCnt.CntCode; })[0];
                        addPckCnt(cnt, pckCnt);
                    });

                    Sigma.clearForm(formNameFrmTntTypOpt);
                    if (currentTntTypData.Opt != null) {
                        Sigma.fillForm(formNameFrmTntTypOpt, currentTntTypData.Opt);
                    }
            
                    fillAuthData();

                    $('#tntDetailContainer').slideDown();
                },
                showSuccessToast: false,
                showErrorToast: true,
            });

            
        }
    });

    refreshFrmTntTypLst();

    /*============================================================================================*/
});

function refreshFrmTntTypLst() {
    Sigma.ajax({
        url: "../../Base/Tenancy/GetFrmTntTypLst",
        onSuccess: function (data) {
            tntTypLst = JSON.parse(data);

            $('#frmTntTypLst').html('');
            tntTypLst.forEach(function (tntTyp) {
                var tntTypBtnGroup = getFrmTntTypBtnGroup(tntTyp);
                $('#frmTntTypLst').append(tntTypBtnGroup);
            });
        },
        showSuccessToast: false,
        showErrorToast: true,
    });
}

function getFrmTntTyp(tntTypCode) {
    var result = $.grep(tntTypLst, function (e) { return e.TypCode == tntTypCode; });
    if (result.length == 0)
        return "";
    else
        return result[0];
}

function getFrmTntTypBtnGroup(tntTyp){
    return  '<div style="margin-right:10px;" class="tnt-typ-btn-grp btn-group btn-group-solid" tnt-typ-code="' + tntTyp.TypCode + '">' +
                '<button type="button" class="btn blue-hoki btn-outline btnTntTypSelect" data-toggle="button" aria-pressed="false">' + tntTyp.TypCode + ' - ' + tntTyp.TypName + '</button>' + 
                '<button type="button" class="btn blue-hoki btn-outline btnTntTypUpdate"><i class="fa fa-refresh"></i></button>' + 
                '<button type="button" class="btn blue-hoki btn-outline btnTntTypDelete"><i class="fa fa-times"></i></button>' + 
            '</div>';
}

function clearFrmTntTypModal() {
    Sigma.clearForm(formNameFrmTntTyp);
    Sigma.clearValidationClass(formNameFrmTntTyp);
}
/*============================================================================================*/



/*============================================================================================*/
// Package
/*============================================================================================*/

var btnAddPck = $('#btnAddPck');
var btnAddFrmTntTypCnt = $('#btnAddFrmTntTypCnt');
var modalFormFrmTntTypPck = $('#modalFormFrmTntTypPck');
var modalFormFrmTntTypPckCnt = $('#modalFormFrmTntTypPckCnt');
var modalFormFrmTntTypPckCntVal = $('#modalFormFrmTntTypPckCntVal');
var frmFrmTntTypPck = '#frmFrmTntTypPck';
var frmFrmTntTypPckPrd = '#frmFrmTntTypPckPrd';
var frmFrmTntTypPckCnt = '#frmFrmTntTypPckCnt';
var frmFrmTntTypPckCntVal = '#frmFrmTntTypPckCntVal';
var btnFrmTntTypPckUpdate = $('#btnFrmTntTypPckUpdate');
var btnFrmTntTypPckCntUpdate = $('#btnFrmTntTypPckCntUpdate');
var btnFrmTntTypPckCntValUpdate = $('#btnFrmTntTypPckCntValUpdate');
var frmTntTypCntDic;

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    frmTntTypCntDic = Sigma.ajaxGetArrayDic('../../Base/Tenancy/GetFrmTntTypCntLst', 'CntCode');

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    // Yeni paket ekleme butonu
    btnAddPck.click(function () {
        var tntTypPck = {};
        tntTypPck.TypCode = currentTntTypData.Typ.TypCode;
        tntTypPck.IsActive = true;
        tntTypPck.PckName = "Paket";

        Sigma.ajax({
            url: "../../Base/Tenancy/AddFrmTntTypPck",
            data: { pck: tntTypPck },
            onSuccess: function (data) {
                var pckDetail = JSON.parse(data);
                $('#pckContainer').append(getPckHtml(pckDetail));
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });    
    
    // Bir paketin verilerinin güncellenmesi icin modalin acilmasi
    var selectedPckContent;
    $('body').on('click', '#pckContainer button.btnUpdatePck', function (e) {
        selectedPckContent = $(this).parents('.package-content:first');

        var t = selectedPckContent.find('.tntTypPck').text();
        var tntTypPck = JSON.parse(t);
        Sigma.clearForm(frmFrmTntTypPck);
        Sigma.fillForm(frmFrmTntTypPck, tntTypPck.Pck);

        Sigma.clearForm(frmFrmTntTypPckPrd);
        Sigma.fillForm(frmFrmTntTypPckPrd, tntTypPck.Prd);
        
        Sigma.setCheckedRows(tableFrmAutRol, tntTypPck.RolLst, 'RoleId');

        modalFormFrmTntTypPck.modal('show');
    });

    // Bir paketin verilerinin güncellenmesi 
    btnFrmTntTypPckUpdate.click(function () {
        var pck = Sigma.objectFromForm(frmFrmTntTypPck);
        var prd = Sigma.objectFromForm(frmFrmTntTypPckPrd);
        var roles = Sigma.getCheckedRows(tableFrmAutRol, 'RoleId');

        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateFrmTntTypPck",
            data: { pck: pck, roles: roles, prd: prd },
            onSuccess: function (data) {
                var pckAllData = JSON.parse(data);
                selectedPckContent.find('.tntTypPck').text(data);
                selectedPckContent.find('.pck-name').text(pckAllData.Pck.PckName);
                
                modalFormFrmTntTypPck.modal('hide');
                
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    // Bir paketin silinmesi
    $('body').on('click', '#pckContainer button.btnDeletePck', function (e) {
        var pckContent = $(this).parents('.package-content:first');
        var pck = JSON.parse(pckContent.find('.tntTypPck').text());

        Sigma.dialogConfirm({
            message: pck.PckName + ' paketini silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/Tenancy/DeleteFrmTntTypPck",
                    data: { pck: pck.Pck },
                    onSuccess: function () {
                        pckContent.remove();
                    },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    // Yeni Özellik eklenmesi 
    btnAddFrmTntTypCnt.click(function () {
        var cntCode = $('#CntCode').val();
        if (cntCode == "") {
            Sigma.toastWarning("Lütfen bir içerik seçiniz");
            return;
        }

        var cnt = frmTntTypCntDic[cntCode];

        var pckCnt = {};
        pckCnt.TypCode = currentTntTypData.Typ.TypCode;
        pckCnt.CntCode = cntCode;
        pckCnt.IsVisible = true;
        Sigma.ajax({
            url: "../../Base/Tenancy/AddFrmTntTypPckCnt",
            data: { cnt: pckCnt },
            onSuccess: function (data) {
                var result = JSON.parse(data);
                addPckCnt(cnt, result.Cnt);

                
                $.each($('#pckContainer div.package-content:not(#pckContent)'), function (index, pck) {
                    var pckObj = JSON.parse($(pck).find('.tntTypPck').text());
                    var val = $.grep(result.ValLst, function (e) { return e.PckId == pckObj.Pck.PckId; })[0];
                    $(pck).find('.price-table-content').append(getPckCntVal(val));
                });
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    // Özelliklerden birinin güncellenmesi için modalin acilmasi
    var selectedPckCntContent;
    $('body').on('click', '#pckContent div h2.pck-cnt-update', function (e) {
        selectedPckCntContent = $(this).parents('.pck-cnt:first')
        var pckCnt = JSON.parse(selectedPckCntContent.find('.pck-cnt-obj').text());

        Sigma.clearForm(frmFrmTntTypPckCnt);
        Sigma.fillForm(frmFrmTntTypPckCnt, pckCnt);
        modalFormFrmTntTypPckCnt.modal('show');
    });

    // Özelliklerden birinin güncellenmesi 
    btnFrmTntTypPckCntUpdate.click(function () {
        var pckCnt = Sigma.objectFromForm(frmFrmTntTypPckCnt);

        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateFrmTntTypPckCnt",
            data: { cnt: pckCnt },
            onSuccess: function (data) {
                pck = JSON.parse(data);
                selectedPckCntContent.find('.pck-cnt-obj').text(data);

                modalFormFrmTntTypPckCnt.modal('hide');
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    // Özelliklerden birinin silinmesi
    $('body').on('click', '#pckContent button.btnDeleteFrmTntTypCnt', function (e) {
        var pckCntHtml = $(this).parents('.pck-cnt:first')
        var pckCnt = JSON.parse(pckCntHtml.find('.pck-cnt-obj').text());

        Sigma.dialogConfirm({
            message: 'Özelliği silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/Tenancy/DeleteFrmTntTypPckCnt",
                    data: { cnt: pckCnt },
                    onSuccess: function () {
                        var index = $('#pckContent .pck-cnt').index(pckCntHtml);
                        $('#pckContent .pck-cnt')[index].remove();
                        $.each($('#pckContainer .package-content.pck'), function (i, pck) {
                            $(pck).find('.pck-cnt-val')[index].remove();
                        });
                    },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    // Değerlere tıklama
    var selectedPckCntVal;
    $('body').on('click', '#pckContainer div.pck div.pck-cnt-val div h2', function (e) {
        selectedPckCntVal = $(this).parents('.pck-cnt-val:first');
        var val = JSON.parse(selectedPckCntVal.find('.pck-cnt-val-obj').text());

        Sigma.clearForm(frmFrmTntTypPckCntVal);
        Sigma.fillForm(frmFrmTntTypPckCntVal, val);
        modalFormFrmTntTypPckCntVal.modal('show');
    });

    btnFrmTntTypPckCntValUpdate.click(function () {
        var val = Sigma.objectFromForm(frmFrmTntTypPckCntVal);

        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateFrmTntTypPckCntVal",
            data: { val: val },
            onSuccess: function (data) {
                val = JSON.parse(data);
                selectedPckCntVal.find('.pck-cnt-val-obj').text(data);

                var viewVal = val.CntViewVal;
                if (val.CntViewVal == undefined || val.CntViewVal == "")
                    viewVal = 'Belirsiz';
                selectedPckCntVal.find('.pck-cnt-val-view').text(viewVal);

                modalFormFrmTntTypPckCntVal.modal('hide');
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    /*============================================================================================*/
});

function addPckCnt(cnt, pckCnt) {
    var cntHtml =   '<div class="pck-cnt row no-margin" style="height:70px;">' +
                        '<div class="pck-cnt-obj display-hide">' + JSON.stringify(pckCnt) + '</div>' +
                        '<div class="col-xs-1 text-right">' + (cnt.CntIcon != null && cnt.CntIcon != '' ? '<i class="' + cnt.CntIcon + '"></i>' : '') + '</div>' +                        
                        '<div class="col-xs-8 text-left"><h2 class="font-blue-hoki opt-pricing-5 no-margin text-underline pck-cnt-update">' + cnt.CntName + '</h2></div>' +
                        '<div class="col-xs-2">' +
                            '<button type="button" class="btn btn-xs blue-hoki btn-outline btnDeleteFrmTntTypCnt"><i class="fa fa-times"></i></button>' +
                        '</div>' +
                    '</div>';

    $('#pckContent .price-table-content').append(cntHtml);    
}

function getPckCntVal(val) {
    var viewVal = val.CntViewVal;
    if (val.CntViewVal == undefined || val.CntViewVal == "")
        viewVal = 'Belirsiz';

    return '<div class="row no-margin pck-cnt-val" style="height:70px;">' +
                '<div class="display-hide pck-cnt-val-obj">' + JSON.stringify(val) + '</div>' + 
                '<div class="text-center"><h2 class="font-blue-hoki opt-pricing-5 no-margin text-underline pck-cnt-val-view">' + viewVal + '</h2></div>' +
            '</div>';
}

function getPckHtml(tntTypPck) {

    var cntCount = $('#pckContent div.price-table-content div.pck-cnt').length;

    var text = '';
    tntTypPck.ValLst.forEach(function (val) {
        text += getPckCntVal(val);
    });    

    return '<div class="col-md-2 col-sm-2 package-content pck">' +
                '<div class="tntTypPck display-hide">' + JSON.stringify(tntTypPck) + '</div>' +                
                '<div class="price-column-container border-left border-top border-right">' +
                    '<div class="price-table-head price-1">' +
                        '<h2 class="font-blue-hoki opt-pricing-5 no-margin pck-name">' + tntTypPck.Pck.PckName + '</h2>' +
                        //'<div class="tnt-typ-btn-grp btn-group btn-group-solid" >' +
                        //    '<button type="button" class="btn blue" disabled>' + tntTypPck.PckName + '</button>' +
                        //    '<button type="button" class="btn blue btnUpdate"><i class="fa fa-edit"></i></button>' +
                        //    '<button type="button" class="btn blue btnDelete"><i class="fa fa-times"></i></button>' +
                        //'</div>' + 
                    '</div>' +
                    '<div class="price-table-pricing">' +
                        '<p class="uppercase"></p>' +
                    '</div>' +
                    '<div class="price-table-content">' +
                        text + 
                    '</div>' +
                    '<div class="price-table-footer">' +
                        '<div class="tnt-typ-btn-grp btn-group btn-group-solid" style="margin:10px;">' +
                            '<button type="button" class="btn btn-sm blue-hoki btn-outline btnUpdatePck"><i class="fa fa-refresh"></i></button>' +
                            '<button type="button" class="btn btn-sm blue-hoki btn-outline btnDeletePck"><i class="fa fa-times"></i></button>' +
                        '</div>' + 
                    '</div>' +
                '</div>' +
            '</div>';
}

function clearTntTypPckTab() {
    $('#pckContainer div.pck[id!="pckContent"]').remove();

    $('#pckContent div.pck-cnt').remove();
}

/*============================================================================================*/


/*============================================================================================*/
// Rol-Screen
/*============================================================================================*/


var btnAddFrmTntAutRol = $('#btnAddFrmTntAutRol');
var btnFrmTntAutRolSave = $('#btnFrmTntAutRolSave');
var btnFrmTntAutRolUpdate = $('#btnFrmTntAutRolUpdate');
var modalFormFrmTntAutRol = $('#modalFormFrmTntAutRol');
var frmFrmTntAutRol = '#frmFrmTntAutRol';

var btnAddFrmTntAutItmScr = $('#btnAddFrmTntAutItmScr');
var btnFrmTntAutItmScrSave = $('#btnFrmTntAutItmScrSave');
var btnFrmTntAutItmScrUpdate = $('#btnFrmTntAutItmScrUpdate');
var modalFormFrmTntAutItmScr = $('#modalFormFrmTntAutItmScr');
var frmFrmTntAutItmScr = '#frmFrmTntAutItmScr';
var tree;
var authData;
var selectedNode;

var btnAddFrmTntAutItmCst = $('#btnAddFrmTntAutItmCst');
var btnFrmTntAutItmCstSave = $('#btnFrmTntAutItmCstSave');
var btnFrmTntAutItmCstUpdate = $('#btnFrmTntAutItmCstUpdate');
var modalFormFrmTntAutItmCst = $('#modalFormFrmTntAutItmCst');
var frmFrmTntAutItmCst = '#frmFrmTntAutItmCst';


jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    createScrTree();

    Sigma.validate({
        formName: frmFrmTntAutRol,
        rules: {
            RoleName: { required: true },
            Dscr: { required: true, minlength: 10 },
        },
        messages: {
            Dscr: { required: 'Lütfen açıklama giriniz', minlength: "Minimum 10 karakter giriniz" },            
        }
    });

    Sigma.validate({
        formName: frmFrmTntAutItmScr,
        rules: {
            ParentId: { required: true },
            NodeType: { required: true },
            ScrType: { required: true },
            ItemName: { required: true },
            ItemDscr: { required: true, minlength: 10 },
        },
        messages: {
            ParentId: { required: 'Lütfen menü seçiniz' },
            NodeType: { required: 'Lütfen menü tipi seçiniz' },
            ScrType: { required: 'Lütfen ekran tipi seçiniz' },
            ItemName: { required: 'Lütfen ekran adı giriniz' },
            ItemDscr: { required: 'Lütfen açıklama giriniz', minlength: "Minimum 10 karakter giriniz" },
        }
    });

    Sigma.validate({
        formName: frmFrmTntAutItmCst,
        rules: {
            ItemName: { required: true },
            ItemDscr: { required: true, minlength: 10 },
        },
        messages: {
            ItemName: { required: 'Lütfen yetki adını giriniz' },
            ItemDscr: { required: 'Lütfen açıklama giriniz', minlength: "Minimum 10 karakter giriniz" },
        }
    });

    $(frmFrmTntAutItmScr + ' #Channel').select2({
        placeholder: "Kanallar",
        allowClear: true
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    // Role
    btnAddFrmTntAutRol.click(function () {
        Sigma.clearForm(frmFrmTntAutRol);

        btnFrmTntAutRolSave.removeClass("display-none");
        btnFrmTntAutRolUpdate.addClass("display-none");

        modalFormFrmTntAutRol.modal('show');
    });

    btnFrmTntAutRolSave.click(function () {
        if ($(frmFrmTntAutRol).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(frmFrmTntAutRol);
        obj.TntType = currentTntTypData.Typ.TypCode;

        Sigma.ajax({
            url: "../../Base/Tenancy/SaveFrmTntAutRol",
            data: { role: obj },
            onSuccess: function (data) {
                modalFormFrmTntAutRol.modal('hide');

                var role = JSON.parse(data);
                $('#frmFrmTntAutRolList').append(getFrmTntAutRolControl(role));
                if(role.IsDefault == false || role.IsDefault == "false")
                    tableFrmAutRol.row.add(role).draw();
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('body').on('click', '#frmFrmTntAutRolList .btnTntAutRolUpdate', function (e) {
        var role = JSON.parse($(this).parents("div:first").find('.json').text());

        Sigma.clearForm(frmFrmTntAutRol);
        Sigma.fillForm(frmFrmTntAutRol, role);

        btnFrmTntAutRolSave.addClass("display-none");
        btnFrmTntAutRolUpdate.removeClass("display-none");

        modalFormFrmTntAutRol.modal('show');
    });

    btnFrmTntAutRolUpdate.click(function () {
        if ($(frmFrmTntAutRol).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(frmFrmTntAutRol);
        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateFrmTntAutRol",
            data: { role: obj },
            onSuccess: function (data) {
                modalFormFrmTntAutRol.modal('hide');

                var obj = JSON.parse(data);
                $('#frmFrmTntAutRolList div[role-id="' + obj.RoleId + '"] div.json').text(data);
                $('#frmFrmTntAutRolList div[role-id="' + obj.RoleId + '"] span.role-name').text(obj.RoleName);
                $('#frmFrmTntAutRolList div[role-id="' + obj.RoleId + '"] h6.role-dscr').text(obj.Dscr);
                tableFrmAutRol.row(tableFrmAutRol.column(4).data().indexOf(obj.RoleId)).data(obj).draw();                
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('body').on('click', '#frmFrmTntAutRolList .btnTntAutRolDelete', function (e) {
        var role = JSON.parse($(this).parents("div:first").find('.json').text());

        Sigma.dialogConfirm({
            message: role.RoleName + ' rolünü silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/Tenancy/DeleteFrmTntAutRol",
                    data: { role: role },
                    onSuccess: function () {
                        $('#frmFrmTntAutRolList div[role-id="' + role.RoleId + '"]').remove();
                        tableFrmAutRol.row(tableFrmAutRol.column(4).data().indexOf(role.RoleId)).remove().draw();
                    },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    var cinemaRole;
    $('body').on('click', '#frmFrmTntAutRolList .btnTntAutRolSetChecks', function (e) {
        cinemaRole = $(this).parents("div:first");
                
        if (cinemaRole.hasClass("IsWatching") == false) {
            cinemaRole.watch({
                // specify CSS styles or attribute names to monitor
                properties: "z-index",

                // callback function when a change is detected
                callback: function (data, i) {
                    var propChanged = data.props[i];
                    var newValue = data.vals[i];                    

                    if (newValue == "auto") {
                        $('#frmFrmTntAutItmCstList span.ItmCstCheckbox').hide();
                        tree.settings.core.multiple = false;
                        tree.hide_checkboxes();                        
                        tree.uncheck_all();

                        cinemaRole.find('.cinema-buttons').hide();
                        cinemaRole.find('.normal-buttons').show();

                        btnAddFrmTntAutItmScr.show();
                        btnAddFrmTntAutItmCst.show();

                        // Bazen portletin z-indexi'i 9999 kalıyor. Bu yüzden tree contextmenu calismiyor. Daha dogrusu altta kalıyor menu. 
                        // z-index düzeltilerek sorun gideriliyor. 
                        $('#screen_tree').parents('.portlet:first').css("zIndex", "auto");
                    }
                }
            });

            cinemaRole.addClass("IsWatching");
        }


        Sigma.ajax({
            url: "../../Base/Tenancy/GetRoleItemList",
            data: { roleId: cinemaRole.attr("role-id") },
            onSuccess: function (data) {
                var rolItmLst = JSON.parse(data);
                // fill tree checkboxes
                tree.deselect_all(true);
                var screenItems = $.map($.grep(rolItmLst, function (e) { return e.ItemType == "S"; }), function (v) { return v.ItemId; });
                var nodes = tree.get_json('#', { flat: true });
                for (i = 0; i < nodes.length; i++)
                {                    
                    if($.inArray(nodes[i].data.ItemId, screenItems) > -1)
                    {
                        tree.check_node(nodes[i].id);                        
                    }
                }                

                // Fill Custom Items
                $('#frmFrmTntAutItmCstList span.ItmCstCheckbox input').each(function () {
                    $(this).prop("checked", false);
                });
                var customItems = $.grep(rolItmLst, function (e) { return e.ItemType == "C"; });
                for (var i = 0; i < customItems.length; i++) {
                    var itemId = customItems[i].ItemId;
                    var input = $('#frmFrmTntAutItmCstList div.ItmCstControl[item-id="' + itemId + '"] span.ItmCstCheckbox input');
                    input.prop('checked', true);
                }
              

                cinemaRole.find('.normal-buttons').hide();
                cinemaRole.find('.cinema-buttons').show();

                $('#frmFrmTntAutItmCstList span.ItmCstCheckbox').show();
                
                tree.settings.core.multiple = true;
                tree.show_checkboxes();
                tree.open_all();
                btnAddFrmTntAutItmScr.hide();
                btnAddFrmTntAutItmCst.hide();

                cinemaRole.cinema({
                    'elements': [$('#screen_tree').parents('.portlet:first'), $('#frmFrmTntAutItmCstList').parents('.portlet:first')],
                });
            },
            showSuccessToast: false,
            showErrorToast: true
        });
    });

    $('body').on('click', '#frmFrmTntAutRolList .btnTntAutRolSetDefault', function (e) {


        var role = JSON.parse($(this).parents("div:first").find('.json').text());

        Sigma.ajax({
            url: "../../Base/Tenancy/FrmTntAutRolSetDefault",
            data: { role: role },
            onSuccess: function (data) {
                var obj = JSON.parse(data);

                $('#frmFrmTntAutRolList div[role-id="' + obj.newDefault.RoleId + '"]').replaceWith(getFrmTntAutRolControl(obj.newDefault));
                tableFrmAutRol.row(tableFrmAutRol.column(4).data().indexOf(obj.newDefault.RoleId)).remove().draw();

                if (obj.oldDefault != null) {
                    $('#frmFrmTntAutRolList div[role-id="' + obj.oldDefault.RoleId + '"]').replaceWith(getFrmTntAutRolControl(obj.oldDefault));
                    tableFrmAutRol.row.add(obj.oldDefault).draw();
                }
            },
            showSuccessToast: true,
            showErrorToast: true
        });

    });
    
    $('body').on('click', '#frmFrmTntAutRolList .btnTntAutRolSaveRelations', function (e) {
        var scrLst = [];
        var checked = tree.get_checked();
        for (i = 0; i < checked.length; i++) {
            var node = tree.get_node(checked[i]);
            if (node.data.NodeType == "N") {
                scrLst.push(node.data.ItemId);
            }
        }

        var cstLst = [];
        $('#frmFrmTntAutItmCstList span.ItmCstCheckbox input').each(function () {
            if ($(this).prop("checked"))
            {
                var itemId = $(this).parents('div.ItmCstControl:first').attr("item-id");
                cstLst.push(itemId);
            }            
        });

        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateRoleItemList",
            data: { roleId: cinemaRole.attr("role-id"), scrLst: scrLst, cstLst : cstLst },
            onSuccess: function () {
                cinemaRole.uncinema();
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('body').on('click', '#frmFrmTntAutRolList .btnTntAutRolCancelRelations', function (e) {
        cinemaRole.uncinema();
    });

    // Screen
    btnAddFrmTntAutItmScr.click(function () {
        Sigma.clearForm(frmFrmTntAutItmScr);

        btnFrmTntAutItmScrSave.removeClass("display-none");
        btnFrmTntAutItmScrUpdate.addClass("display-none");

        var max = 0;
        var treeJson = tree.get_json();
        for (i = 0; i < treeJson.length; i++){
            if (treeJson[i].data.Priority > max)
                max = treeJson[i].data.Priority;
        }
        max += 1;

        $(frmFrmTntAutItmScr + " #ParentId").val(0).trigger('change');
        $(frmFrmTntAutItmScr + " #Priority").val(max);
        selectedNode = null;

        modalFormFrmTntAutItmScr.modal('show');
    });

    btnFrmTntAutItmScrSave.click(function () {
        if ($(frmFrmTntAutItmScr).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(frmFrmTntAutItmScr);
        obj.TntType = currentTntTypData.Typ.TypCode;
        obj.Channel = [].concat(obj.Channel).join(",");

        Sigma.ajax({
            url: "../../Base/Tenancy/SaveFrmTntAutItmScr",
            data: { scr : obj },
            onSuccess: function (data) {
                modalFormFrmTntAutItmScr.modal('hide');

                var scr = JSON.parse(data);
                addScreenToTree(scr, selectedNode);
                if(scr.NodeType == "L")
                    $(frmFrmTntAutItmScr + ' #ParentId').append('<option value=' + scr.ItemId + '>' + scr.ItemName + '</option>');
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnFrmTntAutItmScrUpdate.click(function () {
        if ($(frmFrmTntAutItmScr).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(frmFrmTntAutItmScr);
        obj.Channel = [].concat(obj.Channel).join(",");

        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateFrmTntAutItmScr",
            data: { scr: obj },
            onSuccess: function (data) {
                modalFormFrmTntAutItmScr.modal('hide');

                var scr = JSON.parse(data);
                selectedNode.data = scr;
                tree.set_text(selectedNode, getNodeText(scr));
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    // Custom Item
    btnAddFrmTntAutItmCst.click(function () {
        Sigma.clearForm(frmFrmTntAutItmCst);

        btnFrmTntAutItmCstSave.removeClass("display-none");
        btnFrmTntAutItmCstUpdate.addClass("display-none");

        modalFormFrmTntAutItmCst.modal('show');
    });

    btnFrmTntAutItmCstSave.click(function () {
        if ($(frmFrmTntAutItmCst).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(frmFrmTntAutItmCst);
        obj.TntType = currentTntTypData.Typ.TypCode;

        Sigma.ajax({
            url: "../../Base/Tenancy/SaveFrmTntAutItmCst",
            data: { item: obj },
            onSuccess: function (data) {
                modalFormFrmTntAutItmCst.modal('hide');

                var item = JSON.parse(data);
                $('#frmFrmTntAutItmCstList').append(getFrmTntAutItmCstControl(item));
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('body').on('click', '#frmFrmTntAutItmCstList .btnTntAutItmCstUpdate', function (e) {
        var item = JSON.parse($(this).parents("div.list-group-item:first").find('.json').text());

        Sigma.clearForm(frmFrmTntAutItmCst);
        Sigma.fillForm(frmFrmTntAutItmCst, item);

        btnFrmTntAutItmCstSave.addClass("display-none");
        btnFrmTntAutItmCstUpdate.removeClass("display-none");

        modalFormFrmTntAutItmCst.modal('show');
    });

    btnFrmTntAutItmCstUpdate.click(function () {
        if ($(frmFrmTntAutItmCst).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(frmFrmTntAutItmCst);
        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateFrmTntAutItmCst",
            data: { item: obj },
            onSuccess: function (data) {
                modalFormFrmTntAutItmCst.modal('hide');

                var obj = JSON.parse(data);
                $('#frmFrmTntAutItmCstList a[item-id="' + obj.ItemId + '"] div.json').text(data);
                $('#frmFrmTntAutItmCstList a[item-id="' + obj.ItemId + '"] span.item-name').text(obj.ItemName);
                $('#frmFrmTntAutItmCstList a[item-id="' + obj.ItemId + '"] h6.item-name').text(obj.ItemDscr);
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    $('body').on('click', '#frmFrmTntAutItmCstList .btnTntAutItmCstDelete', function (e) {
        var item = JSON.parse($(this).parents("div:first").find('.json').text());

        Sigma.dialogConfirm({
            message: item.ItemName + ' yetkisini silmek istediğinize emin misiniz?',
            onConfirm: function () {
                Sigma.ajax({
                    url: "../../Base/Tenancy/DeleteFrmTntAutItmCst",
                    data: { item: item },
                    onSuccess: function () {
                        $('#frmFrmTntAutItmCstList div[item-id="' + item.ItemId + '"]').remove();
                    },
                    showSuccessToast: true,
                    showErrorToast: true
                });
            }
        });
    });

    /*============================================================================================*/
});

function fillAuthData() { 
    Sigma.ajax({
        url: "../../Base/Tenancy/GetAuthData",
        data: { tntType: currentTntTypData.Typ.TypCode },
        onSuccess: function (data) {
            authData = JSON.parse(data);

            // Fill Roles
            $('#frmFrmTntAutRolList').html('');
            authData.RoleList.forEach(function (role) {
                var control = getFrmTntAutRolControl(role);
                $('#frmFrmTntAutRolList').append(control);
            });
            tableFrmAutRol.clear().draw();
            var nonDefaultRoles = $.grep(authData.RoleList, function (e) { return e.IsDefault == false || e.IsDefault == "false"; });
            tableFrmAutRol.rows.add(nonDefaultRoles).draw();

            // Fill Tree
            fillScreenTree();
            fillScrParentIdSelect();

            // Fill Custom Items
            $('#frmFrmTntAutItmCstList').html('');
            authData.ItemList.forEach(function (item) {
                var control = getFrmTntAutItmCstControl(item);
                $('#frmFrmTntAutItmCstList').append(control);
            });

        },
        showSuccessToast: false,
        showErrorToast: true
    });
}

function getFrmTntAutRolControl(role) {
    return '<div href="#" class="list-group-item clearfix ' + (role.IsDefault == true || role.IsDefault == "true" ? "bg-grey-steel" : "") + '" role-id="' + role.RoleId + '">' +
                '<div class="display-hide json">' + JSON.stringify(role) + '</div>' +
                '<div class="caption pull-left">' +
                    '<span class="caption-subject bold font-blue-hoki role-name"> ' + role.RoleName + ' </span>' +
                    '<h6 class="font-gray role-dscr" style="margin-top:0px;margin-bottom:0px;">' + role.Dscr + ' </h6>' +
                '</div>' + 
                '<span class="pull-right normal-buttons text-center" >' +
                    (role.IsDefault != true && role.IsDefault != "true" ? '<button class="btn blue-hoki btn-xs btn-outline btnTntAutRolSetDefault"><i class="fa fa-thumbs-up"></i></button> ' : "") +
                    '<button class="btn blue-hoki btn-xs btn-outline btnTntAutRolSetChecks"><i class="fa fa-check"></i></button> ' +
                    '<button class="btn blue-hoki btn-xs btn-outline btnTntAutRolUpdate"><i class="fa fa-refresh"></i></button> ' +
                    '<button class="btn blue-hoki btn-xs btn-outline btnTntAutRolDelete"><i class="fa fa-times"></i></button>' +
                '</span>' +
                '<span class="pull-right display-hide cinema-buttons">' +
                    '<button class="btn blue-hoki btn-sm btn-outline btnTntAutRolSaveRelations"><i class="fa fa-save"></i> Değişiklikleri Kaydet</button> ' +
                    '<button class="btn red btn-sm btn-outline btnTntAutRolCancelRelations"><i class="fa fa-times"></i> İptal</button> ' +
                '</span>' +
            '</div>';
}

function fillScreenTree() {
    // Fill Screens
    tree.refresh();
    var level1 = $.grep(authData.ScreenList, function (e) { return e.ParentId == 0; }).sort(function (a, b) {
        return a.Priority - b.Priority;
    });
    for (var i = 0; i < level1.length; i++) {
        var screen = level1[i];
        addScreenToTree(screen);
    }
}

function addScreenToTree(screen, parentNode) {
    var node = {};
    node.data = screen;
    node.type = screen.NodeType;
    node.text = getNodeText(screen);   
    
    var id = tree.create_node(parentNode == undefined ? null : parentNode, node);

    if (screen.NodeType == "L") {
        var screens = $.grep(authData.ScreenList, function (e) { return e.ParentId == screen.ItemId }).sort(function (a, b) {
            return a.Priority - b.Priority;
        });
        for (var i = 0; i < screens.length; i++) {
            var tmpScreen = screens[i];
            addScreenToTree(tmpScreen, tree.get_node(id));
        }
    }
}

function getNodeText(screen) {
    var isBold = screen.IsDefaultStartScreen == true || screen.IsDefaultStartScreen == "true";


    return '<span>' +
                '<i class="' + screen.ItemIconContent + ' font-blue-hoki"></i></span>' +
                '<span class="font-blue-dark ' + (isBold ? "bold" : "") + '"> ' + screen.ItemName + '</span> <span class="font-grey-salsa"> : ' + getDscrText(screen.ItemDscr, 15) + '</span>' +
           '</span>';
}

function getDscrText(text, maxLength) {
    if (text == null || text == undefined)
        return "";

    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
    }

    return text;
}

function fillScrParentIdSelect() {
    $(frmFrmTntAutItmScr + ' #ParentId').find('option').remove();
    $(frmFrmTntAutItmScr + ' #ParentId').append('<option value=0>Ana Menü</option>');
    authData.ScreenList.sort(function (a, b) {
        if (a.ParentId == b.ParentId)
            return a.Priority - b.Priority;
        else
            return a.ParentId - b.ParentId;
    });
    authData.ScreenList.forEach(function (scr) {
        if (scr.NodeType == "L")
            $(frmFrmTntAutItmScr + ' #ParentId').append('<option value=' + scr.ItemId + '>' + scr.ItemName + '</option>');
    });
}

function createScrTree() {
    tree = $("#screen_tree").jstree({
        "core": {
            "themes": {
                "responsive": false,
                "icons": false
            },
            "check_callback": function (op, node, par, pos, more) {
                if (op = "move_node" && more && more.dnd) {                    
                    return (par.type == "L" || par.type == "#");                    
                }
                return true;
            },
            multiple :false,
        },
        "types": {
            "default": {
                //"icon": "fa fa-list-ul font-blue-hoki icon-lg"
            },
            "L": {
                //"icon": "fa fa-list-ul font-blue-hoki icon-lg"
            },
            "N": {
                //"icon": "fa fa-desktop font-blue-hoki icon-lg"
            }
        },
        "contextmenu": {
            "items": function (node) {
                var items = {
                    Refresh: {
                        "separator_before": true,
                        "separator_after": true,
                        "label": "Güncelle",
                        icon: "fa fa-refresh font-blue-hoki",
                        "action": function (obj) {
                            Sigma.clearForm(frmFrmTntAutItmScr);
                            Sigma.fillForm(frmFrmTntAutItmScr, node.data);
                            if(node.data.Channel != null)
                                $(frmFrmTntAutItmScr + ' #Channel').val(node.data.Channel.split(',')).trigger('change');

                            btnFrmTntAutItmScrSave.addClass("display-none");
                            btnFrmTntAutItmScrUpdate.removeClass("display-none");

                            selectedNode = node;

                            modalFormFrmTntAutItmScr.modal('show');                            
                        }
                    },
                    SetDefault: {
                        "separator_before": true,
                        "separator_after": true,
                        "label": "Açılış Ekranı Yap",
                        icon: "fa fa-check-square font-blue-hoki",
                        "action": function (obj) {
                            if (node.data.IsDefaultStartScreen == true || node.data.IsDefaultStartScreen == "true") {
                                Sigma.toastWarning("Ekran zaten varsayılan olarak ayarlanmış durumda!");
                                return;
                            }

                            Sigma.ajax({
                                url: "../../Base/Tenancy/SetDefaultFrmTntAutItmScr",
                                data: { scr: node.data },
                                onSuccess: function (data) {
                                    var result = JSON.parse(data);

                                    node.data = result.scr;
                                    tree.set_text(node, getNodeText(node.data));

                                    if (result.oldDefault != null) {
                                        var nodes = tree.get_json('#', { flat: true });
                                        for (i = 0; i < nodes.length; i++) {

                                            if (nodes[i].data.ItemId == result.oldDefault.ItemId){
                                                nodes[i].data = result.oldDefault;
                                                tree.set_text(nodes[i], getNodeText(result.oldDefault));
                                            }
                                        }
                                    }
                                },
                                showSuccessToast: true,
                                showErrorToast: true
                            });
                        }
                    },
                    CreateSubMenu: {
                        "separator_before": true,
                        "separator_after": true,
                        "label": "Alt Menü Ekle",
                        icon: "fa fa-list-ul font-blue-hoki",
                        "action": function (obj) {
                            Sigma.clearForm(frmFrmTntAutItmScr);

                            btnFrmTntAutItmScrSave.removeClass("display-none");
                            btnFrmTntAutItmScrUpdate.addClass("display-none");

                            $(frmFrmTntAutItmScr + ' #ParentId').val(node.data.ItemId).trigger("change");
                            $(frmFrmTntAutItmScr + ' #NodeType').val('L').trigger("change");

                            var max = 0;
                            for (i = 0; i < node.children.length; i++) {
                                var tmp = tree.get_node(node.children[i]);
                                if (tmp.data.Priority > max)
                                    max = tmp.data.Priority;
                            }
                            max += 1;
                            $(frmFrmTntAutItmScr + " #Priority").val(max);
                            selectedNode = node;

                            modalFormFrmTntAutItmScr.modal('show');
                        }
                    },
                    CreateSubScreen: {
                        "separator_before": true,
                        "separator_after": true,
                        "label": "Ekran Ekle",
                        icon: "fa fa-desktop font-blue-hoki",
                        "action": function (obj) {
                            Sigma.clearForm(frmFrmTntAutItmScr);

                            btnFrmTntAutItmScrSave.removeClass("display-none");
                            btnFrmTntAutItmScrUpdate.addClass("display-none");

                            $(frmFrmTntAutItmScr + ' #ParentId').val(node.data.ItemId).trigger("change");
                            $(frmFrmTntAutItmScr + ' #NodeType').val('N').trigger("change");

                            var max = 0;
                            for (i = 0; i < node.children.length; i++) {
                                var tmp = tree.get_node(node.children[i]);
                                if (tmp.data.Priority > max)
                                    max = tmp.data.Priority;
                            }
                            max += 1;
                            $(frmFrmTntAutItmScr + " #Priority").val(max);
                            selectedNode = node;

                            modalFormFrmTntAutItmScr.modal('show');
                        }
                    },                    
                    Remove: {
                        "separator_before": true,
                        "separator_after": true,
                        "label": "Sil",
                        icon: "fa fa-times font-red-soft",
                        "action": function (obj) {
                            Sigma.dialogConfirm({
                                message: node.data.ItemName + ' ekranını silmek istediğinize emin misiniz?',
                                onConfirm: function () {
                                    Sigma.ajax({
                                        url: "../../Base/Tenancy/DeleteFrmTntAutItmScr",
                                        data: { scr: node.data },
                                        onSuccess: function () {
                                            if (node.data.NodeType == 'L')
                                                $(frmFrmTntAutItmScr + ' #ParentId option[value="' + node.data.ItemId + '"]').remove();
                                            tree.delete_node(node);
                                        },
                                        showSuccessToast: true,
                                        showErrorToast: true
                                    });
                                }
                            });
                        }
                    }
                };

                if (node.type == 'N') {
                    delete items.CreateSubMenu;
                    delete items.CreateSubScreen;                    
                }
                if (node.type == 'L') {
                    delete items.SetDefault;
                }

                return items;
            }
        },
        "plugins": ["contextmenu", "dnd", "types", "wholerow", "checkbox"], 
        "checkbox": { "visible": false, tie_selection: false, whole_node:false },
    }).jstree(true);


    $("#screen_tree").bind("move_node.jstree", function (e, data) {
        var oldParentId = data.old_parent == "#" ? 0 : tree.get_node(data.old_parent).data.ItemId;
        var newParentId = data.parent == "#" ? 0 : tree.get_node(data.parent).data.ItemId;

        Sigma.ajax({
            url: "../../Base/Tenancy/MoveFrmTntAutItmScr",
            data: { scr: data.node.data, oldParentId : oldParentId, newParentId : newParentId, newPosition : data.position },
            onSuccess: function (data) {
                authData.ScreenList = JSON.parse(data);
                fillScreenTree();
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });
}

function getFrmTntAutItmCstControl(item) {
    return '<div class="list-group-item clearfix ItmCstControl" item-id="' + item.ItemId + '">' +
                '<div class="display-hide json">' + JSON.stringify(item) + '</div>' +
                '<span class="display-hide ItmCstCheckbox pull-left " style="margin-top: 3px;"><label class="ItmCstCheckbox mt-checkbox mt-checkbox-single mt-checkbox-outline display-hide"><input type="checkbox"><span></span></label></span>' +
                '<div class="caption pull-left">' +                    
                    '<span class="caption-subject bold font-blue-hoki item-name">' + item.ItemName + ' </span>' +
                    '<h6 class="font-gray item-dscr" style="margin-top:0px;margin-bottom:0px;">' + item.ItemDscr + ' </h6>' +
                '</div>' +
                '<span class="pull-right">' +
                    '<button class="btn blue-hoki btn-xs btn-outline btnTntAutItmCstUpdate"><i class="fa fa-refresh"></i></button> ' +
                    '<button class="btn blue-hoki btn-xs btn-outline btnTntAutItmCstDelete"><i class="fa fa-times"></i></button>' +
                '</span>' +
            '</div>';
}
/*============================================================================================*/



/*============================================================================================*/
// Tenancy Options
/*============================================================================================*/

var formNameFrmTntTypOpt = '#frmFrmTntTypOpt';
var btnSaveFrmTntTypOpt = $('#btnSaveFrmTntTypOpt');

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/


    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    btnSaveFrmTntTypOpt.click(function () {
        var opt = Sigma.objectFromForm(formNameFrmTntTypOpt);
        opt.TypCode = currentTntTypData.Typ.TypCode;

        Sigma.ajax({
            url: "../../Base/Tenancy/UpdateFrmTntTypOpt",
            data: { opt : opt },
            onSuccess: function (data) {
                opt = JSON.parse(data);
                currentTntTypData.Opt = opt;
                Sigma.fillForm(formNameFrmTntTypOpt, opt);
            },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    /*============================================================================================*/
});
/*============================================================================================*/


