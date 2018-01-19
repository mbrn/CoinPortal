

var Sigma = function () {
    return {

        /*============================================================================================*/
        // Form Methods
        /*============================================================================================*/
        init: function () {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-top-right",
                "progressBar": false,
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut",
            };

            $.fn.datepicker.dates['tr'] = {
                days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
                daysShort: ["Pz", "Pzt", "Sal", "Çrş", "Prş", "Cu", "Cts", "Pz"],
                daysMin: ["Pz", "Pzt", "Sa", "Çr", "Pr", "Cu", "Ct", "Pz"],
                months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
                monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
                today: "Bugün",
                clear: "Temizle",
                format: "dd.mm.yyyy",
                weekStart: 1,
            };
            $.fn.datetimepicker.dates['tr'] = {
                days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
                daysShort: ["Pz", "Pzt", "Sal", "Çrş", "Prş", "Cu", "Cts", "Pz"],
                daysMin: ["Pz", "Pzt", "Sa", "Çr", "Pr", "Cu", "Ct", "Pz"],
                months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
                monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
                today: "Bugün",
                clear: "Temizle",
                format: "dd.mm.yyyy - hh:ii",
                weekStart: 1,
                meridiem: '',
            };

            if (jQuery().datepicker) {
                $('.date-picker').datepicker({
                    rtl: App.isRTL(),
                    orientation: "left",
                    language: "tr",
                    autoclose: true,
                    todayBtn: 'linked',
                    clearBtn: true,
                    todayHighlight: true,
                });
            }

            $(".datetime-picker").datetimepicker({
                rtl: App.isRTL(),
                orientation: "left",
                language: "tr",
                autoclose: true,
                todayBtn: true,
                clearBtn: true,
                pickerPosition: "bottom-left",
                minuteStep: 5,
                todayHighlight: true,


                //autoclose: true,
                //isRTL: App.isRTL(),
                //format: "dd MM yyyy - hh:ii",
                //fontAwesome: true,
                //pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
            });

            $('.timepicker-24').timepicker({
                autoclose: true,
                minuteStep: 1,
                secondStep: 1,
                showSeconds: true,
                showMeridian: false,
                defaultTime: 0
            });

            // handle input group button click
            $('.timepicker').parent('.input-group').on('click', '.input-group-btn', function (e) {
                e.preventDefault();
                $(this).parent('.input-group').find('.timepicker').timepicker('showWidget');
            });

            // Text editor
            if ($('.wysihtml5').size() > 0) {
                $('.wysihtml5').wysihtml5({
                    "stylesheets": ["../../assets/global/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
                });
            }

            //datatable date sutunların siralanmasi icin
            // TODO metronic 4.7.5 ile atil duruma dustu
            //$(":input").inputmask();

            jQuery.extend(jQuery.fn.dataTableExt.oSort, {
                "date-pre": function (a) {
                    if (a == null || a == "") {
                        return 0;
                    }
                    return new Date(a).valueOf();
                },

                "date-asc": function (a, b) {
                    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                },

                "date-desc": function (a, b) {
                    return ((a < b) ? 1 : ((a > b) ? -1 : 0));
                }
            });

            //datatable date sutunların renderi icin
            jQuery.fn.dataTable.render['date'] = function () {
                return {
                    display: function (d) {
                        if (Object.prototype.toString.call(d) === "[object Date]") {
                            if (isNaN(d.getTime())) {
                                return '';
                            }
                            else {
                                return d.ToTrString();
                            }
                        }
                        else {
                            return new Date(d).ToTrString();
                        }
                    }
                };
            };

            //datatable time sutunların renderi icin
            jQuery.fn.dataTable.render['time'] = function () {
                return {
                    display: function (d) {
                        if (d == undefined || d == null)
                            return '';
                        else
                            return d.toString().padLeft(6, '0').insertAt(4, ':').insertAt(2, ':');
                    }
                };
            };

            //datatable time sutunların renderi icin
            jQuery.fn.dataTable.render['time4'] = function () {
                return {
                    display: function (d) {
                        if (d == undefined || d == null)
                            return '';
                        else
                            return d.toString().padLeft(4, '0').insertAt(2, ':');
                    }
                };
            };

            //datatable date sutunların renderi icin
            jQuery.fn.dataTable.render['datetime'] = function () {
                return {
                    display: function (d) {
                        var dt;
                        if (Object.prototype.toString.call(d) === "[object Date]") {
                            if (isNaN(d.getTime())) {
                                return '';
                            }
                            else {
                                dt = d;
                                //return d.ToTrString() + " " + d.getHours().toString() + ":" + d.getMinutes().toString() + ":" + d.getSeconds().toString();
                            }
                        }
                        else {
                            dt = Sigma.ToLocalDate(new Date(d));
                            //return dt.ToTrString() + " " + dt.getHours().toString() + ":" + dt.getMinutes().toString() + ":" + dt.getSeconds().toString();
                        }

                        //2014-01-01T23:28:56.782Z

                        var hh = dt.getHours().toString();
                        var mi = dt.getMinutes().toString();
                        var ss = dt.getSeconds().toString();
                        var ms = dt.getMilliseconds().toString();

                        return dt.ToTrString() + " " + (hh[1] ? hh : "0" + hh[0]) + ":" + (mi[1] ? mi : "0" + mi[0]) + ":" + (ss[1] ? ss : "0" + ss[0]);
                    }
                };
            };

            //select2 componenti
            $.fn.select2.defaults.set("theme", "bootstrap");
            Sigma.createSelect2({
                id: 'select.select2:not(.sg-multilang)',
            });

            Sigma.initMultilangs();

            //FontAweSome combobox icon eklentisi

            function format(icon) {
                var originalOption = icon.element;
                return '<i class="fa ' + $(originalOption).data('icon') + '"></i> ' + icon.text;
            }

            function formatSelection(icon) {
                var originalOption = icon.element;
                return '<i class="fa ' + $(originalOption).data('icon') + '"></i> ' + icon.text;
            }

            Sigma.createSelect2({
                id: 'select.FontawesomeCombo',
                width: "100%",
                templateResult: format,
                templateSelection: formatSelection,
                escapeMarkup: function (m) { return m; },
            });

            // Daterangepickers
            //sg - date - range - pickers
        },
        /*============================================================================================*/

        /*============================================================================================*/
        // Form Methods
        /*============================================================================================*/

        fillForm: function (divName, jsonData) {
            var $div = $(divName);
            $.each(jsonData, function (key, value) {
                var inputName = "input[name='" + key + "']";
                if ($div.find(inputName).attr("type") == "checkbox") {
                    if (value == true || value == "true") {
                        if ($div.find(inputName).hasClass('make-switch'))
                            $div.find(inputName).bootstrapSwitch('state', true);
                        else {
                            $div.find(inputName).prop("checked", true);
                            //$div.find(inputName).val(true).change();
                        }
                    }
                    else {
                        if ($div.find(inputName).hasClass('make-switch'))
                            $div.find(inputName).bootstrapSwitch('state', false);
                        else {
                            $div.find(inputName).prop("checked", false);
                            //$div.find(inputName).val(false).change();                            
                        }
                    }
                }
                else if ($div.find(inputName).attr("type") == "radio") {
                    $div.find('input[name="' + key + '"][value="' + value + '"]').prop('checked', true).click();
                }
                else
                    $div.find(inputName).val(value);

                $div.find("textarea[name='" + key + "']").val(value);
                $div.find("select[name='" + key + "']:not(.select2)").val(value).change();
                $div.find("select.select2[name='" + key + "']").val(value).trigger("change"); // Select2 combolarin doldurulmasi
                if (value == true || value == "true") { // Metronic checkboxlarinin set edilmesi
                    $div.find("input[name='" + key + "'][type=checkbox]").parent("span").addClass("checked");
                }
                else {
                    $div.find("input[name='" + key + "'][type=checkbox]").parent("span").removeClass("checked");
                }

                $div.find("select.sg-multilang[name='" + key + "']").each(function (index, element) {
                    Sigma.setSgMultilangSelectVal($(element), value);
                });

                //$div.find("input.date-picker[name='" + key + "']").datepicker('setDate', new Date(parseInt(value.toString().replace(/\/Date\((.*?)\)\//gi, "$1")))); // Datepicker set edilmesi
                $div.find("input.date-picker[name='" + key + "']").datepicker('setDate', new Date(value)); // Datepicker set edilmesi                
                if (value != null)
                    $div.find("input.timepicker[name='" + key + "']").val(value.toString().padLeft(6, '0').insertAt(2, ':').insertAt(5, ':'));
            });
        },

        clearForm: function (divName) {
            var $div = $(divName);
            $div.find("input[type=text]:not(.noclear), textarea:not(.noclear), input[type=email]:not(.noclear)").val("");
            $div.find("input[type=number]").val("");
            $div.find("input[type=hidden]").each(function (index, element) {
                var attr = $(this).attr('data-val-number');
                if (typeof attr !== typeof undefined && attr !== false)
                    $(this).val("-1");
                else
                    $(this).val("");
            });

            $div.find('input[type=radio]:not(.noclear):first').prop('checked', true).click();
            $div.find("select:not(.noclear)").val('').change();
            $div.find("input[type=checkbox]:not(.noclear)").attr("checked", false);
            $div.find("input[type=checkbox].make-switch:not(.noclear)").bootstrapSwitch('state', false); // Bootstrap switchlerin temizlenmesi
            $div.find("select.select2:not(.noclear)").val(null); // Multi select tagli combolarin temizlenmesi
            $div.find("input[type=checkbox]:not(.noclear)").parent("span").removeClass("checked"); // Metronic checkboxlarinin temizlenmesi
            $div.find("input.date-picker:not(.noclear)").datepicker('setDate', null); // Datepicker set edilmesi

            $div.find("select.sg-multilang").each(function (index, element) {
                Sigma.setSgMultilangSelectVal($(element), null);
            });
        },

        objectFromForm: function (divName, object) {
            // Disabled elementleri almiyor yoksa
            var disabled = $(divName).find(':input:disabled').removeAttr('disabled');

            var $div = $(divName + ' :input');

            if (object == null || object == undefined)
                object = {};

            var a = $div.serializeArray();
            $div.each(function (index) {
                var value = null;
                if ($(this).attr("type") == "checkbox") {
                    value = $(this).is(":checked").toString();
                }
                else if ($(this).parent().hasClass("datetime-picker")) {
                    value = $(this).parent().data("datetimepicker").getDate();
                }
                else if ($(this).parent().hasClass("date-picker")) { // Yeni tip datepickerlarda class ust divde oluyor.
                    value = $(this).parent().data("datepicker").getDate();
                }
                else if ($(this).hasClass("date-picker")) { // Eski tip datepickerlarda class inputun kendisinde oluyor. 
                    value = $(this).datepicker('getDate');
                }
                else if ($(this).hasClass("timepicker")) {
                    value = $(this).val().toString().replace(/\:/g, '');
                }
                else {
                    return;
                }

                var fieldname = this.name;
                $(this).attr("value", value);
                var result = $.grep(a, function (e, i) { return e.name == fieldname; });
                if (result.length == 0) {
                    a.push({ name: this.name, value: value });
                } else if (result.length == 1) {
                    result[0].value = value;
                }

            });
            $.each(a, function () {
                if (object[this.name] !== undefined) {
                    if (!object[this.name].push) {
                        object[this.name] = [object[this.name]];
                    }
                    object[this.name].push(this.value || '');
                } else {
                    object[this.name] = this.value || '';
                }
            });

            disabled.attr('disabled', 'disabled');
            return object;
        },

        validate: function (params) {
            var obj = params.formName;
            if ($.type(obj) === "string") {
                obj = $(obj);
            }

            obj.validate({
                rules: params.rules,
                messages: params.messages,
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: params.ignore,
                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group                
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                errorPlacement: function (error, element) { // render error placement for each input type
                    var icon = $(element).parent('.input-icon').children('i');
                    icon.removeClass('fa-check').addClass("fa-warning");
                    icon.attr("data-original-title", error.text()).tooltip({ 'container': 'body' });
                },
                success: function (label, element) {
                    var icon = $(element).parent('.input-icon').children('i');
                    $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    icon.removeClass("fa-warning").addClass("fa-check");
                }
            });
        },

        clearValidationClass: function (formName) {
            $(formName + ' .input-icon i').removeClass('fa-check').removeClass("fa-warning");
            $(formName + ' .form-group').removeClass('has-error').removeClass('has-success');
        },
        /*============================================================================================*/

        /*============================================================================================*/
        // Toast Methods
        /*============================================================================================*/
        toastSuccess: function (content, header) {
            toastr.success(content, header);
        },

        toastInfo: function (content, header) {
            toastr.info(content, header);
        },

        toastWarning: function (content, header) {
            toastr.warning(content, header);
        },

        toastError: function (content, header) {
            toastr.error(content, header);
        },
        /*============================================================================================*/

        /*============================================================================================*/
        // Ajax Methods
        /*============================================================================================*/
        ajax: function (params) {
            if (params.type == undefined) params.type = "POST";
            if (params.dataType == undefined) params.dataType = "json";
            if (params.async == undefined) params.async = true;
            if (params.contentType == undefined) params.contentType = "application/json; charset=utf-8";
            if (params.processData == undefined) params.processData = true;

            if (params.showSuccessToast == undefined) params.showSuccessToast = false;
            if (params.successText == undefined) params.successText = "İşlem başarı ile tamamlandı";
            if (params.blockUI == undefined) params.blockUI = true;
            if (params.blockTarget == undefined) params.blockTarget = undefined;
            if (params.showErrorToast == undefined) params.showErrorToast = false;
            if (params.errorHeader == undefined) params.errorHeader = "HATA";
            if (params.toStringify == undefined) params.toStringify = true;

            if (params.toStringify == true)
                params.data = JSON.stringify(params.data);

            $.ajax({
                async: params.async,
                type: params.type,
                datatype: params.dataType,
                url: params.url,
                contentType: params.contentType,
                data: params.data,
                processData: params.processData,
                beforeSend: function () {
                    if (params.blockUI) {
                        if (params.blockMessage && params.blockMessage.length > 0)
                            App.blockUI({ target: params.blockTarget, boxed: true, message: params.blockMessage, zIndex: 99999 });
                        else
                            App.blockUI({ target: params.blockTarget, animate: !0 });
                    }
                }
            }).success(function (data) {
                if (params.showSuccessToast) Sigma.toastSuccess(params.successText);
                if (params.onSuccess != undefined) params.onSuccess(data);
            }).error(function (message) {
                var errorTxt;
                if (message.responseJSON != undefined) {
                    errorTxt = JSON.parse(message.responseJSON).ErrorMessage;
                }
                else {
                    errorTxt = "Bağlantı hatası";
                }
                if (params.showErrorToast) Sigma.toastError(errorTxt, params.errorHeader);
                if (params.onError != undefined) params.onError(message);
            }).complete(function () {
                if (params.blockUI) App.unblockUI(params.blockTarget);
                if (params.onComplete != undefined) params.onComplete();
            });
        },

        ajaxGetData: function (url, data) {
            var result = undefined;
            Sigma.ajax({
                url: url,
                data: data,
                blockUI: false,
                async: false,
                onSuccess: function (data) {
                    result = JSON.parse(data);
                },
                showErrorToast: true
            });

            return result;
        },

        ajaxGetArrayDic: function (url, keyName) {
            var array = Sigma.ajaxGetData(url);
            return Sigma.arrayToDic(array, keyName);
        },
        /*============================================================================================*/

        /*============================================================================================*/
        // Dialog Methods
        /*============================================================================================*/
        dialogConfirm: function (params) {
            if (params.confirmText == undefined) params.confirmText = 'Evet';
            if (params.cancelText == undefined) params.cancelText = 'Hayır';
            if (params.message == undefined) params.message = 'Emin misiniz?';
            if (params.title == undefined) params.title = 'UYARI';

            bootbox.confirm({
                buttons: {
                    confirm: {
                        label: params.confirmText,
                        className: 'btn blue-madison'
                    },
                    cancel: {
                        label: params.cancelText,
                        className: 'btn default'
                    }
                },
                message: params.message,
                title: params.title,
                callback: function (result) {
                    if (result == true) {
                        if (params.onConfirm != undefined) params.onConfirm();
                    }
                    else {
                        if (params.onCancel != undefined) params.onCancel();
                    }
                },
            });
        },
        /*============================================================================================*/

        /*============================================================================================*/
        // DataTable Methods
        /*============================================================================================*/

        createDT: function (params) {
            if (params.showButtons == undefined) params.showButtons = false;
            if (params.responsive == undefined) params.responsive = false;
            if (params.exportFileName == undefined) params.exportFileName = 'Pdf_Export';
            if (params.stateSave == undefined) params.stateSave = false;
            if (params.fixedHeader == undefined) params.fixedHeader = true;
            if (params.showSearch == undefined) params.showSearch = true;
            if (params.showPagingSize == undefined) params.showPagingSize = true;
            if (params.showTableInfo == undefined) params.showTableInfo = true;

            // Fixed header icin hesaplar
            var fixedHeaderOffset = 0;
            if (App.getViewPort().width < App.getResponsiveBreakpoint('md')) {
                if ($('.page-header').hasClass('page-header-fixed-mobile')) {
                    fixedHeaderOffset = $('.page-header').outerHeight(true);
                }
            } else if ($('.page-header').hasClass('navbar-fixed-top')) {
                fixedHeaderOffset = $('.page-header').outerHeight(true);
            }

            // Sigmaya ozel sutun tipleri
            var hasCheckableColumn = false;
            var exportColumns = [];
            params.columns.forEach(function (column, index) {
                // sgType
                /*============================================================================================*/
                if (column.sgType == undefined) {

                }
                else if (column.sgType == "checkable") {
                    hasCheckableColumn = true;
                    column.title = '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkboxes_' + index + '\"><span></span></label>';
                    column.searchable = false;
                    column.orderable = false;

                    if (params.columnDefs == undefined) params.columnDefs = [];
                    params.columnDefs.push({
                        'targets': index,
                        'searchable': false,
                        orderable: false,
                        'render': function (data, type, full, meta) {
                            return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkboxes_' + index + '\"><span></span></label>';
                        }
                    });
                }
                else if (column.sgType == "selectable") {
                    column.title = "";
                    column.searchable = false;
                    column.orderable = false;

                    if (params.columnDefs == undefined) params.columnDefs = [];
                    params.columnDefs.push({
                        targets: index,
                        defaultContent: "<button type=\"button\" class=\"btn blue-madison btn-sm btnRowSelect\"><i class='fa fa-download' aria-hidden='true'></i></button>"
                    });

                    // selectable sutunlar select oldugunu yakalamak. 
                    $(params.tableName).on('click', 'button.btnRowSelect', function () {
                        var d = table.row($(this).parents('tr')).data();
                        if (column.onSelected != undefined) {
                            column.onSelected(d);
                        }
                    });
                }
                else if (column.sgType == "date") {
                    column.type = 'date';
                    column.render = $.fn.dataTable.render.date();
                }
                else if (column.sgType == "time") {
                    column.type = 'time';
                    column.render = $.fn.dataTable.render.time();
                }
                else if (column.sgType == "time4") {
                    column.type = 'time4';
                    column.render = $.fn.dataTable.render.time4();
                }
                else if (column.sgType == "datetime") {
                    column.type = 'datetime';
                    column.render = $.fn.dataTable.render.datetime();
                }
                else if (column.sgType == "datetime-relative") {
                    column.type = 'datetime-relative';

                    column.class = "text-center";
                    if (params.columnDefs == undefined) params.columnDefs = [];
                    params.columnDefs.push({
                        'targets': index,
                        'searchable': false,
                        orderable: false,
                        'render': function (data, type, full, meta) {
                            return moment(new Date(data)).fromNow();
                        }
                    });
                }
                else if (column.sgType == "boolean") {
                    column.class = "text-center";
                    if (params.columnDefs == undefined) params.columnDefs = [];
                    params.columnDefs.push({
                        'targets': index,
                        'searchable': false,
                        orderable: false,
                        'render': function (data, type, full, meta) {
                            if (data == true || data == "true") {
                                return '<i class="fa fa-lg fa-check font-green-seagreen" aria-hidden="true"></i>';
                            }
                            else {
                                return '<i class="fa fa-lg fa-times font-red-soft" aria-hidden="true"></i>';
                            }
                        }
                    });
                }
                else if (column.sgType == "money") {
                    if (params.columnDefs == undefined) params.columnDefs = [];
                    params.columnDefs.push({
                        targets: index,
                        render: function (data, type, full, meta) {
                            return Sigma.getMoney(data, 0, 3, '.', ',')
                        }
                    });
                }
                else if (column.sgType == "money2") {
                    if (params.columnDefs == undefined) params.columnDefs = [];
                    params.columnDefs.push({
                        targets: index,
                        render: function (data, type, full, meta) {
                            return Sigma.getMoney(data, 2, 3, '.', ',')
                        }
                    });
                }
                else if (column.sgType == "money6") {
                    if (params.columnDefs == undefined) params.columnDefs = [];
                    params.columnDefs.push({
                        targets: index,
                        render: function (data, type, full, meta) {
                            return Sigma.getMoney(data, 6, 3, '.', ',')
                        }
                    });
                }
                /*============================================================================================*/

                // lookup
                /*============================================================================================*/
                if (column.sgLookup != undefined) {
                    if (Object.prototype.toString.call(column.sgLookup) == '[object String]') {
                        column.sgLookupData = Sigma.ajaxGetData(column.sgLookup);
                    }
                    else {
                        column.sgLookupData = column.sgLookup;
                    }

                    if (params.columnDefs == undefined) params.columnDefs = [];
                    params.columnDefs.push({
                        targets: index,
                        render: function (data, type, full, meta) {
                            //return data;
                            return Sigma.lookup(column.sgLookupData, data);
                        }
                    });
                }
                /*============================================================================================*/

                // printing
                /*============================================================================================*/
                if (!(column.visible == false || column.title == "")) {
                    exportColumns.push(index);
                }
                /*============================================================================================*/
            });

            // table-checkable sinifi yoksa checkboxlar ortalanmiyor.
            if (hasCheckableColumn) {
                if ($(params.tableName).hasClass("table-checkable") == false)
                    $(params.tableName).addClass("table-checkable");
            }

            var buttons = [];
            if (params.showButtons) {
                buttons.push({ extend: 'print', className: 'btn btn-xs blue-hoki btn-outline margin-left', text: '<i class="fa fa-print"></i>', titleAttr: 'Print', exportOptions: { columns: exportColumns } });
                buttons.push({ extend: 'copy', className: 'btn btn-xs blue-hoki btn-outline', text: '<i class="fa fa-files-o"></i>', titleAttr: 'Copy', exportOptions: { columns: exportColumns } });
                buttons.push({ extend: 'pdf', className: 'btn btn-xs blue-hoki btn-outline', text: '<i class="fa fa-file-pdf-o"></i>', titleAttr: 'Pdf', title: params.exportFileName, download: 'open', exportOptions: { columns: exportColumns } });
                if (Sigma.isSafari() == false)
                    buttons.push({ extend: 'excel', className: 'btn btn-xs blue-hoki btn-outline', text: '<i class="fa fa-file-excel-o"></i>', titleAttr: 'Excel', title: params.exportFileName, exportOptions: { columns: exportColumns } });
                buttons.push({ extend: 'colvis', className: 'btn btn-xs blue-hoki btn-outline', text: '<i class="fa fa-eye"></i>', titleAttr: 'Alanlar', columns: exportColumns, });
            }

            $(params.tableName).wrap("<form></form>");
            var table = $(params.tableName).DataTable({
                columns: params.columns,
                columnDefs: params.columnDefs,
                responsive: params.responsive,
                language: {
                    aria: {
                        "sortAscending": ": activate to sort column ascending",
                        "sortDescending": ": activate to sort column descending"
                    },
                    emptyTable: "Gösterilecek kayıt yok",
                    info: "Toplam _TOTAL_ kaydın _START_-_END_ kısmı gösteriliyor",
                    infoEmpty: "Hiç kayıt bulunamadı",
                    infoFiltered: "(filtered1 from _MAX_ total records)",
                    lengthMenu: "_MENU_ &nbsp;kayıt",
                    search: "Ara: ",
                    zeroRecords: "Hiç kayıt bulunamadı",
                    paginate: {
                        previous: "Önceki",
                        next: "Sonraki",
                        last: "Son",
                        first: "İlk"
                    },
                    buttons: {
                        copyTitle: 'Panoya kopyalandı',
                        copySuccess: '%d kayıt kopyalandı'
                    }
                },
                bStateSave: params.stateSave, // save datatable state(pagination, sort, etc) in cookie.
                colReorder: true,

                lengthMenu: [
                    [10, 25, 50, -1],
                    [10, 25, 50, "Tümü"] // change per page values here
                ],
                pageLength: (hasCheckableColumn || params.showPagingSize == false ? -1 : 10),

                fixedHeader: {
                    header: !hasCheckableColumn && params.fixedHeader,
                    headerOffset: fixedHeaderOffset
                },
                order: [],
                buttons: buttons,
                "dom": (hasCheckableColumn ? "" : "<'pull-left'" + (params.showPagingSize ? "l" : "") + ">") + "r <'pull-right'<'pull-left'" + (params.showSearch ? "f" : "") + ">" + (params.showButtons ? "<'pull-right'B>" : "") + ">" +
                       "<'table-scrollable't>" +
                       "<'pull-left'" + (params.showTableInfo ? "i" : "") + "><'pull-right'p>",
            });
            table.params = params; // Bu parametrelere daha sonra erisim ihtiyaci oldugu icin buraya ekliyoruz direk. 

            // checkable sutunlar icin header degisimini yakalamak
            table.on('change', 'thead th input[class^="checkboxes_"]', function () {

                var value = $(this).is(":checked");
                if (value) {
                    $(this).parents('span').addClass("checked");
                }
                else {
                    $(this).parents('span').removeClass("checked");
                }

                var className = $(this).attr('class');
                $(params.tableName + ' tbody tr input.' + className).each(function (index) {
                    $(this).prop("checked", value).change();
                });
            });

            // checkable sutunlar icin checkboxlarin classlarini ayarlamak
            table.on('change', 'tbody tr input[class^="checkboxes_"]', function () {
                var value = $(this).is(":checked");
                if (value) {
                    $(this).parents('tr').addClass("active");
                    $(this).parents('span').addClass("checked");
                }
                else {
                    $(this).parents('tr').removeClass("active");
                    $(this).parents('span').removeClass("checked");
                }
            });

            if (params.editable) {
                $('body').on('click', params.tableName + ' tr .row-edit', function (e) {
                    if (params.editable.multiple != true) {
                        var x = $('.row-update, .row-save', params.tableName).filter(function () {
                            return this.style.display != 'none' && this.style.display != '';
                        });

                        if (x.length > 0) {
                            Sigma.toastError("Lütfen öncelikle mevcut düzenlemeyi bitirin!");
                            return;
                        }
                    }

                    var tr = $(this).parents('tr');
                    $('.row-edit', tr).hide();
                    $('.row-delete', tr).hide();

                    var rowData = table.row(tr).data();
                    Sigma.viewEditableRow(table, rowData, tr);
                    $('.row-update', tr).delay(200).fadeIn(400);
                    $('.row-cancel', tr).delay(200).fadeIn(400);
                    $('.row-save', tr).hide();

                    //table.draw();
                });

                $('body').on('click', params.tableName + ' tr .row-update', function (e) {
                    var tr = $(this).parents('tr');
                    var rowData = table.row(tr).data();
                    var newData = Sigma.getEditableRowObj(table, tr, rowData);
                    if (!newData) return;

                    if (!params.editable.onUpdate) {
                        closeEditingOk(table, tr, newData);
                    }
                    else if ($.isFunction(params.editable.onUpdate)) {
                        var result = params.editable.onUpdate(newData);
                        if (result != false) {
                            closeEditingOk(table, tr, newData);
                        }
                    }
                    else if ($.type(params.editable.onUpdate) === "string") {
                        Sigma.ajax({
                            url: params.editable.onUpdate,
                            data: newData,
                            onSuccess: function (data) {
                                if (data)
                                    newData = JSON.parse(data);

                                closeEditingOk(table, tr, newData);
                            },
                            showSuccessToast: true,
                            showErrorToast: true
                        });
                    }
                });

                $('body').on('click', params.tableName + ' tr .row-save', function (e) {
                    var tr = $(this).parents('tr');
                    var rowData = table.row(tr).data();

                    var newData = Sigma.getEditableRowObj(table, tr, rowData);
                    if (!newData) return;
                    if (!params.editable.onSave) {
                        closeEditingOk(table, tr, newData);
                    }
                    else if ($.isFunction(params.editable.onSave)) {
                        var result = params.editable.onSave(newData);
                        if (result != false) {
                            closeEditingOk(table, tr, newData);
                        }
                    }
                    else if ($.type(params.editable.onSave) === "string") {
                        Sigma.ajax({
                            url: params.editable.onSave,
                            data: newData,
                            onSuccess: function (data) {
                                if (data)
                                    newData = JSON.parse(data);

                                closeEditingOk(table, tr, newData);
                            },
                            showSuccessToast: true,
                            showErrorToast: true
                        });
                    }
                    else {
                        closeEditingOk(table, tr, newData);
                    }
                });

                function closeEditingOk(table, tr, data) {
                    $(tr).removeClass('bg-grey-salt');

                    table.row(tr).data(data).draw();
                    $('.row-edit', tr).show();
                    $('.row-update', tr).hide();
                    $('.row-cancel', tr).hide();
                    $('.row-delete', tr).show();
                    $('.row-save', tr).hide();
                }

                $('body').on('click', params.tableName + ' tr .row-delete', function (e) {
                    var tr = $(this).parents('tr');
                    var rowData = table.row(tr).data();

                    //tableFrmPrvFld.row($(this).parents('tr')).remove().draw();
                    if (!params.editable.onDelete) {
                        table.row(tr).remove().draw();
                    }
                    else if ($.isFunction(params.editable.onDelete)) {
                        var result = params.editable.onDelete(rowData);
                        if (result != false) {
                            table.row(tr).remove().draw();
                        }
                    }
                    if ($.type(params.editable.onDelete) === "string") {
                        Sigma.dialogConfirm({
                            message: 'Kaydı silmek istediğinize emin misiniz?',
                            onConfirm: function () {
                                Sigma.ajax({
                                    url: params.editable.onDelete,
                                    data: rowData,
                                    onSuccess: function () {
                                        table.row(tr).remove().draw();
                                    },
                                    showSuccessToast: true,
                                    showErrorToast: true
                                });
                            }
                        });
                    }
                });

                $('body').on('click', params.tableName + ' tr .row-cancel', function (e) {
                    var tr = $(this).parents('tr');
                    $(tr).removeClass('bg-grey-salt');

                    if ($(this).hasClass("tooltips")) {
                        $(this).mouseout();
                    }

                    if ($('.row-update', tr).css("display") != "none") {
                        var rowData = table.row(tr).data();
                        table.row(tr).data(rowData).draw();
                        $('.row-edit', tr).show();
                        $('.row-update', tr).hide();
                        $('.row-cancel', tr).hide();
                        $('.row-delete', tr).show();
                        $('.row-save', tr).hide();
                    }
                    else {
                        table.row(tr).remove().draw();
                    }
                });
            }


            return table;
        },

        onDTRowSelected: function (tableName, rowSelected) {
            var table = $(tableName).DataTable();

            $(tableName + ' tbody').on('click', 'tr', function () {
                var d = table.row(this).data();
                if (rowSelected != undefined && d != undefined)
                    rowSelected(d);
                else
                    return;

                if ($(this).hasClass('selected')) {
                    return; // Selection degismedi
                }
                else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        },

        getCheckedRows: function (table, columnName, columnIndex) {
            table.search('').columns().search('').draw();

            if (columnIndex == undefined) columnIndex = 0;

            resultRows = [];
            table.$('tr').each(function (index) {
                var checkBox = $(this).find('input.checkboxes_' + columnIndex)[0];
                if ($(checkBox).is(":checked")) {
                    var d = table.row(this).data();

                    if (columnName == undefined)
                        resultRows.push(d);
                    else
                        resultRows.push(d[columnName]);
                }
            });

            return resultRows;
        },

        clearCheckedRows: function (table, columnIndex) {
            table.search('').columns().search('').draw();

            if (columnIndex == undefined) columnIndex = 0;

            var headCheck = $(table.header()).find('th input.checkboxes_' + columnIndex);
            $(headCheck).attr("checked", false).change();
        },

        getSelectedRow: function (table, _event) {
            //responsive class var mı yok mu kontrol edelim
            var isResponsiveScreenOpened = $(_event).parents('tr').hasClass("child");

            var obj = null;

            if (isResponsiveScreenOpened)
                obj = table.row($(_event).parents('tr').prev()).data();
            else
                obj = table.row($(_event).parents('tr')).data();

            return obj;
        },

        setCheckedRows: function (table, rows, columnName, columnIndex) {
            table.search('').columns().search('').draw();

            if (columnIndex == undefined) columnIndex = 0;

            table.$('tr').each(function (index) {
                var checkBox = $(this).find('input.checkboxes_' + columnIndex)[0];
                var d = table.row(this).data();
                if (jQuery.inArray(d[columnName], rows) != -1) {
                    $(checkBox).prop("checked", true).change();
                }
            });
        },

        addNewRow: function (table, data) {
            if (table.params.editable.multiple != true) {
                var x = $('.row-update, .row-save', table.params.tableName).filter(function () {
                    return this.style.display != 'none' && this.style.display != '';
                });

                if (x.length > 0) {
                    Sigma.toastError("Lütfen öncelikle mevcut düzenlemeyi bitirin!");
                    return;
                }
            }

            if (!data)
                data = {};

            var columns = $.grep(table.params.columns, function (e) { return e.mData });
            for (i = 0; i < columns.length; i++) {
                if (!data[columns[i].mData]) {
                    if (!columns[i].sgType) {
                        data[columns[i].mData] = "";
                    }
                    else if (columns[i].sgType == "checkable" || columns[i].sgType == "boolean") {
                        data[columns[i].mData] = false;
                    }
                    else if (columns[i].sgType == "date" || columns[i].sgType == "time" || columns[i].sgType == "time4"
                        || columns[i].sgType == "datetime" || columns[i].sgType == "datetime-relative") {
                        data[columns[i].mData] = moment();
                    }
                    else if (columns[i].sgType == "money" || columns[i].sgType == "money2" || columns[i].sgType == "money6") {
                        data[columns[i].mData] = 0;
                    }
                }
            }

            var r = table.row.add(data).draw();
            var tr = r.node();

            Sigma.viewEditableRow(table, data, tr);

            table.page('last').draw(false);

            $('.row-edit', tr).hide();
            $('.row-update', tr).hide();
            $('.row-cancel', tr).delay(200).fadeIn(400);
            $('.row-delete', tr).hide();
            $('.row-save', tr).delay(200).fadeIn(400);
        },

        viewEditableRow: function (table, data, tr) {
            $(tr).addClass('bg-grey-salt', 400);

            var columns = $.grep(table.params.columns, function (e) { return e.visible != false });
            for (i = 0; i < columns.length; i++) {
                var columnData = columns[i];
                if (!(columnData.mData && columnData.sgEditable != false))
                    continue;

                var td = $('td:eq(' + i + ')', tr);

                if (table.params.editable.fields && table.params.editable.fields[columnData.mData] && table.params.editable.fields[columnData.mData].html) {
                    td[0].html = table.params.editable.fields[columnData.mData].html;
                    td[0].onControlCreated = table.params.editable.fields[columnData.mData].onControlCreated;
                    td.fadeOut(200, function () {
                        $(this).html(this.html);
                        $(this).fadeIn(200);
                        if (this.onControlCreated) {
                            this.onControlCreated(this);
                        }
                    });
                }
                else if (columnData.sgLookup) {
                    var select = '<select name="' + columnData.mData + '" class="form-control select2">';

                    select += '<option></option>';
                    $.each(columnData.sgLookupData, function (key) {
                        select += '<option value="' + key + '">' + columnData.sgLookupData[key] + '</option>';
                    });

                    select += '</select>';
                    select = '<div class="form-group" style="margin-bottom:0px;">' + select + '</div>';

                    td[0].select = select;
                    td[0].initVal = data[columnData.mData];
                    
                    if (table.params.editable.fields && table.params.editable.fields[columnData.mData]) {
                        td[0].onControlCreated = table.params.editable.fields[columnData.mData].onControlCreated;
                        td[0].changed = table.params.editable.fields[columnData.mData].onChange;
                    }
                    td.fadeOut(200, function () {
                        $(this).html(this.select);
                        $(this).fadeIn(200);
                        select = Sigma.createSelect2({ id: $('select.select2', $(this)), width: '100%' });
                        select.val(this.initVal).trigger("change");

                        if (this.changed) {
                            var changedFunc = this.changed;
                            select.change(function () {
                                changedFunc($(this).val());
                            });
                        }

                        $('.select2-selection--single', $(this)).css("padding", '6px 17px 6px 6px');
                        if (this.onControlCreated) {
                            this.onControlCreated(this);
                        }
                    });
                }
                else {
                    if (columnData.sgType == "boolean") {
                        var checkBox;
                        if (data[columnData.mData] == true || data[columnData.mData] == "true")
                            checkBox = '<input type="checkbox" class="form-control" checked>';
                        else
                            checkBox = '<input type="checkbox" class="form-control">';

                        checkBox = '<div class="form-group" style="margin-bottom:0px;">' +
                                        '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
                                            checkBox +
                                            '<span style="background-color:white;"></span>' +
                                        '</label>' +
                                    '</div>';

                        td[0].checkBox = checkBox;                        
                        if (table.params.editable.fields && table.params.editable.fields[columnData.mData]) {
                            td[0].changed = table.params.editable.fields[columnData.mData].onChange;
                            td[0].onControlCreated = table.params.editable.fields[columnData.mData].onControlCreated;
                        }
                        td.fadeOut(200, function () {
                            $(this).html(this.checkBox).fadeIn(200);

                            if (this.changed) {
                                var changedFunc = this.changed;
                                $('input[type="checkbox"]', $(this)).on('change', function () {
                                    changedFunc($(this).is(":checked"));
                                });
                            }
                            if (this.onControlCreated) {
                                this.onControlCreated(this);
                            }
                        });
                    }
                    else if (columnData.sgType == "date") {
                        td[0].datePicker = '<div class="form-group" style="margin-bottom:0px;">' +
                                                '<div class="input-group date date-picker">' +
                                                    '<input type="text" class="form-control bg-white" readonly name="' + columnData.mData + '">' +
                                                    '<span class="input-group-btn">' +
                                                        '<button class="btn default" type="button">' +
                                                            '<i class="fa fa-calendar"></i>' +
                                                        '</button>' +
                                                    '</span>' +
                                                '</div>' +
                                            '</div>';


                        td[0].initVal = data[columnData.mData];
                        if (table.params.editable.fields && table.params.editable.fields[columnData.mData]) {
                            td[0].changed = table.params.editable.fields[columnData.mData].onChange;
                            td[0].onControlCreated = table.params.editable.fields[columnData.mData].onControlCreated;
                        }
                        td.fadeOut(200, function () {
                            $(this).html(this.datePicker).fadeIn(200);
                            var changedFunc = this.changed;
                            $('.date-picker', $(this)).datepicker({
                                rtl: App.isRTL(),
                                orientation: "left",
                                language: "tr",
                                autoclose: true,
                                todayBtn: 'linked',
                                clearBtn: true,
                            }).datepicker('setDate', new Date(this.initVal));

                            if (changedFunc) {
                                $('.date-picker', $(this)).datepicker().on('changeDate', function (ev) {
                                    changedFunc($(this).data("datepicker").getDate());
                                });
                            }
                            if (this.onControlCreated) {
                                this.onControlCreated(this);
                            }
                        });
                    }
                    else if (columnData.sgType == "datetime") {
                        td[0].dateTimePicker = '<div class="form-group" style="margin-bottom:0px;">' +
                                                '<div class="input-group date datetime-picker">' +
                                                    '<input name="' + columnData.mData + '" type="text" readonly class="form-control bg-white">' +
                                                    '<span class="input-group-btn">' +
                                                        '<button class="btn default date-set" type="button">' +
                                                            '<i class="fa fa-calendar"></i>' +
                                                        '</button>' +
                                                    '</span>' +
                                                '</div>' +
                                            '</div>';


                        td[0].initVal = data[columnData.mData];
                        if (table.params.editable.fields && table.params.editable.fields[columnData.mData]) {
                            td[0].changed = table.params.editable.fields[columnData.mData].onChange;
                            td[0].onControlCreated = table.params.editable.fields[columnData.mData].onControlCreated;
                        }
                        td.fadeOut(200, function () {
                            $(this).html(this.dateTimePicker).fadeIn(200);
                            var changedFunc = this.changed;
                            $('.datetime-picker', $(this)).datetimepicker({
                                rtl: App.isRTL(),
                                orientation: "left",
                                language: "tr",
                                autoclose: true,
                                todayBtn: true,
                                clearBtn: true,
                                pickerPosition: "bottom-left",
                                format: "dd.mm.yyyy - hh:ii",
                                minuteStep: 5,
                                todayHighlight: true,
                            }).datetimepicker('setDate', new Date(this.initVal));

                            if (changedFunc) {
                                $('.datetime-picker', $(this)).datetimepicker().on('changeDate', function (ev) {
                                    changedFunc($(this).data("datetimepicker").getDate());
                                });
                            }
                            if (this.onControlCreated) {
                                this.onControlCreated(this);
                            }
                        });
                    }
                    else {
                        // Fadeoutlar dogrudan degil 200ms sonra devreye girdigi icin fade outun icine butun degiskenleri td uzerinde tasiyoruz. 
                        td[0].textBox = '<div class="form-group" style="margin-bottom:0px;">' +
                                          '<div class="input-icon right">' +
                                              '<i class="fa"></i>';
                        if (table.params.editable.fields && table.params.editable.fields[columnData.mData] && table.params.editable.fields[columnData.mData].type == "number") {
                            td[0].textBox += '<input type="text" name="' + columnData.mData + '" class="form-control" value="' + data[columnData.mData] + '" onkeypress="return event.charCode >= 48 && event.charCode <= 57">';
                        }
                        else {
                            td[0].textBox += '<input type="text" name="' + columnData.mData + '" class="form-control" value="' + data[columnData.mData] + '">';
                        }
                        td[0].textBox += '</div></div>';

                        if (table.params.editable.fields && table.params.editable.fields[columnData.mData]) {
                            td[0].changed = table.params.editable.fields[columnData.mData].onChange;
                            td[0].onControlCreated = table.params.editable.fields[columnData.mData].onControlCreated;
                        }

                        td.fadeOut(200, function () {
                            $(this).html(this.textBox).fadeIn(200);
                            if (this.changed) {
                                var changedFunc = this.changed;
                                $('input', $(this)).on("change paste keyup", function () {
                                    changedFunc($(this).val());
                                });
                            }
                            if (this.onControlCreated) {
                                this.onControlCreated(this);
                            }
                        });
                    }
                }
            }
        },

        getEditableRowObj: function (table, tr, currentObj) {
            if (!currentObj)
                currentObj = {};

            var columns = $.grep(table.params.columns, function (e) { return e.visible != false && e.mData && e.sgEditable != false });
            for (i = 0; i < columns.length; i++) {
                var columnData = columns[i];
                var td = $('td:eq(' + i + ')', tr);

                if (columnData.sgLookup) {
                    currentObj[columnData.mData] = $('select', td).val();
                }
                else {
                    if (columnData.sgType == "boolean") {
                        currentObj[columnData.mData] = $('input', td).is(":checked").toString();
                    }
                    else if (columnData.sgType == "date") {
                        currentObj[columnData.mData] = $('.date-picker', td).data("datepicker").getDate();
                    }
                    else if (columnData.sgType == "datetime") {
                        currentObj[columnData.mData] = $('.datetime-picker', td).data("datetimepicker").getDate();
                    }
                    else {
                        currentObj[columnData.mData] = $('input', td).val();
                    }
                }
            }

            if (table.params.editable.validate) {
                var form = $(table.params.tableName).parents("form:first");

                $('tr input, tr select', $(table.params.tableName)).addClass('ignore-validation');
                $('input, select', tr).removeClass('ignore-validation');

                Sigma.validate({
                    formName: form,
                    ignore: '.ignore-validation',
                    rules: table.params.editable.validate.rules,
                    messages: table.params.editable.validate.messages,
                });

                if (form.valid() == false) {
                    Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
                    return undefined;
                }
            }

            return currentObj;
        },

        /*============================================================================================*/

        /*============================================================================================*/
        // DateRangePickers Methods
        /*============================================================================================*/

        createDateRangePicker: function (params) {
            if (params.startDate == undefined) params.startDate = moment().subtract('days', 6).startOf('day');
            if (params.endDate == undefined) params.endDate = moment().endOf('day');
            if (params.dayLimit == undefined) params.dayLimit = 365;
            if (params.timePicker == undefined) params.timePicker = false;

            var obj = $(params.id);

            obj.daterangepicker({
                startDate: params.startDate,
                endDate: params.endDate,
                minDate: params.minDate,
                maxDate: params.maxDate,
                timePicker: params.timePicker,
                timePicker24Hour: true,
                timePickerSeconds: true,
                dateLimit: {
                    days: params.dayLimit
                },
                ranges: {
                    'Bugün': [moment().startOf('day'), moment().endOf('day')],
                    'Dün': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                    'Son 7 gün': [moment().subtract('days', 6).startOf('day'), moment().endOf('day')],
                    'Son 30 gün': [moment().subtract('days', 29).startOf('day'), moment().endOf('day')],
                    'Bu ay': [moment().startOf('month').startOf('day'), moment().endOf('month').endOf('day')],
                    'Geçen ay': [moment().subtract('month', 1).startOf('month').startOf('day'), moment().subtract('month', 1).endOf('month').endOf('day')]
                },
                buttonClasses: ['btn'],
                applyClass: 'green',
                cancelClass: 'default',

                separator: ' arası ',
                locale: {
                    format: 'DD.MM.YYYY HH:mm:ss',
                    applyLabel: 'Uygula',
                    cancelLabel: 'İptal',
                    fromLabel: 'From',
                    toLabel: 'To',
                    customRangeLabel: 'Özel Tarih',
                    daysOfWeek: ['Pz', 'Pzt', 'Sl', 'Çr', 'Pr', 'Cm', 'Cmt'],
                    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                    firstDay: 1
                }
            },
            function (start, end) {
                if (params.timePicker == true)
                    obj.find('span').html(start.format('DD.MM.YYYY HH:mm:ss') + '  -  ' + end.format('DD.MM.YYYY HH:mm:ss'));
                else
                    obj.find('span').html(start.format('DD.MM.YYYY') + '  -  ' + end.format('DD.MM.YYYY'));
            });

            //Set the initial state of the picker label
            if (params.timePicker == true)
                obj.find('span').html(params.startDate.format('DD.MM.YYYY HH:mm:ss') + ' - ' + params.endDate.format('DD.MM.YYYY HH:mm:ss'));
            else
                obj.find('span').html(params.startDate.format('DD.MM.YYYY') + ' - ' + params.endDate.format('DD.MM.YYYY'));

        },

        getDateRangePickerStartDate: function (id) {
            return new Date($(id).data('daterangepicker').startDate);
        },

        getDateRangePickerEndDate: function (id) {
            return new Date($(id).data('daterangepicker').endDate);
        },

        /*============================================================================================*/


        /*============================================================================================*/
        // Select2 Methods
        /*============================================================================================*/

        createSelect2: function (params) {
            if (params.width == undefined) params.width = null;
            if (params.allowClear == undefined) params.allowClear = true;
            if (params.templateResult == undefined) params.templateResult = undefined;
            if (params.templateSelection == undefined) params.templateSelection = undefined;
            if (params.escapeMarkup == undefined) params.escapeMarkup = undefined;
            if (params.width == undefined) params.width = null;

            var obj = params.id
            if ($.type(obj) === "string") {
                obj = $(obj);
            }

            var result = obj.select2({
                width: params.width,
                allowClear: true,
                placeholder: obj.attr("data-placeholder") == undefined ? "" : obj.attr("data-placeholder"),
                templateResult: params.templateResult,
                templateSelection: params.templateSelection,
                escapeMarkup: params.escapeMarkup,
                matcher: function modelMatcher(params, data) {
                    data.parentText = data.parentText || "";

                    if ($.trim(params.term) === '') {
                        return data;
                    }

                    if (data.children && data.children.length > 0) {
                        var match = $.extend(true, {}, data);

                        for (var c = data.children.length - 1; c >= 0; c--) {
                            var child = data.children[c];
                            child.parentText += data.parentText + " " + data.text;

                            var matches = modelMatcher(params, child);

                            if (matches == null) {
                                match.children.splice(c, 1);
                            }
                        }

                        if (match.children.length > 0) {
                            return match;
                        }

                        return modelMatcher(params, match);
                    }

                    var original = (data.parentText + ' ' + data.text).toUpperCase();
                    var term = params.term.toUpperCase();

                    if (original.indexOf(term) > -1) {
                        return data;
                    }
                    return null;
                }
            });

            return result;

        },



        /*============================================================================================*/


        /*============================================================================================*/
        // Data Methods
        /*============================================================================================*/
        lookup: function (lookupData, key) {
            if (lookupData == undefined) {
                return undefined;
            }

            if (key == undefined) {
                return "";
            }
            else {
                var result = new Array();
                key = [].concat(key);
                key.forEach(function (entry) {
                    if (lookupData[entry] != undefined) {
                        result.push(lookupData[entry]);
                    }
                    else {
                        result.push(entry);
                    }
                });

                return result.join(", ");
            }
        },

        arrayToDic: function (array, keyName) {
            var dic = {}
            array.forEach(function (item) {
                if (!dic[item[keyName]])
                    dic[item[keyName]] = item;
            });

            return dic;
        },

        getDate: function (yyyymmddhhmmssfff) {
            var str = yyyymmddhhmmssfff.toString();
            return str.substring(6, 8) + "." +
                   str.substring(4, 6) + "." +
                   str.substring(0, 4);
        },

        removeAllBlankOrNull: function (JsonObj) {
            $.each(JsonObj, function (key, value) {
                if (value === "" || value === null) {
                    delete JsonObj[key];
                } else if (typeof (value) === "object") {
                    JsonObj[key] = Sigma.removeAllBlankOrNull(value);
                }
            });
            return JsonObj;
        },
        getMoney: function (val, n, x, s, c) {
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
                 num = parseFloat(val).toFixed(Math.max(0, ~~n));

            return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
        },
        /*============================================================================================*/

        /*============================================================================================*/
        // MultiLang Methods
        /*============================================================================================*/

        initMultilangs: function () {
            $.fn.select2.amd.require(['select2/data/array', 'select2/utils'], function (ArrayData, Utils) {
                function CustomData($element, options) {
                    CustomData.__super__.constructor.call(this, $element, options);
                }

                Utils.Extend(CustomData, ArrayData);

                // Burasi secileni ajaxtan getirmek icin.
                CustomData.prototype.current = function (callback) {
                    var elm = this.$element;
                    var currentVal = Sigma.getSgMultilangSelectVal(this.$element);
                    console.log('change event value: ' + currentVal);

                    if (currentVal == undefined || currentVal == "") {
                        callback([{ id: "", text: "" }]);
                    }
                    else {
                        Sigma.ajax({
                            url: "/Base/FrmLngTxt/GetLangText",
                            data: { txtKey: currentVal },
                            async: false,
                            onSuccess: function (data) {
                                if (data == "\"\"") {
                                    $('option[value="' + currentVal + '"]', elm).remove();
                                }
                                callback([JSON.parse(data)]);
                            },
                            showSuccessToast: false,
                            showErrorToast: true
                        });
                    }
                };

                // Burasi search icin
                CustomData.prototype.query = function (params, callback) {
                    console.log('query', params);
                    if (params.term == undefined || params.term == "") {
                        callback({ results: [] });
                        return;
                    }

                    Sigma.ajax({
                        url: "../../Base/FrmLngTxt/SearchLangText",
                        data: { term: params.term },
                        //async: false,
                        onSuccess: function (data) { callback({ results: JSON.parse(data) }); },
                        showSuccessToast: false,
                        showErrorToast: true
                    });
                };

                $("select.sg-multilang").select2({
                    minimumInputLength: 1,
                    placeholder: "Merhaba",
                    //allowClear: true,
                    templateResult: Sigma.translationTextFormat,
                    templateSelection: Sigma.translationTextSelection,
                    dropdownCssClass: "bigdrop",
                    escapeMarkup: function (m) { return m; },
                    dataAdapter: CustomData
                }).on("select2:open", function () {
                    var select = $(this);

                    if (select.hasClass('sg-multilang') && select.hasClass('sg-multilang-initialized') == false) {
                        $(".select2-dropdown .select2-results ul[id=select2-" + select.attr('id') + "-results").each(function (index, element) {
                            $(Sigma.getFormText()).insertAfter($(element).parent())
                                    .on('mousedown mouseup click', function (e) {
                                        var input = $(this).parents('div.select2-drop:first').find('input[id^="s2id_autogen"]');
                                        input.prop("disabled", true);
                                        input.css('cursor', 'text');
                                    }).on('focusout', function (e) {
                                        var input = $(this).parents('div.select2-drop:first').find('input[id^="s2id_autogen"]');
                                        input.prop("disabled", false);
                                    });
                            $(element).parent().next().next().find('form').attr('selectId', select.attr('id'));
                        });

                        select.addClass('sg-multilang-initialized');
                    }

                    var form = $(".select2-dropdown .select2-results").next().next().find('form');

                    var value = Sigma.getSgMultilangSelectVal(select);
                    if (value) {
                        form.find('button.sg-multilang-save').hide();
                        form.find('button.sg-multilang-update').show();
                        form.find('#TxtKey').prop("disabled", true);

                        $.ajax("../../Base/FrmLngTxt/GetLangText", {
                            data: { txtKey: value },
                            dataType: "json"
                        }).done(function (data) {
                            form.find('#TxtKey').val(value);
                            form.find("input[id^='trn']").each(function (index) {
                                var lngKey = $(this).attr('lngKey');

                                var item = $.grep(data.trnLst, function (e) { return e.LngKey == lngKey; });
                                $(this).val(item[0].Translation);
                            });
                        });

                        form.parent().parent().prev('button').text('Çeviriyi Güncelle');
                        form.parent().parent().slideDown();
                    }
                    else {
                        form.find('button.sg-multilang-save').show();
                        form.find('button.sg-multilang-update').hide();
                        form.find('#TxtKey').prop("disabled", false);

                        form.find('#TxtKey').val("");
                        form.find("input[id^='trn']").each(function (index) {
                            $(this).val("");
                        });

                        form.parent().parent().prev('button').text('Yeni Çeviri Ekle');
                    }
                });

            });
        },

        getSgMultilangSelectVal: function (element) {
            var currentVal = element.val();

            if (currentVal == undefined || currentVal == null) {
                currentVal = element.data("selectedValue");

                if (currentVal != null && currentVal.length > 0)
                    currentVal = currentVal[0];
            }

            if (currentVal == undefined || currentVal == null) {
                return undefined;
            }

            return currentVal;
        },

        setSgMultilangSelectVal: function (element, val) {
            console.log('setting selectedValue: ' + val);
            element.append('<option value="' + val + '">' + val + '</option>');
            element.data('selectedValue', [val]);

            console.log('setting val: ' + val);
            element.val(val).trigger("change");

            console.log('setting completed: ' + val);
        },

        translationTextFormat: function (text) {
            if (text.text == "Searching…" || text.id == undefined || text.id == "")
                return text.text;

            var element = '<div class="row" style="width:100%;">' +
                            '<div class="col-md-3 col-xs-3 col-sm-3">' + text.TxtKey + '</div>' +
                            '<div class="col-md-9 col-xs-9 col-sm-9">';

            $.each(text.trnLst, function (index, trn) {
                element += '<div class="pull-right" style="font-size:11px;"><b>' + trn.Language + '</b> : ' + trn.Translation + '</div> <br/>';
            });

            element += '</div>';
            return element;
        },

        translationTextSelection: function (text) {
            if (text == undefined || text.TxtKey == undefined || text.TxtKey == "") {
                return "";
            }

            var element = '<div class="row" style="width:99%;">' +
                            '<div class="col-md-3 col-xs-3 col-sm-3">' + text.TxtKey + '</div>' +
                            '<div class="col-md-9 col-xs-9 col-sm-9">';

            $.each(text.trnLst, function (index, trn) {
                element += '<div class="pull-right" style="font-size:11px;"><b>' + trn.Language + '</b> : ' + trn.Translation + '&nbsp;&nbsp;</div>';
            });

            element += '</div>';
            return element;
        },

        getFormText: function () {
            var addNewTranslationHtml =
                '<button class="btn btn-block btn-xs blue-madison" type="button" onClick="Sigma.addNewTranslationPortlet()">Yeni Çeviri Ekle</button>' +
                '<div class="portlet light bordered" hidden>' +
                    '<div class="portlet-body form">' +
                        '<form role="form">' +
                            '<div class="row">' +
                                '<div class="form-group">' +
                                    '<div class="input-icon right">' +
                                        '<i class="fa"></i>' +
                                        '<input type="text" class="form-control" id="TxtKey" name="TxtKey" placeholder="Text Key" maxlength="50">' +
                                    '</div>' +
                                '</div>';

            $.ajax("../../Base/FrmLng/GetFrmLngList", {
                dataType: "json",
                async: false
            }).done(function (data) {
                for (i = 0; i < data.length; i++) {
                    addNewTranslationHtml +=
                                '<div class="form-group">' +
                                    '<div class="input-icon right">' +
                                        '<i class="fa"></i>' +
                                        '<input type="text" class="form-control"  id="trn' + data[i].LngKey + '" name="trn' + data[i].LngKey + '" placeholder="' + data[i].LngName + '"lngKey=' + data[i].LngKey + '>' +
                                    '</div>' +
                                '</div>';
                }
            });

            addNewTranslationHtml +=
                                '<div class="form-group">' +
                                     '<button class="btn blue-madison pull-right sg-multilang-save" type="button" onClick="Sigma.addNewTranslation()"><i class="fa fa-floppy-o"></i> Kaydet</button>' +
                                     '<button class="btn blue-madison pull-right sg-multilang-update" type="button" onClick="Sigma.updateTranslation()"><i class="fa fa-refresh"></i> Güncelle</button>' +
                                '</div>' +
                            '</div>' +
                         '</form>' +
                     '</div>' +
                '</div>';

            return addNewTranslationHtml;
        },

        addNewTranslationPortlet: function () {
            $(event.target).next().slideToggle();
        },

        addNewTranslation: function () {
            var form = $(event.target).parents('form:first');

            var obj = new Object();
            obj.txt = new Object();
            obj.txt.TxtKey = form.find('#TxtKey').val();

            if (!obj.txt.TxtKey) {
                Sigma.toastWarning("Text Key'i girmelisiniz");
                return;
            }

            obj.trnLst = [];
            form.find(" input[id^='trn']").each(function (index) {
                obj.trnLst[index] = new Object();
                obj.trnLst[index].LngKey = $(this).attr('lngKey');
                obj.trnLst[index].Translation = $(this).val();
            });

            Sigma.ajax({
                url: "../../Base/FrmLngTxt/SaveFrmLngTxt",
                data: obj,
                onSuccess: function () {
                    var select = $('#' + form.attr('selectId'));
                    //select.val(obj.txt.TxtKey);
                    select.data('selectedValues', [obj.txt.TxtKey]).trigger('change');
                    select.select2("close");

                    Sigma.toastInfo('Yeni çeviri kaydedildi');
                }
            });
        },

        updateTranslation: function () {
            var form = $(event.target).parents('form:first');

            var obj = new Object();
            obj.txt = new Object();
            obj.txt.TxtKey = form.find('#TxtKey').val();

            obj.trnLst = [];
            form.find(" input[id^='trn']").each(function (index) {
                obj.trnLst[index] = new Object();
                obj.trnLst[index].LngKey = $(this).attr('lngKey');
                obj.trnLst[index].Translation = $(this).val();
            });

            Sigma.ajax({
                url: "../../Base/FrmLngTxt/UpdateFrmLngTxt",
                data: obj,
                onSuccess: function () {
                    var select = $('#' + form.attr('selectId'));
                    //select.val(obj.txt.TxtKey);
                    select.data('selectedValues', [obj.txt.TxtKey]).trigger('change');
                    select.select2("close");

                    Sigma.toastInfo('Çeviri güncellendi');
                }
            });
        },

        ToLocalDate: function (date) {
            var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            return newDate;
        },

        /*============================================================================================*/

        /*============================================================================================*/
        // Browser Utility Methods
        /*============================================================================================*/

        isSafari: function () {
            return navigator.userAgent.indexOf('Safari') !== -1 &&
                navigator.userAgent.indexOf('Chrome') === -1 &&
                navigator.userAgent.indexOf('Opera') === -1;
        },

        /*============================================================================================*/
    };
}();

/*============================================================================================*/
// String Methods
/*============================================================================================*/

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
}

String.prototype.padLeft = function (length, string) {
    return this.length < length ? (string + this).padLeft(length, string) : this;
}

String.prototype.padRight = function (length, string) {
    return this.length < length ? (this + string).padLeft(length, string) : this;
}

/*============================================================================================*/

/*============================================================================================*/
// Date Methods
/*============================================================================================*/

Date.prototype.ToTrString = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return (dd[1] ? dd : "0" + dd[0]) + "." + (mm[1] ? mm : "0" + mm[0]) + "." + yyyy.padLeft(4, '0'); // padding
};

Date.prototype.ToYYYYMMDD = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy.padLeft(4, '0') + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
};

Date.prototype.toJSON = function () {
    //2014-01-01T23:28:56.782Z

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    var hh = this.getHours().toString();
    var mi = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    var ms = this.getMilliseconds().toString();

    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T" +
           (hh[1] ? hh : "0" + hh[0]) + ":" + (mi[1] ? mi : "0" + mi[0]) + ":" + (ss[1] ? ss : "0" + ss[0]) + "." + (ms[1] ? ms : "0" + ms[0]);
};

/*============================================================================================*/
