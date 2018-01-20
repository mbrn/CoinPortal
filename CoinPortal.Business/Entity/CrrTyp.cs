using Devia.Sigma.Core.Types;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Entity.Field;
using Devia.Sigma.Db.Enumeration;
using System;

namespace CoinPortal.Business.Entity
{
    [SgDbEntityObjectAttribute("", "sg_crr", "crr_typ", true)]
    public partial class CrrTyp : SgDbEntity<CrrTyp>
    {
        [SgDbEntityFieldAttribute("guid", SgDbEntityFieldType.Guid)]
        public String Guid { get; set; }

        [SgDbEntityFieldAttribute("status", SgDbEntityFieldType.Status)]
        public bool Status { get; set; }

        [SgDbEntityFieldAttribute("lastupdated", SgDbEntityFieldType.LastUpdated)]
        public Int64 Lastupdated { get; set; }

        [SgDbEntityFieldAttribute("crr_type", SgDbEntityFieldType.None)]
        public String CrrType { get; set; }

        [SgDbEntityFieldAttribute("name", SgDbEntityFieldType.None)]
        public String Name { get; set; }

    }
}
