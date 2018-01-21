using CoinPortal.Business.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoinPortal.Service.MarketData.Collectors.Binance
{
    public class BinanceDataPicker : IMarketPicker
    {
        public long AccId { get; set; }
        public string PrvKey { get; set; }

        public Dictionary<string, string> Values { get; set; }

        public IList<CrrExc> GetPrices(IList<Tuple<string, string>> requestList)
        {
            var list = new List<CrrExc>();
            foreach (var req in requestList)
            {
                var exc = new CrrExc();
                exc.CrrKey = req.Item1;
                exc.Diff24h = 1494;
                exc.MaxPrice24h = 13017;
                exc.MinPrice24h = 11134;
                exc.Percent24h = (decimal)12.98;
                exc.Price = 12844;
                exc.PriceDatetime = DateTime.Now;
                exc.UnitCrrKey = req.Item2;
                exc.Volume24h = 46434;

                list.Add(exc);
            }

            return list;
        }
    }
}
