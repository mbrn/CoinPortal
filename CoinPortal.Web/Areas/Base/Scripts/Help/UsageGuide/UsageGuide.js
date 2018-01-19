var modalFormFrmUsgSbj = $('#modalFormFrmUsgSbj');
var btnFrmUsgSbjSave = $('#btnFrmUsgSbjSave');
var btnFrmUsgSbjUpdate = $('#btnFrmUsgSbjUpdate');
var btnDelSubject = $('#btnDelSubject');
var btnUpdSubject = $('#btnUpdSubject');
var btnFrmUsgSbjAddComment = $('#btnFrmUsgSbjAddComment');

var btnAddSubject = $('#btnAddSubject');
var frmFrmUsgSbj = '#frmFrmUsgSbj';
var frmFrmUsgSbjComment = '#frmFrmUsgSbjComment';

var subjectData;
var usagesubjects;
jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    Sigma.validate({
        formName: frmFrmUsgSbj,
        rules: {
            ParentId: { required: true },
            NodeType: { required: true },
            SubjectName: { required: true },
        },
        messages: {
        }
    });

    $('#SubjectText').sgRichTextBox({ height: 400 });
   

    if (isAuthorized) {
        $("#btnAddSubject").show();
    }

    $("#input-4").rating({ size: 'xxs', language: 'tr' });
    $(".rating-container").hide();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/
    btnAddSubject.click(function () {
        clearSubjectModal();

        btnFrmUsgSbjSave.removeClass("display-none");
        btnFrmUsgSbjUpdate.addClass("display-none");
        $("#NodeType").removeAttr('disabled');
        modalFormFrmUsgSbj.modal('show');
    });

    btnFrmUsgSbjSave.click(function () {
        if ($(frmFrmUsgSbj).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }
        if ( $('#SubjectText').sgRichTextBox('value').trim() == "") {
            Sigma.toastWarning("Lütfen İçeriği Giriniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(frmFrmUsgSbj);
        obj.SubjectText = $('#SubjectText').sgRichTextBox('value');
        
        Sigma.ajax({
            url: "../../Base/UsageGuide/SaveFrmUsgSbj",
            data: { obj: obj },
            blockTarget: $("#portletSubject"),
            onSuccess: function () { modalFormFrmUsgSbj.modal('hide'); FillUsageSubjects(); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnFrmUsgSbjUpdate.click(function () {
        if ($(frmFrmUsgSbj).valid() == false) {
            Sigma.toastWarning("Lütfen hatalı alanları düzeltiniz", "UYARI");
            return true;
        }

        if ($('#SubjectText').sgRichTextBox('value').trim() == "") {
            Sigma.toastWarning("Lütfen İçeriği Giriniz", "UYARI");
            return true;
        }

        var obj = Sigma.objectFromForm(frmFrmUsgSbj);
        obj.SubjectText = $('#SubjectText').sgRichTextBox('value');
        

        Sigma.ajax({
            url: "../../Base/UsageGuide/UpdateFrmUsgSbj",
            data: { obj: obj },
            blockTarget: $("#portletSubject"),
            onSuccess: function () { modalFormFrmUsgSbj.modal('hide'); FillUsageSubjects(); GetUsageSubjectData(obj.SubjectId); },
            showSuccessToast: true,
            showErrorToast: true
        });
    });

    btnDelSubject.click(function () {
        DeleteFrmUsgSbj(parseInt($(".subjectContent").attr("subjectId")));
    });

    btnUpdSubject.click(function () {
        var SubjectId = parseInt($(".subjectContent").attr("subjectId"))

        clearSubjectModal();

        btnFrmUsgSbjSave.addClass("display-none");
        btnFrmUsgSbjUpdate.removeClass("display-none");
        $("#NodeType").attr('disabled', 'disabled');
        $('#SubjectText').sgRichTextBox('value', subjectData.UsgSbj.SubjectText)
        Sigma.fillForm(frmFrmUsgSbj, subjectData.UsgSbj);

        modalFormFrmUsgSbj.modal('show');
    });

    $('body').on('click', '.portlet > .portlet-title > .actions > .myCollapse, .portlet .portlet-title > .actions > .myExpand', function (e) {
        var el = $(this).closest(".portlet").children(".portlet-body");
        if ($(this).hasClass("myCollapse")) {
            $(this).removeClass("myCollapse").addClass("myExpand");
            $(this).html('<i class="fa fa-chevron-up"></i>');
            el.slideUp(200);
        } else {
            $(this).removeClass("myExpand").addClass("myCollapse");
            $(this).html('<i class="fa fa-chevron-down"></i>');
            el.slideDown(200);
        }

        return true;
    });

    /*============================================================================================*/
    // Scripts business
    /*============================================================================================*/

    if (!isAuthorized) {
        $("#btnDelSubject").hide();
        $("#btnUpdSubject").hide();
        $("#btnAddSubject").hide();
    }
    FillUsageSubjects();

    /*============================================================================================*/
    // Comment 
    /*============================================================================================*/

    $('body').on('click', '.btnFrmUsgSbjAddComment', function (e) {

        Sigma.validate({
            formName: frmFrmUsgSbjComment,
            rules: { message: { required: true }, },
            messages: {}
        });

        if ($(frmFrmUsgSbjComment).valid() == false) {
            return true;
        }

        var subjectId = $('#message').attr("SubjectId");

        Sigma.ajax({
            url: "../../Base/UsageGuide/SaveFrmUsgSbjComment",
            data: { SubjectId: subjectId, commentText: $("#message").val() },
            onSuccess: function () {
                $("#message").val("");
                GetUsageSubjectData(subjectId);
            },
            showSuccessToast: false,
            showErrorToast: true
        });
    });

    /*============================================================================================*/
    // rating 
    /*============================================================================================*/

    $('#input-4').on('rating.change', function (event, value, caption) {
        Sigma.ajax({
            url: "../../Base/UsageGuide/UpdateFrmUsgSbjRate",
            data: { rateVal: parseFloat(value), SubjectId: subjectData.UsgSbj.SubjectId },
            onSuccess: function (data) {
                GetUsageSubjectData(subjectData.UsgSbj.SubjectId);
            },
            showSuccessToast: false,
            showErrorToast: true,
        });
    });

    $("#txtSearchBlogs").on('input', function () {
        $('.blog-content-2').each(function () {
            var searchTerm = $("#txtSearchBlogs").val();
            var instance = new Mark($(this));
            instance.unmark();
            instance.mark(searchTerm);
        });
    });

    $('#txtSearchSubjects').bind("input", function () {
        var pattern = $('#txtSearchSubjects').val();
        var options = {
            ignoreCase: true,
            exactMatch: false,
            revealResults: true
        };
        $('#scrItmTreeViewSubjects').treeview('search', [pattern, options]);
    });
});

function FillUsageSubjects() {
    Sigma.ajax({
        url: "../../Base/UsageGuide/GetFrmUsgSbjList",
        blockTarget: $("#portletSubjects"),
        onSuccess: function (data) {
            usagesubjects = JSON.parse(data);

            $(frmFrmUsgSbj + ' #ParentId').find('option').remove();
            $(frmFrmUsgSbj + ' #ParentId').append('<option value=0>Üst Başlık</option>');
            usagesubjects.sort(function (a, b) {
                if (a.ParentId == b.ParentId)
                    return a.Priority - b.Priority;
                else
                    return a.ParentId - b.ParentId;
            });

            usagesubjects.forEach(function (subject) {
                if (subject.NodeType == "L")
                    $(frmFrmUsgSbj + ' #ParentId').append('<option value=' + subject.SubjectId + '>' + subject.SubjectName + '</option>');
            });

            generateSubjectsTreeView();
        },
        showSuccessToast: false,
        showErrorToast: true,
    });
}

function GetUsageSubjectData(SubjectId) {
    Sigma.ajax({
        url: "../../Base/UsageGuide/GetUsageGuidData",
        data: { subjectId: SubjectId },
        blockTarget: $("#portletBlogs"),
        onSuccess: function (data) {
            subjectData = JSON.parse(data);
            GenerateSubjectContent(JSON.parse(data));
        },
        showSuccessToast: false,
        showErrorToast: true,
    });
}

function GetFrmUsgSbj(SubjectId) {
    Sigma.ajax({
        url: "../../Base/UsageGuide/GetFrmUsgSbj",
        data: { subjectId: SubjectId },
        blockTarget: $("#portletSubjects"),
        onSuccess: function (data) {
            var obj = JSON.parse(data);
            $('#SubjectText').sgRichTextBox('value', obj.SubjectText);
            Sigma.fillForm(frmFrmUsgSbj, obj);
        },
        showSuccessToast: false,
        showErrorToast: true,
    });
}

function DeleteFrmUsgSbj(SubjectId) {
    var subject = getScreenObject(SubjectId);
    var message = subject.SubjectName + ' İçeriğini silmek istediğinize emin misiniz?';
    if (subject.NodeType == "L") {
        message = subject.SubjectName + ' İçeriğini ve alt içeriklerin tamamını silmek istediğinize emin misiniz?';
    }

    Sigma.dialogConfirm({
        message: message,
        onConfirm: function () {
            Sigma.ajax({
                url: "../../Base/UsageGuide/DeleteFrmUsgSbj",
                data: { subjectId: subject.SubjectId },
                onSuccess: function ()
                {
                    FillUsageSubjects();
                    SetDefaultText();
                },
                showSuccessToast: true,
                showErrorToast: true
            });
        }
    });
}

function generateSubjectsTreeView() {
    $('#scrItmTreeViewSubjects').treeview({
        expandIcon: "fa fa-angle-right",
        collapseIcon: "fa fa-angle-down",
        checkedIcon: "fa fa-check-square",
        showBorder: true,
        showTags: true,
        searchResultColor: 'white',
        searchResultBackColor: '#b9ac4c',
        highlightSelected: true,

        data: generateScreenTreeData(0, isAuthorized),

        onSearchComplete: function (event, data) {
            setTreeEvents();
        },
    });

    $('#scrItmTreeViewSubjects.treeview').click(function () {
        setTreeEvents();
    });

    setTreeEvents();
}
function generateScreenTreeData(parentId, hasButtons) {
    if (parentId == undefined) parentId = 0;
    if (hasButtons == undefined) hasButtons = false;

    var tree = [];
    var nodes = $.map(usagesubjects, function (c, i) {
        if (c.ParentId == parentId) return c;
    })
    nodes.sort(function (a, b) { return a.Priority - b.Priority });
    nodes.forEach(function (node) {
        if (node.NodeType == 'N') {
            tree.push({
                text: node.SubjectName,
                icon: node.SubjectIconContent,
                tags: getTreeItemButtons(node, hasButtons),
                state: {
                    checked: false,
                },
            });
        } else {
            tree.push({
                text: node.SubjectName,
                icon: node.SubjectIconContent,
                tags: getTreeItemButtons(node, hasButtons),
                state: {
                    expanded: false,
                    checked: false,
                },
                nodes: generateScreenTreeData(node.SubjectId, hasButtons)
            });
        }
    });

   
    return tree;
}

function getTreeItemButtons(node, openButtons) {
    var buttons = [];

    buttons.push('<div class="subjectItemData display-hide" SubjectId="' + node.SubjectId + '" nodeType="' + node.NodeType + '"></div>');


    if (openButtons) {
        buttons.push('<button class="btn btn-xs default btn-outline btnDeleteSubject" style="display: none;"><i class="fa fa-times"></i></button>');
        buttons.push('<button class="btn btn-xs default btn-outline btnUpdateSubject" style="display: none;"><i class="fa fa-refresh"></i></button>');
        buttons.push('<button class="btn btn-xs default btn-outline btnDownPrSubject" style="display: none;"><i class="fa fa-chevron-down"></i></button>');
        buttons.push('<button class="btn btn-xs default btn-outline btnUpPrSubject" style="display: none;"><i class="fa fa-chevron-up"></i></button>');

        if (node.NodeType == 'L')
            buttons.push('<button class="btn btn-xs default btn-outline btnAddSubject" style="display: none;"><i class="fa fa-plus"></i></button>');
    }
    return buttons;
}

function setTreeEvents() {
    $("#scrItmTreeViewSubjects ul li.node-scrItmTreeViewSubjects").hover(function () {
        $(this).find('.btn').fadeIn(200);
        if ($(this).hasClass("node-selected"))
            $(this).find('.btn').addClass("default").removeClass("blue");
        else
            $(this).find('.btn').addClass("blue").removeClass("default");
    }, function () {
        $(this).find('.btn').hide(0);
    });

    $("#scrItmTreeViewSubjects ul li.node-scrItmTreeViewSubjects").click(function () {
        var SubjectId = $(this).children("span.badge").parent().find('div.subjectItemData').attr("SubjectId");
        var nodeType = $(this).children("span.badge").parent().find('div.subjectItemData').attr("nodeType");
        if (nodeType == "N")
            GetUsageSubjectData(SubjectId);

    });

    $('#scrItmTreeViewSubjects button.btnAddSubject').click(function (e) {
        e.stopPropagation();
        clearSubjectModal();
        var SubjectId = $(this).parents('li').find('div.subjectItemData').attr("SubjectId");
        btnFrmUsgSbjSave.removeClass("display-none");
        btnFrmUsgSbjUpdate.addClass("display-none");
        $("#NodeType").removeAttr('disabled');
        $("#ParentId").val(SubjectId).trigger("change");;
        modalFormFrmUsgSbj.modal('show');
    });

    $('#scrItmTreeViewSubjects button.btnUpPrSubject').click(function (e) {
        e.stopPropagation();
        var SubjectId = $(this).parent("span.badge").parent().find('div.subjectItemData').attr("SubjectId");

        Sigma.ajax({
            url: "../../Base/UsageGuide/UpdatePriorityUp",
            data: { SubjectId: SubjectId },
            onSuccess: function (data) { FillUsageSubjects(); SetDefaultText(); },
            showSuccessToast: false,
            showErrorToast: true
        });
    });

    $('#scrItmTreeViewSubjects button.btnDownPrSubject').click(function (e) {
        e.stopPropagation();
        var SubjectId = $(this).parent("span.badge").parent().find('div.subjectItemData').attr("SubjectId");

        Sigma.ajax({
            url: "../../Base/UsageGuide/UpdatePriorityDown",
            data: { SubjectId: SubjectId },
            onSuccess: function (data) { FillUsageSubjects(); SetDefaultText(); },
            showSuccessToast: false,
            showErrorToast: true
        });
    });

    $('#scrItmTreeViewSubjects button.btnUpdateSubject').click(function (e) {
        e.stopPropagation();
        var SubjectId = $(this).parent("span.badge").parent().find('div.subjectItemData').attr("SubjectId");

        clearSubjectModal();

        btnFrmUsgSbjSave.addClass("display-none");
        btnFrmUsgSbjUpdate.removeClass("display-none");
        $("#NodeType").attr('disabled', 'disabled');
        GetFrmUsgSbj(SubjectId);

        modalFormFrmUsgSbj.modal('show');
    });


    $('#scrItmTreeViewSubjects button.btnDeleteSubject').click(function (e) {
        e.stopPropagation();
        var SubjectId = $(this).parent("span.badge").parent().find('div.subjectItemData').attr("SubjectId");
        DeleteFrmUsgSbj(SubjectId);
    });


}
function getScreenObject(SubjectId) {
    var result = $.grep(usagesubjects, function (e) { return e.SubjectId == SubjectId; });
    if (result.length == 0)
        return "";
    else
        return result[0];
}


function GenerateSubjectContent(usgGuideData) {

    $("#portletBlogs  .portlet-title").show();

    if (isAuthorized) {
        $("#btnDelSubject").show();
        $("#btnUpdSubject").show();
    }

    $(".subjectContent").html("");
    $('.subjectContent').attr('subjectId', usgGuideData.UsgSbj.SubjectId);
    $('.subjectContent').addClass(' blog-single-content blog-container');


    var innerHtml = "";
    var subject = usgGuideData.UsgSbj;
    $('#input-4').rating('update', usgGuideData.UsgSbjRate);

    $('#portletBlogs > .portlet-title > .caption > i').addClass(subject.SubjectIconContent);
    $('#portletBlogs > .portlet-title > .caption > span').text(subject.SubjectName);

    // content header info
    innerHtml += '<div class="blog-single-head">' +
                      '<h1 class="blog-single-head-title"></h1>' +
                      '<div class="blog-single-head-date">' +
                            '<i class="icon-calendar font-blue"></i>' +
                            '<span class="font-grey-salt">' + moment(subject.UpdateDateTime, 'YYYY.MM.DD hh:mm:ss').fromNow() + '</span>' +
                      '</div>' +
                 '</div>';

    // content data info
    innerHtml += '<div class="blog-single-desc">' + subject.SubjectText + '</div>';

    // content footer info
    var tags = subject.SubjectTags.split(",");
    if (subject.SubjectTags.trim() != "" && tags.length > 0) {
        innerHtml += '<div class="blog-single-foot">' +
                     '<ul class="blog-post-tags">';
        tags.forEach(function (tag) {
            if (tag.trim() != "") {
                innerHtml += '<li class="uppercase">  <a href="javascript:;">' + tag + '</a> </li>';
            }
        });

        innerHtml += '</ul></div>'
    }

    var comments = usgGuideData.UsgSbjComment;

    if (comments.length > 0) {
        innerHtml += '<div class="blog-comments">' +
                            '<h3 class="sbold blog-comments-title">Yorumlar(' + comments.length + ')</h3>' +
                            '<div class="c-comment-list">'

        comments.forEach(function (comment) {
            if (comment.ParentCommentId == 0) {
                innerHtml += GenerateCommentsData(comment, comments);
            }
        });

        innerHtml += '</div>' + '</div>';
    }

    if (subject.IsRateble) {
        $(".rating-container").show();
    }
    else {
        $(".rating-container").hide();
    }

    if (subject.IsCommentable) {
        innerHtml += '<h3 class="sbold blog-comments-title">Yorum Ekle</h3>';

        innerHtml += '<form role="form" id="frmFrmUsgSbjComment">' +
                         '<div class="form-group">' +
                                '<textarea rows="6" name="message" id="message" subjectId ="' + usgGuideData.UsgSbj.SubjectId + '" placeholder="Yorumu buraya yazınız ..." class="form-control c-square"></textarea>' +
                         '</div>' +
                         '<div class="form-group">' +
                                '<button  type="button" class="btn blue uppercase btn-md sbold btn-block btnFrmUsgSbjAddComment">Yorum Ekle</button>' +
                         '</div>' +
                    '</form>';
    }

    $(".subjectContent").append(innerHtml);
}


function GenerateCommentsData(comment, comments) {
    var html = "";

    var childComments = $.map(comments, function (c, i) {
        if (c.ParentCommentId == comment.CommentId) return c;
    })

    var imgPath = comment.ImgPath;
    if (imgPath == undefined || imgPath == "")
        imgPath = '/Theme/Sigma/Img/empty_user.png'

    html += ' <div class="media">' +
                '<div class="media-left">' +
                    '<a href="#">' +
                    '<img class="media-object" alt="" onerror=this.src = "/Theme/Sigma/Img/empty_user.png"; src="' + window.location.protocol + "//" + window.location.host + "/" + imgPath + '"> </a>' +
                '</div>' +
                '<div class="media-body">' +
                    '<h4 class="media-heading">' +
                    '<a href="#">' + comment.InsertUser + '</a> ' +
                    '<span style="font-size: 10px;">' + moment(comment.InsertDatetime, 'YYYY.MM.DD hh:mm:ss').fromNow() + '</span>' +
                    ' </h4> ' + comment.CommentText;

    childComments.forEach(function (childcomment) {
        if (childcomment.ParentCommentId != 0) {
            html += GenerateCommentsData(childcomment, comments)
        }
    });

    html += ' </div>' + ' </div>';
    return html;
}

function clearSubjectModal() {
    $('#SubjectText').sgRichTextBox('value', '');
    Sigma.clearForm(frmFrmUsgSbj);
    Sigma.clearValidationClass(frmFrmUsgSbj);
}

function clearForm() {
    Sigma.clearForm();
}

function  SetDefaultText()
{
    $("#portletBlogs .portlet-title").hide("");
    $("#portletBlogs .portlet-body .rating").hide("");
    $("#portletBlogs .portlet-body .subjectContent").html('<div class="well"><p> Sol tarafta bulunan menüye tıklayarak sistemin çalışma şekli hakkında bilgi alabilirsiniz.</p></div>');
}