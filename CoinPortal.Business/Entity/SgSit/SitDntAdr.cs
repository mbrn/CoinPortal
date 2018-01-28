using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Entity.Field;
using Devia.Sigma.Db.Enumeration;
using System;

namespace CoinPortal.Business.Entity.SgSit
{
    [SgDbEntityObjectAttribute("", "sg_sit", "sit_dnt_adr", true)]
    public partial class SitDntAdr : SgDbEntity<SitDntAdr>
    {
        [SgDbEntityFieldAttribute("guid", SgDbEntityFieldType.Guid)]
        public String Guid { get; set; }

        [SgDbEntityFieldAttribute("status", SgDbEntityFieldType.Status)]
        public bool Status { get; set; }

        [SgDbEntityFieldAttribute("lastupdated", SgDbEntityFieldType.LastUpdated)]
        public Int64 Lastupdated { get; set; }

        [SgDbEntityFieldAttribute("crr_key", SgDbEntityFieldType.None)]
        public String CrrKey { get; set; }

        [SgDbEntityFieldAttribute("name", SgDbEntityFieldType.None)]
        public String Name { get; set; }


        [SgDbEntityFieldAttribute("is_active", SgDbEntityFieldType.None)]
        public bool IsActive { get; set; }

        [SgDbEntityFieldAttribute("address", SgDbEntityFieldType.None)]
        public String Address { get; set; }

        [SgDbEntityFieldAttribute("has_tag", SgDbEntityFieldType.None)]
        public bool HasTag { get; set; }

        [SgDbEntityFieldAttribute("tag", SgDbEntityFieldType.None)]
        public String Tag { get; set; }

        [SgDbEntityFieldAttribute("order_no", SgDbEntityFieldType.None)]
        public Int16 OrderNo { get; set; }

    }
}
