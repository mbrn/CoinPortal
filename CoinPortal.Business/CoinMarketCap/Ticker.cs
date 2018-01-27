using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoinPortal.Business.CoinMarketCap
{
    public class Ticker
    {
        [JsonProperty("id")]
        public String Id { get; set; }

        [JsonProperty("name")]
        public String Name { get; set; }

        [JsonProperty("symbol")]
        public String Symbol { get; set; }

        [JsonProperty("rank")]
        public Int32 Rank { get; set; }

        [JsonProperty("price_usd")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal PriceUsd { get; set; }

        [JsonProperty("price_btc")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal PriceBtc { get; set; }

        [JsonProperty("24h_volume_usd")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal Volume24HUsd { get; set; }

        [JsonProperty("market_cap_usd")]        
        public Decimal MarketCapUsd { get; set; }

        [JsonProperty("available_supply")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal AvailableSupply { get; set; }

        [JsonProperty("total_supply")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal TotalSupply { get; set; }

        [JsonProperty("max_supply")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal MaxSupply { get; set; }

        [JsonProperty("percent_change_1h")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal PercentChange1H { get; set; }

        [JsonProperty("percent_change_24h")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal PercentChange24H { get; set; }

        [JsonProperty("percent_change_7d")]
        [JsonConverter(typeof(CoinMarketCapDecimalConverter))]
        public Decimal PercentChange7D { get; set; }

        [JsonProperty("last_updated")]
        public Int64 LastUpdated { get; set; }
    }
}
