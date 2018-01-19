using Devia.Sigma.Business.Auth;
using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Auth.Tenancy;
using Devia.Sigma.Business.Commerce.Product;
using Devia.Sigma.Business.Commerce.Product.Entity;
using Devia.Sigma.Business.Sys.Provider;
using Devia.Sigma.Core.Exceptions;
using Devia.Sigma.Db.Entity;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Auth.Tenancy
{
    public class TenancyController : SgControllerBase
    {
        private const String TNT_PRD_KEY = "TNTPRD";

        // GET: Base/Tenancy
        public ActionResult Index()
        {
            return View();
        }

        #region FrmTntTyp

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmTntTypLst()
        {
            return FrmTntTyp.SelectAll(null, a => SgOrder.Order.Asc(a.TypName)).SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmTntTyp(FrmTntTyp obj)
        {
            SgDbTxn.Auto(() =>
            {
                if(FrmTntTyp.SelectFirst(a => a.TypCode == obj.TypCode) != null)
                {
                    throw new SgException(obj.TypCode + " tip kodu zaten kullanılıyor!");
                }

                obj.Insert();                
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmTntTyp(FrmTntTyp obj)
        {
            SgDbTxn.Auto(() =>
            {
                if (FrmTntTyp.SelectFirst(a => a.TypCode == obj.TypCode && a.Guid != obj.Guid) != null)
                {
                    throw new SgException(obj.TypCode + " tip kodu zaten kullanılıyor!");
                }

                obj.Update();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmTntTyp(FrmTntTyp obj)
        {
            SgDbTxn.Auto(() =>
            {
                obj.Delete();
            });
        }

        #endregion

        #region Pck

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmTntTypCntLst()
        {
            return FrmTntTypCnt.SelectAll().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmTntTypDetail(String typCode)
        {
            var result = TntTypDetail.Get(typCode);
            if (result == null)
                return "";
            else return result.SgSerializeToJson();
        }

        public String AddFrmTntTypPck(FrmTntTypPck pck)
        {
            return SgDbTxn.Auto(() =>
            {
                #region Once ürün tanımlayalım

                var prd = new FrmCmrPrd();
                prd.PrvId = SgProviderManager.GetProviderId(TNT_PRD_KEY);
                if(prd.PrvId == 0)
                    throw new SgException("Provider tablosunda {0} keyi ile product tenant product provider tanımı yapılmalıdır".SgFormat(TNT_PRD_KEY));
                prd.IsActive = false;
                prd.PrdName = pck.PckName;                
                prd.TaxRate = 18; // KDV Orani                                
                var product = SgProduct.Create(prd);
                product.AddStock(0, "949", 0, 0, 0, -1);

                #endregion

                pck.PrdId = product.Prd.PrdId;
                pck.Insert();

                var cntLst = FrmTntTypPckCnt.SelectAll(a => a.TypCode == pck.TypCode);
                foreach(var cnt in cntLst)
                {
                    var val = new FrmTntTypPckCntVal();
                    val.CntVal = "";
                    val.CntViewVal = "";
                    val.PckCntId = cnt.PckCntId;
                    val.PckId = pck.PckId;
                    val.Insert();
                }

                return TntTypPckDetail.Get(pck, prd).SgSerializeToJson();                
            });
        }

        public String UpdateFrmTntTypPck(FrmTntTypPck pck, long[] roles, FrmCmrPrd prd)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                pck.Update();

                if (roles == null) roles = new long[0];
                var oldRoles = FrmTntAutPckRol.SelectAll(a => a.PckId == pck.PckId);
                foreach (int rol in roles)
                {
                    if (oldRoles.Exists(r => r.RoleId == rol) == false)
                    {
                        FrmTntAutPckRol usrRol = new FrmTntAutPckRol();
                        usrRol.RoleId = rol;
                        usrRol.PckId = pck.PckId;
                        usrRol.Insert();
                    }
                }

                foreach (var rol in oldRoles.FindAll(a => roles.Contains(a.RoleId) == false))
                {
                    rol.Delete();
                }

                var product = SgProduct.Get(prd.PrdId);
                product.UpdateProduct(prd);

                return TntTypPckDetail.Get(pck, prd).SgSerializeToJson();
            });
        }

        public void DeleteFrmTntTypPck(FrmTntTypPck pck)
        {
            SgDbTxn.Auto(() =>
            {
                pck.Delete();
                FrmTntTypPckCntVal.DeleteAll(a => a.PckId == pck.PckId);
                FrmTntAutPckRol.DeleteAll(a => a.PckId == pck.PckId);
            });
        }

        public String AddFrmTntTypPckCnt(FrmTntTypPckCnt cnt)
        {
            return SgDbTxn.Auto(() =>
            {
                cnt.Insert();
                var valLst = new List<FrmTntTypPckCntVal>();
                foreach(var pck in FrmTntTypPck.SelectAll(a => a.TypCode == cnt.TypCode))
                {
                    var val = new FrmTntTypPckCntVal();
                    val.CntVal = "";
                    val.CntViewVal = "";
                    val.PckCntId = cnt.PckCntId;
                    val.PckId = pck.PckId;
                    val.Insert();

                    valLst.Add(val);
                }

                return new { Cnt = cnt, ValLst = valLst }.SgSerializeToJson();                
            });
        }

        public String UpdateFrmTntTypPckCnt(FrmTntTypPckCnt cnt)
        {
            cnt.Update();
            return cnt.SgSerializeToJson();
        }

        public void DeleteFrmTntTypPckCnt(FrmTntTypPckCnt cnt)
        {
            SgDbTxn.Auto(() =>
            {
                cnt.Delete();
                FrmTntTypPckCntVal.DeleteAll(a => a.PckCntId == cnt.PckCntId);
            });
        }

        public String UpdateFrmTntTypPckCntVal(FrmTntTypPckCntVal val)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var cnt = FrmTntTypPckCnt.SelectFirst(a => a.PckCntId == val.PckCntId);
                if (cnt.CntCode == SgTenant.ValueKeys.PRICE)
                {
                    var pck = FrmTntTypPck.SelectFirst(a => a.PckId == val.PckId);
                    var product = SgProduct.Get(pck.PrdId);
                    product.StkLst[0].Amnt = val.CntVal.SgToDecimal();
                    product.UpdateStock(product.StkLst[0]);
                }

                val.Update();

                return val.SgSerializeToJson();
            });
        }

        #endregion

        #region Auth

        public String GetAuthData(String tntType)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var result = new
                {
                    RoleList = FrmTntAutRol.SelectAll(a => a.TntType == tntType),
                    ScreenList = FrmTntAutItmScr.SelectAll(a => a.TntType == tntType),
                    ItemList = FrmTntAutItmCst.SelectAll(a => a.TntType == tntType)
                };

                return result.SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String SaveFrmTntAutRol(FrmTntAutRol role)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                if (FrmTntAutRol.Exists(a => a.TntType == role.TntType) == false)
                {
                    role.IsDefault = true;
                }

                role.Insert();
                return role.SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String FrmTntAutRolSetDefault(FrmTntAutRol role)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var oldDefault = FrmTntAutRol.SelectFirst(a => a.IsDefault == true && a.TntType == role.TntType);
                if(oldDefault != null)
                {
                    oldDefault.IsDefault = false;
                    oldDefault.Update();
                }

                role.IsDefault = true;
                role.Update();
                return new { newDefault = role, oldDefault = oldDefault }.SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String UpdateFrmTntAutRol(FrmTntAutRol role)
        {
            role.Update();
            return role.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmTntAutRol(FrmTntAutRol role)
        {
            SgDbTxn.AutoMerge(() =>
            {
                role.Delete();
                FrmTntAutRolItm.DeleteAll(a => a.RoleId == role.RoleId);
                FrmTntAutPckRol.DeleteAll(a => a.RoleId == role.RoleId);
                FrmTntAutUsrRol.DeleteAll(a => a.RoleId == role.RoleId);
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String SaveFrmTntAutItmScr(FrmTntAutItmScr scr)
        {
            scr.Insert();
            return scr.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String UpdateFrmTntAutItmScr(FrmTntAutItmScr scr)
        {
            scr.Update();
            return scr.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmTntAutItmScr(FrmTntAutItmScr scr)
        {
            SgDbTxn.AutoMerge(() =>
            {
                scr.Delete();
                if (scr.NodeType == "L")
                {
                    var subScrList = FrmTntAutItmScr.SelectAll(a => a.ParentId == scr.ItemId);
                    foreach(var subScr in subScrList)
                    {
                        DeleteFrmTntAutItmScr(subScr);
                    }
                }                    
                else if(scr.NodeType == "N")
                {
                    FrmTntAutRolItm.DeleteAll(a => a.ItemId == scr.ItemId && a.ItemType == SgAuthManager.ItemType.SCREEN);
                }
            });            
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String SetDefaultFrmTntAutItmScr(FrmTntAutItmScr scr)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var oldDefault = FrmTntAutItmScr.SelectFirst(a => a.TntType == scr.TntType && a.IsDefaultStartScreen == true);
                if(oldDefault != null)
                {
                    oldDefault.IsDefaultStartScreen = false;
                    oldDefault.Update();
                }

                scr.IsDefaultStartScreen = true;
                scr.Update();

                return new { scr = scr, oldDefault = oldDefault }.SgSerializeToJson();
            });
        }
        
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String MoveFrmTntAutItmScr(FrmTntAutItmScr scr, int oldParentId, int newParentId, short newPosition)
        {
            return SgDbTxn.AutoMerge(() =>
            {
                if (oldParentId == newParentId)
                {
                    scr.Priority = (short)(newPosition + 1);
                    scr.Update();

                    var others = FrmTntAutItmScr.SelectAll(a => a.ParentId == scr.ParentId && a.ItemId != scr.ItemId && a.TntType == scr.TntType);
                    short i = 1;
                    foreach(var other in others.OrderBy(a => a.Priority).ToList())
                    {
                        if (i == scr.Priority)
                            i++;

                        other.Priority = i;
                        other.Update();

                        i++;
                    }
                }
                else
                {
                    scr.Priority = (short)(newPosition + 1);
                    scr.ParentId = newParentId;
                    scr.Update();

                    var others = FrmTntAutItmScr.SelectAll(a => a.ParentId == scr.ParentId && a.ItemId != scr.ItemId && a.TntType == scr.TntType);
                    short i = 1;
                    foreach (var other in others.OrderBy(a => a.Priority).ToList())
                    {
                        if (i == scr.Priority)
                            i++;

                        other.Priority = i;
                        other.Update();

                        i++;
                    }

                    others = FrmTntAutItmScr.SelectAll(a => a.ParentId == oldParentId && a.TntType == scr.TntType).OrderBy(u=> u.Priority).ToList();
                    for(i = 0; i < others.Count; i++)
                    {
                        others[i].Priority = (short) (i + 1);
                        others[i].Update();
                    }
                }

                return FrmTntAutItmScr.SelectAll(a => a.TntType == scr.TntType).SgSerializeToJson();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String SaveFrmTntAutItmCst(FrmTntAutItmCst item)
        {
            item.Insert();
            return item.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String UpdateFrmTntAutItmCst(FrmTntAutItmCst item)
        {
            item.Update();
            return item.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmTntAutItmCst(FrmTntAutItmCst item)
        {
            SgDbTxn.AutoMerge(() =>
            {
                item.Delete();
                FrmTntAutRolItm.DeleteAll(a => a.ItemId == item.ItemId && a.ItemType == SgAuthManager.ItemType.CUSTOM);
            });
        }


        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetRoleItemList(Int64 roleId)
        {
            return FrmTntAutRolItm.SelectAll(a => a.RoleId == roleId).SgSerializeToJson();            
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateRoleItemList(Int64 roleId, List<Int64> scrLst, List<Int64> cstLst)
        {
            SgDbTxn.AutoMerge(() =>
            {
                var oldScrLst = FrmTntAutRolItm.SelectAll(a => a.RoleId == roleId && a.ItemType == "S").Select(a => a.ItemId).ToList();
                if (scrLst == null) scrLst = new List<long>();
                foreach(var delete in oldScrLst.FindAll(o => scrLst.Contains(o) == false))
                {
                    FrmTntAutRolItm.DeleteAll(a => a.RoleId == roleId && a.ItemType == "S" && a.ItemId == delete);
                }

                foreach (var insert in scrLst.FindAll(n => oldScrLst.Contains(n) == false))
                {
                    var obj = new FrmTntAutRolItm();
                    obj.RoleId = roleId;
                    obj.ItemType = "S";
                    obj.ItemId = insert;
                    obj.Insert();                                        
                }


                var oldCstLst = FrmTntAutRolItm.SelectAll(a => a.RoleId == roleId && a.ItemType == "C").Select(a => a.ItemId).ToList();
                if (cstLst == null) cstLst = new List<long>();
                foreach (var delete in oldCstLst.FindAll(o => cstLst.Contains(o) == false))
                {
                    FrmTntAutRolItm.DeleteAll(a => a.RoleId == roleId && a.ItemType == "C" && a.ItemId == delete);
                }

                foreach (var insert in cstLst.FindAll(n => oldCstLst.Contains(n) == false))
                {
                    var obj = new FrmTntAutRolItm();
                    obj.RoleId = roleId;
                    obj.ItemType = "C";
                    obj.ItemId = insert;
                    obj.Insert();
                }
            });
        }

        #endregion

        #region FrmTntTypOpt

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String UpdateFrmTntTypOpt(FrmTntTypOpt opt)
        {
            return SgDbTxn.Auto(() =>
            {
                if(FrmTntTypOpt.Exists(a => a.TypCode == opt.TypCode))
                {
                    opt.Update();
                }
                else
                {
                    opt.Insert();
                }

                return opt.SgSerializeToJson();
            });
        }

        #endregion
    }

    public class TntTypDetail
    {
        public FrmTntTyp Typ { get; set; }
        public FrmTntTypOpt Opt { get; set; }
        public List<FrmTntTypCnt> CntLst { get; set; }
        public List<FrmTntTypPckCnt> PckCntLst { get; set; }
        public List<TntTypPckDetail> PckLst { get; set; }
        

        public static TntTypDetail Get(String typCode)
        {
            var result = new TntTypDetail();

            result.Typ =  FrmTntTyp.SelectFirst(a => a.TypCode == typCode);
            if (result.Typ == null)
                return null;

            result.Opt = FrmTntTypOpt.SelectFirst(a => a.TypCode == typCode);
            result.PckCntLst = FrmTntTypPckCnt.SelectAll(a => a.TypCode == typCode);
            result.CntLst = new List<FrmTntTypCnt>();
            foreach(var pckCnt in result.PckCntLst)
            {
                var cnt = FrmTntTypCnt.SelectFirst(a => a.CntCode == pckCnt.CntCode);
                if (cnt != null)
                    result.CntLst.Add(cnt);
            }

            result.PckLst = new List<TntTypPckDetail>();
            foreach (var pck in FrmTntTypPck.SelectAll(a => a.TypCode == typCode))
            {
                var pckDetail = TntTypPckDetail.Get(pck);
                result.PckLst.Add(pckDetail);
            }

            return result;
        }
    }

    public class TntTypPckDetail
    {
        public FrmTntTypPck Pck { get; set; }        
        public List<FrmTntTypPckCntVal> ValLst { get; set; }
        public List<long> RolLst { get; set; }
        public FrmCmrPrd Prd { get; set; }

        public static TntTypPckDetail Get(FrmTntTypPck pck)
        {            
            var prd = SgProduct.Get(pck.PrdId).Prd;
            return Get(pck, prd);
        }

        public static TntTypPckDetail Get(FrmTntTypPck pck, FrmCmrPrd prd)
        {
            var result = new TntTypPckDetail();

            result.Pck = pck;
            result.Prd = prd;
            result.ValLst = FrmTntTypPckCntVal.SelectAll(a => a.PckId == pck.PckId);
            result.RolLst = FrmTntAutPckRol.SelectAll(a => a.PckId == pck.PckId).Select(a => a.RoleId).ToList();

            return result;
        }
    }    
}