using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoinPortal.Business.CoinMarketCap
{
    public class GlobalData
    {
        [JsonProperty("total_market_cap_usd")]
        public Decimal TotalMarketCapUsd { get; set; }

        [JsonProperty("total_24h_volume_usd")]
        public Decimal Total24HVolumeUsd { get; set; }

        [JsonProperty("bitcoin_percentage_of_market_cap")]
        public Decimal BitcoinPercentageOfMarketCap { get; set; }

        [JsonProperty("active_currencies")]
        public Int32 ActiveCurrencies { get; set; }

        [JsonProperty("active_assets")]
        public Int32 ActiveAssets { get; set; }

        [JsonProperty("active_markets")]
        public Int32 ActiceMarkets { get; set; }

        [JsonProperty("last_updated")]
        public Int64 LastUpdated { get; set; }
    }
}
