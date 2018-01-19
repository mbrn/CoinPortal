using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Business.Sys.Provider.Entity;
using System.Collections.Generic;
using Devia.Sigma.Db.Transaction;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Provider
{
	public class FrmPrvAccController : SgControllerBase
	{
		// GET: FrmPrvAcc
		public ActionResult Index()
		{
			return View();
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public String GetFrmPrvAccList()
		{
			return FrmPrvAcc.SelectAll().SgSerializeToJson();
		}

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmPrvAcc(String accName)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                FrmPrvAcc prvAcc = FrmPrvAcc.SelectFirst(u => u.AccName == accName);
                List<FrmPrvAccFldVal> prvAccFlds = null;
                List<FrmPrvFld> prvFlds = null;
                if (prvAcc != null)
                {
                    prvAccFlds = FrmPrvAccFldVal.SelectAll(u => u.AccId == prvAcc.AccId);
                    prvFlds = FrmPrvFld.SelectAll(u => u.PrvId == prvAcc.PrvId && u.IsVisible == true);

                }
                return new { prvAcc = prvAcc, prvAccFlds = prvAccFlds, prvFlds = prvFlds }.SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmPrvFields(Int64 prvId)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var prvFlds = FrmPrvFld.SelectAll(u => u.PrvId == prvId && u.IsVisible == true);
                FrmPrvAcc prvAcc = null;
                FrmPrvAccFldVal prvAccFlds = null;

                return new { prvAcc = prvAcc, prvAccFlds = prvAccFlds, prvFlds = prvFlds }.SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void SaveFrmPrvAcc(FrmPrvAcc acc, List<FrmPrvAccFldVal> fields)
		{
            SgDbTxn.AutoMerge(() =>
            {
                acc.Insert();
                if (fields != null)
                {
                    var prvFlds = FrmPrvFld.SelectAll(u => u.PrvId == acc.PrvId && u.IsVisible == true);

                    foreach (var item in fields)
                    {
                        var prvAccFld = prvFlds.Find(u => u.FldKey == item.FldKey);
                        if (prvAccFld != null)
                        {
                            item.AccId = acc.AccId;
                            item.Insert();
                        }
                    }
                }
            });

           
		}

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void UpdateFrmPrvAcc(FrmPrvAcc acc, List<FrmPrvAccFldVal> fields)
		{
            SgDbTxn.AutoMerge(() =>
            {
                acc.Update();
                if (fields != null)
                {
                    var oldprvAccFlds = FrmPrvAccFldVal.SelectAll(u => u.AccId == acc.AccId);
                    foreach (var item in oldprvAccFlds.FindAll(o => fields.Exists(u => u.FldKey == o.FldKey) == false))
                    {
                        item.Delete();
                    }
                    foreach (var item in fields.FindAll(o => oldprvAccFlds.Exists(u => u.FldKey == o.FldKey) == false))
                    {
                        item.AccId = acc.AccId;
                        item.Insert();
                    }
                   
                    foreach (var item in oldprvAccFlds .FindAll(o => fields.Exists(u => u.FldKey == o.FldKey) == true))
                    {
                        item.Value = fields.Find(u => u.FldKey == item.FldKey).Value;
                        item.Update();
                    }
                }
            });
        }

		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public void DeleteFrmPrvAcc(FrmPrvAcc obj)
		{
			obj.Delete();
		}
	}
}
