using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Entity.Field;
using Devia.Sigma.Db.Enumeration;
using System;

namespace CoinPortal.Business.Entity
{
    [SgDbEntityObjectAttribute("", "sg_crr", "crr_mrk", true)]
    public partial class CrrMrk : SgDbEntity<CrrMrk>
    {
        [SgDbEntityFieldAttribute("guid", SgDbEntityFieldType.Guid)]
        public String Guid { get; set; }

        [SgDbEntityFieldAttribute("status", SgDbEntityFieldType.Status)]
        public bool Status { get; set; }

        [SgDbEntityFieldAttribute("lastupdated", SgDbEntityFieldType.LastUpdated)]
        public Int64 Lastupdated { get; set; }

        [SgDbEntityFieldAttribute("mrk_id", SgDbEntityFieldType.None)]
        public Int64 MrkId { get; set; }

        [SgDbEntityFieldAttribute("name", SgDbEntityFieldType.None)]
        public String Name { get; set; }

        [SgDbEntityFieldAttribute("is_active", SgDbEntityFieldType.None)]
        public bool IsActive { get; set; }

        [SgDbEntityFieldAttribute("url", SgDbEntityFieldType.None)]
        public String Url { get; set; }

        [SgDbEntityFieldAttribute("twitter_address", SgDbEntityFieldType.None)]
        public String TwitterAddress { get; set; }

        [SgDbEntityFieldAttribute("facebook_address", SgDbEntityFieldType.None)]
        public String FacebookAddress { get; set; }

        [SgDbEntityFieldAttribute("mrk_prv_id", SgDbEntityFieldType.None)]
        public Int64 MrkPrvId { get; set; }

    }
}
