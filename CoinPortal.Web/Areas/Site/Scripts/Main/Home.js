jQuery(document).ready(function () {

    var allCoinsTable;
    var allCoinsData = [];

    function initGrid() {
        var percentage = function (value) {
            var badge = 'metal';
            if (value > 0) {
                badge = 'success';
            }
            else {
                badge = 'danger';
            }

            //return '<span class="m-badge ' + badge + ' m-badge--wide">' + value + '%</span>';
            //return '<span class="m-badge m-badge--' + badge + ' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-' + badge + '">' + value + '%</span>';
            return '<span class="m--font-' + badge + ' m--font-bolder">' + value + '%</span >';
            //return '<h6 class="m--font-' + badge + '">' + value + '%</h6 >';
        };
    

        $('#allCoinsTable').mDatatable({
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/Home/GetTickerList'
                    }
                },
                pageSize: 10
            },

            // layout definition
            layout: {
                theme: 'default', // datatable theme
                class: '', // custom wrapper class
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                // height: 450, // datatable's body's fixed height
                footer: false // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            //search: {
            //    input: $('#generalSearch')
            //},

            // inline and bactch editing(cooming soon)
            // editable: false,

            // columns definition
            columns: [
                { field: 'Rank', title: "#", width: 40 },
                {
                    field: 'Name', title: "Name", template: function (row) {
                        //return '<span><div class="s-s-' + row.Id + ' currency-logo-sprite"></div>' +
                        //    row.Name + '</span>';

                        return '<div class="m-card-user m-card-user--sm">\
								<div class="s-s-' + row.Id + '" style="margin-right: 8px; margin-top: 4px; float: left;"></div>\
								<div class="m-card-user__details">\
									<span class="m-card-user__name">' + row.Name + '</span>\
								</div>\
							</div>';
                    }
                },
                { field: 'Symbol', title: "Symbol" },
                { field: 'PriceUsd', title: "USD" },
                { field: 'PriceBtc', title: "BTC" },
                { field: 'MarketCapUsd', title: "Market Cap", template: function (row) { return Util.toDollarFormat(row.MarketCapUsd); } },
                { field: 'Volume24HUsd', title: "Volume 24H", template: function (row) { return Util.toDollarFormat(row.Volume24HUsd); } },
                { field: 'PercentChange1H', title: "Change 1H", template: function (row) { return percentage(row.PercentChange1H); } },
                { field: 'PercentChange24H', title: "Change 24H", template: function (row) { return percentage(row.PercentChange24H); } },
                { field: 'PercentChange7D', title: "Change 7D", template: function (row) { return percentage(row.PercentChange7D); } },        
            ]
        }).on('m-datatable--on-reloaded', function (e) {
            var data = $('#allCoinsTable').mDatatable().originalDataSet;
            if (data) {
                var bitcoin = data.find(function (a) { return a.Id == 'bitcoin'; });

                if (bitcoin) {
                    $('#bitcoinPrice').text(Util.toDollarFormat(bitcoin.PriceUsd));
                }
            }
        });

        allCoinsTable = $('#allCoinsTable').mDatatable();
    }

    function fillGeneralData() {
        $.ajax({
            type: 'GET',
            url: '/Home/GetGlobalData',
        }).done(function (generalData) {
            $('#totalMarketCap1').text(Util.toDollarFormat(generalData.TotalMarketCapUsd));
            $('#totalMarketCap2').text(Util.toDollarFormat(generalData.TotalMarketCapUsd));
            $('#volume24h').text(Util.toDollarFormat(generalData.Total24HVolumeUsd));
            $('#bitcoinDominance').text(generalData.BitcoinPercentageOfMarketCap + '%');     
            $('#activeCryptoCurrencies').text(generalData.ActiveAssets + generalData.ActiveCurrencies);     
            $('#activeMarkets').text(generalData.ActiceMarkets);     
        }).fail(function (message) {
            console.log(message);
        }).always(function () {
            setTimeout(() => {
                fillGeneralData();
            }, 1000 * 10);
        });
    }

    function fillCoinsData() {
        allCoinsTable.reload();
        setTimeout(() => {
            fillCoinsData();
        }, 1000 * 10);


        //$.ajax({
        //    type: 'GET',
        //    url: '/Home/GetTickerList',
        //}).done(function (coins) {
        //    allCoinsData.push(coins[allCoinsData.length]);
        //    var bitcoin = coins.find(function (a) { return a.Id == 'bitcoin'; });

        //    if (bitcoin) {
        //        $('#bitcoinPrice').text(Util.toDollarFormat(bitcoin.PriceUsd));
        //    }

        //    //allCoinsData[0].Name = 'Deneme';

        //    allCoinsTable.dataSet = coins;
        //    allCoinsTable.reload();            
        //}).fail(function (message) {
        //    console.log(message);
        //}).always(function () {
        //    setTimeout(() => {
        //        fillCoinsData();
        //    }, 1000 * 5);
        //});
    }

    initGrid();
    fillGeneralData();
    fillCoinsData();
});