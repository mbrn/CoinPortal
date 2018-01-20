using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Entity.Field;
using Devia.Sigma.Db.Enumeration;
using System;

namespace CoinPortal.Business.Entity
{
    [SgDbEntityObjectAttribute("", "sg_crr", "crr_exc")]
    public partial class CrrExc : SgDbEntity<CrrExc>
    {
        [SgDbEntityFieldAttribute("guid", SgDbEntityFieldType.Guid)]
        public String Guid { get; set; }

        [SgDbEntityFieldAttribute("status", SgDbEntityFieldType.Status)]
        public bool Status { get; set; }

        [SgDbEntityFieldAttribute("lastupdated", SgDbEntityFieldType.LastUpdated)]
        public Int64 Lastupdated { get; set; }

        [SgDbEntityFieldAttribute("exc_id", SgDbEntityFieldType.None)]
        public Int64 ExcId { get; set; }

        [SgDbEntityFieldAttribute("crr_key", SgDbEntityFieldType.None)]
        public String CrrKey { get; set; }

        [SgDbEntityFieldAttribute("unit_crr_key", SgDbEntityFieldType.None)]
        public String UnitCrrKey { get; set; }

        [SgDbEntityFieldAttribute("mrk_id", SgDbEntityFieldType.None)]
        public Int64 MrkId { get; set; }

        [SgDbEntityFieldAttribute("price", SgDbEntityFieldType.None)]
        public Int64 Price { get; set; }

        [SgDbEntityFieldAttribute("price_datetime", SgDbEntityFieldType.None)]
        public DateTime PriceDatetime { get; set; }

        [SgDbEntityFieldAttribute("min_price24h", SgDbEntityFieldType.None)]
        public Int64 MinPrice24h { get; set; }

        [SgDbEntityFieldAttribute("max_price24h", SgDbEntityFieldType.None)]
        public Int64 MaxPrice24h { get; set; }

        [SgDbEntityFieldAttribute("volume24h", SgDbEntityFieldType.None)]
        public Int64 Volume24h { get; set; }

        [SgDbEntityFieldAttribute("diff24h", SgDbEntityFieldType.None)]
        public Int64 Diff24h { get; set; }

        [SgDbEntityFieldAttribute("percent24h", SgDbEntityFieldType.None)]
        public Decimal Percent24h { get; set; }

    }
}
