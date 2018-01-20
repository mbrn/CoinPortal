using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Entity.Field;
using Devia.Sigma.Db.Enumeration;
using System;

namespace CoinPortal.Business.Entity
{
    [SgDbEntityObjectAttribute("", "sg_crr", "crr_mrk_exc")]
    public partial class CrrMrkExc : SgDbEntity<CrrMrkExc>
    {
        [SgDbEntityFieldAttribute("guid", SgDbEntityFieldType.Guid)]
        public String Guid { get; set; }

        [SgDbEntityFieldAttribute("status", SgDbEntityFieldType.Status)]
        public bool Status { get; set; }

        [SgDbEntityFieldAttribute("lastupdated", SgDbEntityFieldType.LastUpdated)]
        public Int64 Lastupdated { get; set; }

        [SgDbEntityFieldAttribute("mrk_id", SgDbEntityFieldType.None)]
        public Int64 MrkId { get; set; }

        [SgDbEntityFieldAttribute("crr_key", SgDbEntityFieldType.None)]
        public String CrrKey { get; set; }

        [SgDbEntityFieldAttribute("unit_crr_key", SgDbEntityFieldType.None)]
        public String UnitCrrKey { get; set; }

        [SgDbEntityFieldAttribute("is_active", SgDbEntityFieldType.None)]
        public bool IsActive { get; set; }

        [SgDbEntityFieldAttribute("min_update_period", SgDbEntityFieldType.None)]
        public Int64 MinUpdatePeriod { get; set; }

        [SgDbEntityFieldAttribute("price", SgDbEntityFieldType.None)]
        public Int64 Price { get; set; }

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

        [SgDbEntityFieldAttribute("last_update_datetime", SgDbEntityFieldType.None)]
        public DateTime LastUpdateDatetime { get; set; }

        [SgDbEntityFieldAttribute("last_request_datetime", SgDbEntityFieldType.None)]
        public DateTime LastRequestDatetime { get; set; }
    }
}
