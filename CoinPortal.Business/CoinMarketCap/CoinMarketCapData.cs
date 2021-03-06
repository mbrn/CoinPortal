﻿using Devia.Sigma.Core.Serialization;
using Devia.Sigma.Core.Threading;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace CoinPortal.Business.CoinMarketCap
{
    public static class CoinMarketCapData
    {
        public static GlobalData GlobalData { get; private set; }
        public static IList<Ticker> TickerList { get; private set; }

        public static void StartWorkers()
        {
            SgWorker.Cron(() =>
            {
                GlobalData = TakeGlobalData()??GlobalData;
            }, TimeSpan.FromSeconds(10));

            SgWorker.Cron(() =>
            {
                TickerList = TakeTickers()??TickerList;
            }, TimeSpan.FromSeconds(30));
        }

        private static GlobalData TakeGlobalData()
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    var strData = client.DownloadString("https://api.coinmarketcap.com/v1/global/");
                    var result = SgSerializer.Deserialize<GlobalData>(strData);
                    return result;
                }
            }
            catch(Exception ex)
            {
                ex.SgLogError();
                return null;
            }
        }

        private static IList<Ticker> TakeTickers()
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    var strData = client.DownloadString("https://api.coinmarketcap.com/v1/ticker/");
                    var result = SgSerializer.Deserialize<IList<Ticker>>(strData);
                    return result;
                }
            }
            catch (Exception ex)
            {
                ex.SgLogError();
                return null;
            }
        }
    }

    
}
