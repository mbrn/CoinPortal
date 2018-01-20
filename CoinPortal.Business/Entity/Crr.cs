using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Entity.Field;
using Devia.Sigma.Db.Enumeration;
using System;

namespace CoinPortal.Business.Entity
{
    [SgDbEntityObjectAttribute("", "sg_crr", "crr", true)]
    public partial class Crr : SgDbEntity<Crr>
    {
        [SgDbEntityFieldAttribute("guid", SgDbEntityFieldType.Guid)]
        public String Guid { get; set; }

        [SgDbEntityFieldAttribute("status", SgDbEntityFieldType.Status)]
        public bool Status { get; set; }

        [SgDbEntityFieldAttribute("lastupdated", SgDbEntityFieldType.LastUpdated)]
        public Int64 Lastupdated { get; set; }

        [SgDbEntityFieldAttribute("crr_id", SgDbEntityFieldType.Key)]
        public Int64 CrrId { get; set; }

        [SgDbEntityFieldAttribute("crr_key", SgDbEntityFieldType.None)]
        public String CrrKey { get; set; }

        [SgDbEntityFieldAttribute("name", SgDbEntityFieldType.None)]
        public String Name { get; set; }

        [SgDbEntityFieldAttribute("country_code", SgDbEntityFieldType.None)]
        public String CountryCode { get; set; }

        [SgDbEntityFieldAttribute("crr_type", SgDbEntityFieldType.None)]
        public String CrrType { get; set; }

        [SgDbEntityFieldAttribute("circulation_supply", SgDbEntityFieldType.None)]
        public Int64 CirculationSupply { get; set; }

        [SgDbEntityFieldAttribute("max_supply", SgDbEntityFieldType.None)]
        public Int64 MaxSupply { get; set; }

        [SgDbEntityFieldAttribute("icon_code", SgDbEntityFieldType.None)]
        public String IconCode { get; set; }

        [SgDbEntityFieldAttribute("icon_image_id", SgDbEntityFieldType.None)]
        public Int64 IconImageId { get; set; }

    }
}
