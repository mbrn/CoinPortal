var SgMultiLang;

!function ($) {
    "use strict";

    SgMultiLang = function (element, options) {
        this.init(element, options);
    };

    SgMultiLang.getMultiLangValue = function (text) {
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, '')) && text != "") {

            return JSON.parse(text);

        } else {
            return { tr: text };
        }
    }

    SgMultiLang.prototype = {
        constructor: SgMultiLang,

        lngList: undefined,
        options: undefined,

        init: function (element, options) {
            this.lngList = Sigma.ajaxGetData('/Base/FrmLng/GetFrmLngList');

            this.options = options;
            var $element = $(element);
            var that = this;

            if ($element.is('input') || ($element.is('textarea') && options.richTextBox == false)) {
                $element.attr('readonly', true);

                var html = '<div class="form ">                                                 ' +
                       '  <form class="form-horizontal" role="form">        ' +
                       '      <div class="form-body" style="padding:0px;">        ';

                for (var i = 0; i < this.lngList.length; i++) {
                    html += '     <div class="form-group" style="margin-bottom: 5px;"> ' +
                            '           <label class="control-label col-md-3">' + this.lngList[i].LngName + '</label>' +
                            '           <div class="col-md-9">' +
                            '              <input type="text" class="form-control input-sm lang-text" data-lang-key="' + this.lngList[i].LngKey + '" placeholder="' + this.lngList[i].LngName + '">' +
                            '           </div>' +
                            '     </div>';
                }

                html += '<div class="form-group" style="margin-top:10px;"> ' +
                        '   <div class="col-md-6" style="padding-right:5px;"> ' +
                        '       <button type="button" class="btn default btn-block btn-sm cancel">İptal</button>' +
                        '   </div>' +
                        '   <div class="col-md-6" style="padding-left:5px;"> ' +
                        '       <button type="button" class="btn green btn-block btn-sm ok">Tamam</button>' +
                        '   </div>' +
                        '</div>';

                html += "</div></form></div>";

                $element.popover({
                    html: true,
                    title: "Lütfen tüm dillerdeki karşılıkları giriniz",
                    content: html,
                    placement: options.placement,
                    trigger: 'click',
                    container: 'body'
                }).on('shown.bs.popover', function () {
                    var $popup = $(this);
                    var popoverContainer = $('#' + $popup.attr('aria-describedby'));
                    popoverContainer.css("z-index", 10050);

                    // Mevcut degerlerin yuklenmesi
                    ///////////////////////
                    var text = $element.val();
                    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')) && text != "") {

                        text = JSON.parse(text);

                    } else {
                        text = { tr: text };
                    }

                    $.each($('input.lang-text', popoverContainer), function (index, input) {
                        $(input).val(text[$(input).data('lang-key')])
                    });
                    ///////////////////////

                    // İptal ve Tamam butonlarının eventleri
                    ///////////////////////
                    popoverContainer.find('button.cancel').click(function (e) {
                        $popup.popover('hide');
                    });
                    popoverContainer.find('button.ok').click(function (e) {
                        var text = {};

                        $.each($('input.lang-text', popoverContainer), function (index, input) {
                            text[$(input).data('lang-key')] = $(input).val();
                        });

                        $element.val(JSON.stringify(text));
                        $popup.popover('hide');
                    });
                    ///////////////////////
                }).on('hidden.bs.popover', function (e) {
                    $(e.target).data("bs.popover").inState.click = false;
                });

            }
            else if ($element.is('textarea') && this.options.richTextBox == true) {
                if ($.summernote.options.toolbar.multilangAdded != true) {
                    this.options.toolbar = $.merge($.summernote.options.toolbar, [['multilang', ['multilang']]]);
                    $.summernote.options.toolbar.multilangAdded = true;
                }

                this.options.buttons = {
                    multilang: function (context) {
                        var html = '<style>.note-multilang {margin-top: 3px !important;}</style>';
                        html += '<div class="btn-group" data-toggle="buttons" style="margin-top: 2px;">';
                        for (var i = 0; i < that.lngList.length; i++) {
                            html += '<label class="btn btn-sm default" data-lng-key="' + that.lngList[i].LngKey + '"> <input name="Lng" type="radio" class="toggle" value="' + that.lngList[i].LngKey + '"> ' + that.lngList[i].LngName + ' </label>';
                        }
                        html += '</div>';

                        var result = $(html);
                        $('label:first', result).addClass('active').find('input').attr('checked');

                        // Burada containeri disari veriyoruz. elemente bu sekilde erisebiliriz buradan ancak
                        context.layoutInfo.note.context.multiLangContainer = result;
                        return result;
                    },
                }

                this.options.dialogsInBody = true;
                var sn = $(element).summernote(this.options);
                $(element).summernote('code', '');

                this.element = $(element);
                this.multilang = {};
                this.multilang.container = element.multiLangContainer;
                this.multilang.currentLng = $('label.active', this.multilang.container).data('lng-key');

                $('input[type="radio"]', this.multilang.container).change(function (a, b) {
                    if (!that.multilang.currentTrn) {
                        that.multilang.currentTrn = {};
                    }

                    that.multilang.currentTrn[that.multilang.currentLng] = that.element.summernote('code');
                    that.multilang.currentLng = $('label.active', that.multilang.container).data('lng-key');

                    if (that.multilang.currentTrn[that.multilang.currentLng]) {
                        that.element.summernote('code', that.multilang.currentTrn[that.multilang.currentLng]);
                    }
                    else {
                        that.element.summernote('code', '');
                    }
                });
            }
        },

        value: function (value) {
            var $this = $(this);

            if (this.options.richTextBox) {
                if (value == undefined) {

                    this.multilang.currentTrn[this.multilang.currentLng] = this.element.summernote('code');

                    var result = {};
                    for (var i = 0; i < this.lngList.length; i++) {
                        result[this.lngList[i].LngKey] = this.multilang.currentTrn[this.lngList[i].LngKey];
                    }

                    return JSON.stringify(result);
                }
                else {
                    if (/^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')) && value != "") {

                        this.multilang.currentTrn = JSON.parse(value);

                    } else {
                        this.multilang.currentTrn = { tr: value };
                    }

                    if (this.multilang.currentTrn[this.multilang.currentLng]) {
                        this.element.summernote('code', this.multilang.currentTrn[this.multilang.currentLng]);
                    }
                    else {
                        this.element.summernote('code', '');
                    }
                }
            }
            else {
                if (value == undefined) {
                    return $this.val();
                }
                else {
                    $this.val(value);
                }
            }
        },
    };

    $.fn.sgMultiLang = function (option, args) {
        var $this = $(this);
        var obj = $this.data('sg-multi-lang');

        if (typeof option == 'string') {
            if (obj[option]) {
                var x = obj[option](args);
                return x;
            }
            else if (obj.options.richTextBox == true) {
                return $this.summernote(option, args);
            }
        }
        else {
            return this.each(function () {
                $this = $(this);
                var data = {};
                data.richTextBox = $this.data('is-richtextbox');

                var options = $.extend({}, $.fn.sgMultiLang.defaults, data, typeof option == 'object' && option);

                //if (!obj) {
                $this.data('sg-multi-lang', (obj = new SgMultiLang(this, options)));
                //}
            });
        }
    };

    $.fn.sgMultiLang.defaults = {
        placement: 'bottom',
        richTextBox: false,
        height: 300,
    };

    $.fn.modal.sgMultiLang = SgMultiLang;

}(window.jQuery);