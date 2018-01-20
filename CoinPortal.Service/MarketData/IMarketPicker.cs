using CoinPortal.Business.Entity;
using Devia.Sigma.Business.Sys.Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoinPortal.Service.MarketData
{
    public interface IMarketPicker : ISgProvider
    {
        IList<CrrExc> GetPrices(IList<Tuple<String, String>> requestList);
    }

    public static class MarketConsts
    {
        public const String IS_SUPPORT_FOR_MULTIPLE_REQUEST = "IS_SUPPORT_FOR_MULTIPLE_REQUEST";
    }
}
