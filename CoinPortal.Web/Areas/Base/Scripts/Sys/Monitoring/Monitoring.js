/*============================================================================================*/
// General
/*============================================================================================*/

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    $('.bs-select').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check'
    });

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    $('body').on('click', '.portlet > .portlet-title > .actions .myCollapse, .portlet .portlet-title > .actions .myExpand', function (e) {
        e.preventDefault();
        var el = $(this).closest(".portlet").children(".portlet-body");
        if ($(this).hasClass("myCollapse")) {
            $(this).removeClass("myCollapse").addClass("myExpand");
            el.slideUp(200);
            $(this).html('<i class="fa fa-chevron-up"></i>')
        } else {
            $(this).removeClass("myExpand").addClass("myCollapse");
            el.slideDown(200);
            $(this).html('<i class="fa fa-chevron-down"></i>')
        }
    });

    /*============================================================================================*/
});



/*============================================================================================*/
// Charts
/*============================================================================================*/
var chartResponseTime;
var chartTimer = null;
jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    // AREA CHART
    $('#chart-txn_count').highcharts({
        chart: {
            type: 'area',
            style: {
                fontFamily: 'Open Sans'
            }
        },
        credits: {
            enabled: false
        },
        title: {            
            text: 'İşlem Sayıları',            
        },
       
        xAxis: {
            //categories: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '16:00', '17:00'],            
        },
        yAxis: {
            title: {
                text: ''
            },            
        },
        tooltip: {
            shared: true,
            valueSuffix: ' işlem'
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5,
                stacking: 'normal',
                lineWidth: 1,
                marker: {
                    enabled: false,
                    lineWidth: 1,
                    lineColor: '#26C281'
                }
            }
        },
        series: [{
            name: 'Başarılı',
            color: '#26C281',
            //data: [50, 45, 43, 78, 81, 79, 83, 90, 142, 132, 99, 68],
            animation: {
                duration: 2000
            },
        }, {
            name: 'Hatalı',
            color: '#E08283',
            //data: [5, 9, 10, 23, 24, 14, 24, 12, 13, 8, 5, 3],
            animation: {
                duration: 2000
            },
        }],
    });

    chartResponseTime = $('#chart-response-time').highcharts({
        chart: {
            style: {
                fontFamily: 'Open Sans'
            }
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Ortalama Yanıt Süreleri',            
        },        
        xAxis: {
            //categories: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '16:00', '17:00'],
        },
        yAxis: {
            title: {
                text: 'Yanıt Süresi (ms)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' ms'
        },
        series: [{
            name: 'Non-Ajax',
            //data: [50, 45, 43, 78, 81, 79, 83, 90, 142, 132, 99, 68],
            color: '#4C87B9',
            animation: {
                duration: 2000
            },
        },
        {
            name: 'Ajax',
            //data: [30, 25, 33, 68, 11, 78, 89, 60, 132, 112, 79, 28],
            color: '#1BBC9B',
            animation: {
                duration: 2000
            },
        }]
    });

    refreshChartsData();

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    $('#btnRefreshCharts').click(function () {
        refreshChartsData();
    });

    $("#cmbChartFilterUsr, #cmbChartFilterScr, #cmbChartRange, #cmbChartFilterTntId, #cmbChartFilterTntTyp").change(function () {
        refreshChartsData();
    });

    $('#btnRefreshCharts').click(function () {
        if ($(this).find('i').hasClass('fa-play')) {
            refreshChartsData();
            $(this).html('<i class="fa fa-pause"></i>');
        }
        else {
            if (chartTimer != null)
                clearTimeout(chartTimer);
            $(this).html('<i class="fa fa-play"></i>');
        }
    });

    /*============================================================================================*/
});

function refreshChartsData(timer)
{
    var usr = $('#cmbChartFilterUsr').val().replace('0', '');
    var tntType = $('#cmbChartFilterTntTyp').val().replace('-1', '');
    var tntId = $('#cmbChartFilterTntId').val();
    var scr = $('#cmbChartFilterScr').val().replace('-1', '');
    var hour = $('#cmbChartRange').val();

    Sigma.ajax({
        url: "../../Base/Monitoring/GetChartsData",
        data: { username: usr, ScrItemId: scr, hour: hour, tntType: tntType, tntId: tntId },
        blockTarget: $("#portletCharts, div .dashboard-stat2 "),
        showErrorToast: false,
        showSuccessToast: false,
        onSuccess: function (data) {
            var chartData = JSON.parse(data);

            counter($('#widgetUserCount'), chartData.onlineUserCount);
            counter($('#widgetResponseSuccessRatio'), chartData.responseSuccessRatio);
            counter($('#widgetResponseCount'), chartData.responseCount);
            counter($('#widgetResponceAvg'), chartData.responceAvg);
            
            $('#chart-response-time').highcharts().xAxis[0].setCategories(chartData.categories);
            $('#chart-response-time').highcharts().series[0].setData(chartData.avgCostNonAjaxArr, false);
            $('#chart-response-time').highcharts().series[1].setData(chartData.avgCostAjaxArr, false);
            $('#chart-response-time').highcharts().redraw();

            $('#chart-txn_count').highcharts().xAxis[0].setCategories(chartData.categories);
            $('#chart-txn_count').highcharts().series[0].setData(chartData.cntSuccess, false);
            $('#chart-txn_count').highcharts().series[1].setData(chartData.cntError, false);
            $('#chart-txn_count').highcharts().redraw();
        }
    });

    chartTimer = setTimeout(function () {
        refreshChartsData();
    }, $('#cmbChartRefreshPeriod').val());

}

function counter(element, to) {
    element.prop('Counter', element.text()).animate({ Counter: to },
        {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
        }
    });
}


/*============================================================================================*/
// Timeline
/*============================================================================================*/
var items = new vis.DataSet();
var timelineTimer = null;

var tableNameFrmMonDtbTxnEvt = '#tblFrmMonDtbTxnEvt';
var tableFrmMonDtbTxnEvt;

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/

    tableFrmMonDtbTxnEvt = Sigma.createDT({
        tableName: tableNameFrmMonDtbTxnEvt,
        columns: [{ title: "Guid", mData: "Guid", visible: false, searchable: false },
        { title: "Status", mData: "Status", visible: false, searchable: false },
        { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
        { title: "No", mData: "EvtId" },
        { title: "ActLogId", mData: "ActLogId", visible: false, searchable: false },
        { title: "Txn No", mData: "TxnId" },
        { title: "SQL Tipi", mData: "EvtType" },
        { title: "Database", mData: "DbName" },
        { title: "Schema", mData: "SchemaName" },
        { title: "Tablo", mData: "TableName" },
        { title: "Query", mData: "Query", visible: false, searchable: false },
        { title: "OldJson", mData: "OldJson" },
        { title: "NewJson", mData: "NewJson" },
        { title: "Baş. Tarihi", mData: "EvtStartDateTime", sgType: 'datetime', visible: false, searchable: false },
        { title: "Bit. Tarihi", mData: "EvtEndDateTime", sgType: 'datetime', visible: false, searchable: false },
        { title: "Süre (ms)", mData: "Cost" },        
        ],
        columnDefs: [
            {
                targets: 6,
                render: function (data, type, full, meta) {
                    if (full.EvtType == "SA") return '<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select </button>';
                    else if (full.EvtType == "SG") return '<button type=\"button\" class=\"btn blue-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select By Guid </button>';
                    else if (full.EvtType == "SK") return '<button type=\"button\" class=\"btn blue-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select By Key </button>';
                    else if (full.EvtType == "SE") return '<button type=\"button\" class=\"btn blue-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select Exists </button>';
                    else if (full.EvtType == "SV") return '<button type=\"button\" class=\"btn blue-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select Average </button>';
                    else if (full.EvtType == "SX") return '<button type=\"button\" class=\"btn blue-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select Max </button>';
                    else if (full.EvtType == "SN") return '<button type=\"button\" class=\"btn blue-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select Min </button>';
                    else if (full.EvtType == "SC") return '<button type=\"button\" class=\"btn blue-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select Count </button>';
                    else if (full.EvtType == "SS") return '<button type=\"button\" class=\"btn blue-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-search"></i> Select Sum </button>';
                    else if (full.EvtType == "IN") return '<button type=\"button\" class=\"btn green-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-plus"></i> Insert </button>';
                    else if (full.EvtType == "UP") return '<button type=\"button\" class=\"btn green-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-refresh"></i> Update </button>';
                    else if (full.EvtType == "DE") return '<button type=\"button\" class=\"btn red-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-times"></i> Delete </button>';
                    else if (full.EvtType == "DA") return '<button type=\"button\" class=\"btn red-soft btn-xs btnShowGridData showQuery\"> <i class="fa fa-times"></i> Delete All </button>';
                    else return full.EvtType;
                }
            },
            {
                targets: 10,
                render: function (data, type, full, meta) {
                    if (full.Query == null || full.Query == "" || full.Query == undefined)
                        return "";
                    else
                        return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData showQuery\"><i class=\"fa fa-eye\"></i> Göster</button>";
                }
            },
            {
                targets: 11,
                render: function (data, type, full, meta) {
                    if (full.OldJson == null || full.OldJson == "" || full.OldJson == undefined)
                        return "";
                    else
                        return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData showOldJson\"><i class=\"fa fa-eye\"></i> Göster</button>";
                }
            },
            {
                targets: 12,
                render: function (data, type, full, meta) {
                    if (full.NewJson == null || full.NewJson == "" || full.NewJson == undefined)
                        return "";
                    else
                        return "<button type=\"button\" class=\"btn blue-madison btn-xs btnShowGridData showNewJson\"><i class=\"fa fa-eye\"></i> Göster</button>";
                }
            }
        ]
    });

    var options = {
        start: new Date(-9 * 60 * 1000 + (new Date()).valueOf()), 
        end: new Date(60 * 1000 + (new Date()).valueOf()),
        editable: false,
        margin: {
            item: 5, // minimal margin between items
            axis: 5   // minimal margin between items and the axis
        },
        orientation: 'top',
        moveable: false,
        selectable: false,
    };
    var container = document.getElementById('mytimeline');
    timeline = new vis.Timeline(container, null, options);
    
    refreshTimeline();

    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/

    timeline.on('click', function (properties) {
        if (properties.what != "item")
            return;

        var item = items._data[properties.item].allData;

        Sigma.ajax({
            url: "../../Base/Monitoring/GetFrmMonDtbTxnEvtLst",
            data: { logId: item.LogId },
            blockUI: false,
            showErrorToast: false,
            showSuccessToast: false,
            onSuccess: function (data) {
                var arr = JSON.parse(data);
                tableFrmMonDtbTxnEvt.clear().draw();
                tableFrmMonDtbTxnEvt.rows.add(JSON.parse(data)).draw();
            }
        });


        $('#txnDetail #logId').text(item.LogId);
        $('#txnDetail #logDateTime').text(new Date(item.LogDate).ToTrString() + " " + item.LogTime.toString().padLeft(6, '0').insertAt(4, ':').insertAt(2, ':'));

        if (item.LogStatus == "RF") {
            $('#txnDetail #logStatus').html('<span class="label label-success"> Başarılı </span>');
        }
        else if (item.LogStatus == "AE" || item.LogStatus == "RE") {
            $('#txnDetail #logStatus').html('<span class="label label-danger"> Hata </span>');
        }
        else if (item.LogStatus == "AS" || item.LogStatus == "AF" || item.LogStatus == "RS") {
            $('#txnDetail #logStatus').html('<span class="label label-warning"> Devam ediyor </span>');
        }

        $('#txnDetail #username').text(item.Username);        

        if (item.CallerArea != "" && item.CallerArea != null && item.CallerArea != undefined) {
            var rootUrl = window.location.origin ? window.location.origin + '/' : window.location.protocol + '/' + window.location.host + '/';
            $('#txnDetail #callerUrl').html('<a href="' + rootUrl + item.CallerArea + '/' + item.CallerController + '/' + item.CallerAction + '" target="_blank">' + screenLookup[item.CallerScreenItemId] + '</a>');
        }
        else {
            $('#txnDetail #callerUrl').html('');
        }
        
        $('#txnDetail #url').html(item.Area + "/" + item.Controller + "/" + item.Action);
        if (item.IsAjax == true || item.IsAjax == "true") {
            $('#txnDetail #isAjax').html('<i class="fa fa-lg fa-check font-green-seagreen" aria-hidden="true"></i>');
        }
        else {
            $('#txnDetail #isAjax').html('<i class="fa fa-lg fa-times font-red-soft" aria-hidden="true"></i>');
        }
        $('#txnDetail #actionStartDateTime').text(moment(item.ActionStartDateTime).format('DD.MM.YYYY HH:mm:ss.SSS'));
        $('#txnDetail #actionEndDateTime').text(moment(item.ActionEndDateTime).format('DD.MM.YYYY HH:mm:ss.SSS'));
        $('#txnDetail #resultStartDateTime').text(moment(item.ResultStartDateTime).format('DD.MM.YYYY HH:mm:ss.SSS'));
        $('#txnDetail #resultEndDateTime').text(moment(item.ResultEndDateTime).format('DD.MM.YYYY HH:mm:ss.SSS'));
       

        if (item.TotalCost > 1000)
            $('#txnDetail #totalCost').html('<span class="font-red-soft">' + item.TotalCost + 'ms</span>');
        else
            $('#txnDetail #totalCost').html('<span class="font-green-dark">' + item.TotalCost + 'ms</span>');


        if (item.ActionExceptionType != undefined && item.ActionExceptionType != null && item.ActionExceptionType != "") {
            $('#txnDetail #actionExceptionType').html('<button type="button" class="btn btn-xs red-sunglo btnExceptionDetail">' + item.ActionExceptionType + '</button>' +
                '<div class="display-hide">' + item.ActionExceptionDetail + '</div>');
        }
        else
            $('#txnDetail #actionExceptionType').html('');

        if (item.ResultExceptionType != undefined && item.ResultExceptionType != null && item.ResultExceptionType != "") {
            $('#txnDetail #resultExceptionType').html('<button type="button" class="btn btn-xs red-sunglo btnExceptionDetail">' + item.ResultExceptionType + '</button>' +
                '<div class="display-hide">' + item.ResultExceptionDetail + '</div>');
        }
        else
            $('#txnDetail #resultExceptionType').html('');
    });

    $('#btnPlayPauseTxns').click(function () {
        if ($(this).find('i').hasClass('fa-play')) {
            timeline.setOptions({ showCurrentTime: true });
            refreshTimeline();

            $(this).html('<i class="fa fa-pause"></i>');
        }
        else {
            if (timelineTimer != null)
                clearTimeout(timelineTimer);
            timeline.setOptions({ showCurrentTime: false });
            $(this).html('<i class="fa fa-play"></i>');
        }
    });


    $('body').on('click', '.btnExceptionDetail', function (e) {
        var txt = $(this).next().text();

        $('#modalTextBody').show();
        $('#modalTextAreaContainer').hide();

        $('#modalTextHeader').text($(this).text());
        $('#modalTextBody').text(txt);
        $('#modalText').modal('show');

        return true;
    });


    var codeMirror = CodeMirror.fromTextArea(document.getElementById('modalTextArea'), {
        mode: 'text/x-sql',
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
    });
    $(tableNameFrmMonDtbTxnEvt + ' tbody').on('click', 'button.btnShowGridData', function () {
        var d = tableFrmMonDtbTxnEvt.row($(this).parents('tr')).data();

        if ($(this).hasClass('showQuery')) {
            $('#modalTextBody').hide();
            $('#modalTextAreaContainer').show();

            $('#modalTextHeader').text("SQL");
            $('#modalTextBody').html('');
            codeMirror.setValue(d.Query);

            setTimeout(function () {
                codeMirror.refresh();
            }, 200);
        }
        else if ($(this).hasClass('showOldJson')) {
            $('#modalTextBody').show();
            $('#modalTextAreaContainer').hide();

            var txt = getJsonObjForm(d);
            $('#modalTextHeader').text("SQL");
            $('#modalTextBody').html(txt);
        }
        else if ($(this).hasClass('showNewJson')) {
            $('#modalTextBody').show();
            $('#modalTextAreaContainer').hide();

            var txt = getJsonObjForm(d);
            $('#modalTextHeader').text("SQL");
            $('#modalTextBody').html(txt);
        }
        
        $('#modalText').modal('show');
    });

    /*============================================================================================*/
});



function refreshTimeline() {
    var stt = $('#cmbTxnFilterLogStatus').val().replace('-1', '');
    var usr = $('#cmbTxnFilterUsr').val().replace('-1', '');
    var scr = $('#cmbTxnFilterScr').val().replace('-1', '');
    var tntType = $('#cmbTxnFilterTntTyp').val().replace('-1', '');
    var tntId = $('#cmbTxnFilterTntId').val();

    Sigma.ajax({        
        url: "../../Base/Monitoring/GetLastMonActLst",
        data: { LogStatus: stt, username: usr, ScrItemId: scr, tntType: tntType, tntId: tntId },
        blockUI: false,
        showErrorToast: false,
        showSuccessToast: false,
        onSuccess: function (data) {
            var json = JSON.parse(data);
            var arr = json.monAct;
            var startDate = json.startDate;
            items = new vis.DataSet();
            for (i = 0; i <  arr.length; i++) {
                var log = arr[i];
                
                if (log.LogStatus == "RF") {
                    className = 'success';
                }
                else if (log.LogStatus == "AE" || log.LogStatus == "RE") {
                    className = 'error';
                }
                else if (log.LogStatus == "AS" || log.LogStatus == "AF" || log.LogStatus == "RS") {
                    className = 'running';
                }

                var endDateTime = log.ResultEndDateTime;
                if (log.ResultEndDateTime < log.ActionStartDateTime) {
                    if (log.LogStatus == "AS" || log.LogStatus == "AF" || log.LogStatus == "RS") {
                        endDateTime = new Date();
                    }
                    else if (log.LogStatus == "AE") {
                        endDateTime = log.ActionEndDateTime;
                    }
                }

                items.add({
                    id: log.LogId,
                    //group: truck,
                    start: log.ActionStartDateTime,
                    end: endDateTime,
                    content: log.Controller + '/' + log.Action,
                    className: className,
                    allData: log,
                    //style: "width:100px;"
                });
            }

            timeline.setItems(items);
            timeline.moveTo(new Date(-3.95 * 60 * 1000 + (new Date(startDate)).valueOf()));

            if (stt == "")
                $('div.vis-item.error div.vis-item-content').pulsate();
        }
    });


    

    timelineTimer = setTimeout(function () {
        refreshTimeline();
    }, $('#cmbTxnRefreshPeriod').val());
}



