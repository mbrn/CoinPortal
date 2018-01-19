!function ($) {
	"use strict"; // jshint ;_; 

	var SgRichTextBox = function (element, options) {
		this.init(element, options);
	};

	SgRichTextBox.prototype = {        
	    constructor: SgRichTextBox,

	    trnLst: [],

		init: function (element, options) {
			this.element = $(element);
			this.options = options;

			// Editorun sag ustune textbox ve dil butonlarını yerlestirelim
			if (options.multilang == true) {

				options.toolbar = $.merge($.summernote.options.toolbar, [['multilang', ['multilang']]]);
				var lngList = Sigma.ajaxGetData('/Base/FrmLng/GetFrmLngList');
				options.buttons = {
					multilang: function (context) {
						var html = '<div class="input-group input-large" data-toggle="buttons">' +
										'<input type="text" class="form-control multilang txt-key  input-large" placeholder="Çeviri Kodu">' +
										'<span class="input-group-btn ">' +
											'<div class="btn-group" data-toggle="buttons">';
						for(var i = 0; i < lngList.length;i++){
							html += '<label class="btn default tooltips" style="float:inherit;" data-placement="bottom" data-original-title="' + lngList[i].LngName + '" data-lng-key="' + lngList[i].LngKey + '"> <input name="Lng" type="radio" class="toggle" value="' + lngList[i].LngKey + '">' + lngList[i].LngKey + '</label>';
						}
						html += '<button type="button" class="btn default btn-clear" style="float:inherit;" data-toggle="button" disabled> Temizle </button>';
						html += '<button type="button" class="btn default btn-save" style="float:inherit;" data-toggle="button"> Kaydet </button>';
						html +=				'</div>' +
										'</span>' +
									'</div>';

						var result = $(html);						
						$('label.tooltips', result).tooltip({ container: 'body' });
						$('label:first', result).addClass('active').find('input').attr('checked');

						// Burada containeri disari veriyoruz. elemente bu sekilde erisebiliriz buradan ancak
						context.layoutInfo.note.context.multiLangContainer = result; 
						return result;
					},
				}
			}

			var sn = $(element).summernote(options);

			if (options.multilang == true) {
				this.multilang = {};
				this.multilang.container = element.multiLangContainer;
				this.multilang.currentLng = $('label.active', this.multilang.container).data('lng-key');
				var that = this;

				var substringMatcher = function (strs) {
				    return function findMatches(q, cb) {
				        var matches, substrRegex;
				        matches = [];
				        substrRegex = new RegExp(q, 'i');
				        $.each(strs, function (i, str) {
				            if (substrRegex.test(str.text)) {
				                matches.push(str.text);
				            }
				        });

				        cb(matches);
				    };
				};
				this.trnList = Sigma.ajaxGetData("/Base/FrmLngTxt/SearchLangText", { term: "" });
			    $('input.multilang.txt-key', this.multilang.container).typeahead({
				    hint: true,
				    highlight: true,
				    minLength: 1
				},
                {
                    name: 'trnList',
                    source: substringMatcher(that.trnList)
                }).on('typeahead:selected', function (e, datum) {
                    $(this).parents('.note-editor:first').prev().sgRichTextBox('value', datum);
                });

				$('input[type="radio"]', this.multilang.container).change(function (a, b) {
				    if (!that.multilang.currentTrn) {
				        that.multilang.currentTrn = {};
				        that.multilang.currentTrn.trnLst = [];
				    }

					var list = that.multilang.currentTrn.trnLst.filter(function (e) { return e.LngKey == that.multilang.currentLng });
					if (list.length > 0) {
						list[0].Translation = that.element.summernote('code');						
					}
					else {
					    that.multilang.currentTrn.trnLst.push({ Translation: that.element.summernote('code'), LngKey: that.multilang.currentLng, TxtKey: that.multilang.currentTrn.TxtKey })
					}

					that.multilang.currentLng = $('label.active', that.multilang.container).data('lng-key');

					var list = that.multilang.currentTrn.trnLst.filter(function (e) { return e.LngKey == that.multilang.currentLng });
					if (list.length > 0) {
						that.element.summernote('code', list[0].Translation);						
					}
					else {
						that.element.summernote('code', '');
					}
				});

				$('button.btn-clear', this.multilang.container).click(function () {
				    $(this).parents('.note-editor:first').prev().sgRichTextBox('value', '');
				});

				$('button.btn-save', this.multilang.container).click(function () {
				    var input = $('.multilang.txt-key.tt-input', $(this).parents('.note-multilang'));
				    if ($.trim(input.val()) == '') {
				        Sigma.toastError('Lütfen çeviri kodu giriniz');
				        return;
				    }

				    var trn = {};
				    trn.txt = { TxtKey: input.val() };
				    trn.trnLst = that.multilang.currentTrn.trnLst;

				    var t = trn.trnLst.filter(function (e) { return e.LngKey == that.multilang.currentLng });
				    if (t.length == 0) {
				        trn.trnLst.push({ LngKey: that.multilang.currentLng, Translation: that.element.summernote('code') });
				    }
				    else {
				        t[0].Translation = that.element.summernote('code');
				    }
				    				    
				    if (input.attr('disabled')) {
				        Sigma.ajax({
				            url: "/Base/FrmLngTxt/UpdateFrmLngTxt",
				            data: trn,
                            blockTarget : that.element.next(),
                            onSuccess: function () {
                                Sigma.toastInfo('Çeviri güncellendi');
				            }
				        });
				    }
				    else {
				        Sigma.ajax({
				            url: "/Base/FrmLngTxt/SaveFrmLngTxt",
				            data: trn,
				            blockTarget: that.element.next(),
				            onSuccess: function () {
				                Sigma.toastInfo('Yeni çeviri kaydedildi');
				                trn.TxtKey = trn.txt.TxtKey;
				                trn.text = trn.txt.TxtKey;
				                trn.id = trn.txt.TxtKey;
				                that.trnList.push(trn);
				                that.value(trn.txt.TxtKey);
				            }
				        });
				    }				    
				});
			}
		},

		value: function (value) {
			var $this = $(this);

			if (value == undefined) {
				if (this.options.multilang) {
					return $($('.multilang.txt-key', this.multilang.container)[1]).val();
				}
				else {
				    //return $this.summernote('code');
				    return this.element.summernote('code');
                }
			}
			else {
				if (this.options.multilang) {
				    $('.multilang.txt-key', this.multilang.container).val(value);

				    if (value == '') {
				        this.element.summernote('code', '');
				        $($('.multilang.txt-key', this.multilang.container)[1]).removeClass('bg-default bg-font-default').attr('disabled', false);
				        $('button.btn-clear', this.multilang.container).attr('disabled', true);
				    }
				    else {
				        var trn = Sigma.ajaxGetData('/Base/FrmLngTxt/GetLangText', { txtKey: value });
				        if (trn) {
				            this.multilang.currentTrn = trn;
				            this.multilang.currentLng = $('label.active', this.multilang.container).data('lng-key');
				            var lng = this.multilang.currentLng;

				            var list = trn.trnLst.filter(function (e) { return e.LngKey == lng });
				            $($('.multilang.txt-key', this.multilang.container)[1]).addClass('bg-default bg-font-default').attr('disabled', true);
				            if (list.length > 0) {
				                this.element.summernote('code', list[0].Translation);
				            }
				            else {
				                this.element.summernote('code', '');
				            }

				            $('button.btn-clear', this.multilang.container).attr('disabled', false);
				        }
				    }
				}
				else {
					this.element.summernote('code', value);
				}
			}
		},
	};

	$.fn.sgRichTextBox = function (option, args) {
		var $this = $(this);
		var obj = $this.data('sg-richtextbox');

		if (typeof option == 'string') {
			if (obj[option]) {
				var x = obj[option](args);
				return x;
			}
			else {
				return $this.summernote(option, args);
			}
		}
		else {
			return this.each(function () {
				var options = $.extend({}, $.fn.sgRichTextBox.defaults, typeof option == 'object' && option);

				if (!obj) {
					$this.data('sg-richtextbox', (obj = new SgRichTextBox(this, options)));
				}
			});
		}
	};

	$.fn.sgRichTextBox.defaults = {
		multilang: false,
		height: 300,
	};

	$.fn.modal.sgRichTextBox = SgRichTextBox;

}(window.jQuery);