using Devia.Sigma.Business.Language.Entity;
using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Script.Services;
using System.Linq;
using Devia.Sigma.Web.MvcAttribute;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Language
{
    public class FrmLngTxtController : SgControllerBase
    {
        // GET: FrmLngTxt
        public ActionResult Index()
        {
            return View();
        }

        [SgAuth(SgAuthType.LoginUsers)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]       
        public String GetFrmLngTxtList()
        {
            var txtLst = FrmLngTxt.SelectAll();
            var trnLst = new List<FrmLngTxtTrn>();

            foreach(var txt in txtLst)
            {
                trnLst.AddRange(FrmLngTxtTrn.SelectAll(a => a.TxtId == txt.TxtId));
            }

            var x = new { txtLst = txtLst, trnLst = trnLst };

            return x.SgSerializeToJson();
        }

        [SgAuth(SgAuthType.LoginUsers)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmLngTxt(FrmLngTxt txt, FrmLngTxtTrn[] trnLst)
        {
            SgDbTxn.Auto(() =>
                {
                    txt.Insert();
                    foreach(var trn in trnLst)
                    {
                        trn.TxtId = txt.TxtId;
                        trn.TxtKey = txt.TxtKey;
                        trn.Insert();
                    }
                });
        }

        [SgAuth(SgAuthType.LoginUsers)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmLngTxt(FrmLngTxt txt, FrmLngTxtTrn[] trnLst)
        {
            SgDbTxn.Auto(() =>
            {
                if (txt.Lastupdated == 0)
                {
                    txt = FrmLngTxt.SelectFirst(a => a.TxtKey == txt.TxtKey);
                }
                else
                {
                    txt.Update();
                }

                foreach (var trn in trnLst)
                {
                    var oldObj = FrmLngTxtTrn.SelectFirst(a => a.TxtKey == txt.TxtKey && a.LngKey == trn.LngKey);
                    if (oldObj == null)
                    {
                        trn.TxtId = txt.TxtId;
                        trn.TxtKey = txt.TxtKey;
                        trn.Insert();
                    }
                    else
                    {
                        oldObj.Translation = trn.Translation;
                        oldObj.Update();
                    }
                    
                }
            });
        }

        [SgAuth(SgAuthType.LoginUsers)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmLngTxt(long txtId )
        {
            SgDbTxn.Auto(() =>
            {
                FrmLngTxt.DeleteAll(a => a.TxtId == txtId);
                FrmLngTxtTrn.DeleteAll(a => a.TxtId == txtId);
            });
        }

        [SgAuth(SgAuthType.LoginUsers)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetLangText(String txtKey)
        {            
            var trnLst = FrmLngTxtTrn.SelectAll().FindAll(a => a.TxtKey == txtKey);

            if (trnLst.Count == 0)
            {
                return "".SgSerializeToJson();
            }

            var t = new { id = txtKey, text = txtKey, TxtKey = txtKey, trnLst = trnLst.Select(a => new { LngKey = a.LngKey, Language = GetLanguage(a.LngKey), Translation = a.Translation }) };

            return t.SgSerializeToJson();
        }

        [SgAuth(SgAuthType.LoginUsers)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String SearchLangText(String term)
        {
            var txtLst = FrmLngTxtTrn.SelectAll().FindAll(a => a.Translation.ToLower().Contains(term.ToLower())).Select(a => a.TxtKey).Distinct();
            var resultList = new List<Object>();
            foreach (var txtKey in txtLst)
            {
                var trnList = FrmLngTxtTrn.SelectAll(a => a.TxtKey == txtKey);
                var t = new { id = txtKey, text = txtKey, TxtKey = txtKey, trnLst = trnList.Select(a => new { Language = GetLanguage(a.LngKey), Translation = a.Translation }) };
                resultList.Add(t);
            }
            return resultList.SgSerializeToJson();
        }

        [SgAuth(SgAuthType.LoginUsers)]
        private String GetLanguage(String lngKey)
        {
            var obj = FrmLng.SelectFirst(a => a.LngKey == lngKey);
            if (obj == null)
            {
                return String.Empty;
            }
            else
            {
                return obj.LngName;
            }
        }

        
    }
}
