using Devia.Sigma.Business.Parameter.Entity;
using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using System;
using System.Web.Mvc;
using System.Web.Script.Services;
using Devia.Sigma.Db.Query;
using Devia.Sigma.Db.Common;
using System.Collections.Generic;
using Devia.Sigma.Core.Exceptions;
using System.IO;
using System.Configuration;
using Devia.Sigma.Business.Auth;
using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Document;
using Devia.Sigma.Business.Auth.Tenancy;
using Devia.Sigma.Business.Auth.User;
using Devia.Sigma.Business.Sys.Provider.Entity;
using Devia.Sigma.Business.Sys.Provider;
using Devia.Sigma.Web.MvcAttribute;
using System.Web;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Auth.User
{
    public class FrmTntAutUsrController : SgControllerBase
    {
        // GET: FrmTntAutUsr
        public ActionResult Index()
        {
            return View(SgAuthManager.GetAvailableRoles());
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetFrmTntAutUsrList(int isActive)
        {
            var prm = new List<SgDbParameter>();
            prm.Add(SgDbParameter.New("P_TNT_ID", SgSession.Current.Tenant.TntId.ToString()));
            if (isActive != -1)
                prm.Add(SgDbParameter.New("P_IS_ACTIVE", isActive.ToString()));

            return TenantUser.SelectAll(prm.ToArray()).SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmTntAutUsr(FrmTntAutUsr usr, bool isActive, long[] roles, String img)
        {
            if (SgSession.Current.Tenant.Opt.AddUser == false)
                throw new SgException("Doğrudan kullanıcı ekleme yetkiniz bulunmamaktadır.");

            SgDbTxn.AutoMerge(() =>
            {
                if (String.IsNullOrEmpty(img))
                {
                    usr.ImgId = 0;
                }
                else if (img.StartsWith("data:image")) // Yani resim güncellenmişse
                {
                    if (usr.ImgId == 0)
                    {
                        usr.ImgId = SgDocManager.AddDoc(img);
                    }
                    else
                    {
                        SgDocManager.UpdateDoc(usr.ImgId, img);
                    }
                }

                var autTypes = FrmPrv.SelectAll(u => u.PrvType == SgProviderManager.ProviderType.Auth);
                if (autTypes.Count == 1)
                {
                    usr.AutType = autTypes[0].PrvKey;
                }
                else if (autTypes.Count > 1)
                {
                    if (autTypes.Find(u => u.PrvKey == usr.AutType) == null)
                    {
                        throw new SgException("Lütfen Kullanıcının otorizasyon tipini seçiniz!");
                    }
                }

                usr.Insert();

                var usrTnt = new FrmTntAutUsrTnt();
                usrTnt.IsActive = isActive;
                usrTnt.IsDefault = false;
                usrTnt.TntId = SgSession.Current.Tenant.TntId;
                usrTnt.UsrId = usr.UsrId;
                usrTnt.Insert();

                if (roles == null) roles = new long[0];
                foreach (var roleId in roles)
                {
                    var role = new FrmTntAutUsrRol();
                    role.RoleId = roleId;
                    role.UsrId = usr.UsrId;
                    role.TntId = SgSession.Current.Tenant.TntId;
                    role.Insert();
                }

                var url = System.Web.HttpContext.Current.Request.Url.SgAddToRoot("Base/Login/SetPassword");
                SgMemberManager.SendPasswordResetLink(usr.Mail, url);
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveFrmTntAutUsrInvite(String mail)
        {
            if (SgSession.Current.Tenant.Opt.InviteUser == false)
                throw new SgException("Doğrudan kullanıcı ekleme yetkiniz bulunmamaktadır.");

            var url = System.Web.HttpContext.Current.Request.Url.SgAddToRoot("Base/Login/InviteUser");
            SgMemberManager.InviteUsrToTenant(mail, SgSession.Current.Tenant.TntId, SgSession.Current.UserInfo.UsrId, false, url);
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmTntAutUsr(FrmTntAutUsr usr, bool isActive, long[] rolesTrue, long[] rolesFalse, String img, String autType)
        {
            SgDbTxn.AutoMerge(() =>
            {
                if (String.IsNullOrEmpty(img))
                {
                    usr.ImgId = 0;
                }
                else if (img.StartsWith("data:image")) // Yani resim güncellenmişse
                {
                    if (usr.ImgId == 0)
                    {
                        usr.ImgId = SgDocManager.AddDoc(img);
                    }
                    else
                    {
                        SgDocManager.UpdateDoc(usr.ImgId, img);
                    }
                }

                //Maili bir sekilde degistirmisse yakalayalim
                var oldUsr = FrmTntAutUsr.SelectFirst(a => a.UsrId == usr.UsrId);
                usr.Mail = oldUsr.Mail;
                usr.Username = oldUsr.Username;
                usr.Password = oldUsr.Password;

                var autTypes = FrmPrv.SelectAll(u => u.PrvType == SgProviderManager.ProviderType.Auth);
                if (autTypes.Count == 1)
                {
                    usr.AutType = autTypes[0].PrvKey;
                }
                else if (autTypes.Count > 1)
                {
                    if (autTypes.Find(u => u.PrvKey == usr.AutType) == null)
                    {
                        throw new SgException("Lütfen Kullanıcının otorizasyon tipini seçiniz!");
                    }
                }
                usr.Update();
                UpdateFrmTntAutUsrIsActive(usr.UsrId, isActive);

                if (rolesTrue == null) rolesTrue = new long[0];
                foreach (var roleId in rolesTrue)
                {
                    if (FrmTntAutUsrRol.Exists(a => a.UsrId == usr.UsrId && a.RoleId == roleId) == false)
                    {
                        var role = new FrmTntAutUsrRol();
                        role.RoleId = roleId;
                        role.UsrId = usr.UsrId;
                        role.TntId = SgSession.Current.Tenant.TntId;
                        role.Insert();
                    }
                }

                if (rolesFalse == null) rolesFalse = new long[0];
                foreach (var roleId in rolesFalse)
                {
                    var role = FrmTntAutUsrRol.SelectFirst(a => a.UsrId == usr.UsrId && a.RoleId == roleId);
                    if (role != null)
                        role.Delete();
                }

            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmTntAutUsr(FrmTntAutUsr usr)
        {
            SgDbTxn.AutoMerge(() =>
            {
                //usr.Delete();
                FrmTntAutUsrRol.DeleteAll(a => a.UsrId == usr.UsrId && a.TntId == SgSession.Current.Tenant.TntId);
                FrmTntAutUsrTnt.DeleteAll(a => a.UsrId == usr.UsrId && a.TntId == SgSession.Current.Tenant.TntId);
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateFrmTntAutUsrIsActive(long usrId, bool isActive)
        {
            SgDbTxn.Auto(() =>
            {
                var usrTnt = FrmTntAutUsrTnt.SelectFirst(a => a.UsrId == usrId && a.TntId == SgSession.Current.Tenant.TntId);
                if (usrTnt == null)
                    throw new SgException("Kullanıcı kaydında bir sorun oluştu. Lütfen daha sonra tekrar deneyiniz");

                if (usrTnt.IsActive != isActive)
                {
                    if (isActive == false && usrId == SgSession.Current.UserInfo.UsrId)
                    {
                        throw new SgException("Kendi kendinizi pasifleştiremezsiniz");
                    }
                    usrTnt.IsActive = isActive;
                    usrTnt.Update();
                }
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        [SgAuth(SgAuthType.LoginUsers)]
        public void ChangeTenant(long tntId)
        {
            SgDbTxn.Auto(() =>
            {
                var tntLst = SgTenantManager.GetTntListOfUser(SgSession.Current.UserInfo.UsrId);
                if (tntLst.Exists(a => a.TntId == tntId))
                {
                    var defaultTenant = FrmTntAutUsrTnt.SelectFirst(a => a.UsrId == SgSession.Current.UserInfo.UsrId && a.IsActive == true && a.IsDefault == true);
                    if (defaultTenant != null)
                    {
                        if (defaultTenant.TntId != tntId)
                        {
                            defaultTenant.IsDefault = false;
                            defaultTenant.Update();
                        }
                    }

                    defaultTenant = FrmTntAutUsrTnt.SelectFirst(a => a.UsrId == SgSession.Current.UserInfo.UsrId && a.TntId == tntId);
                    defaultTenant.IsDefault = true;
                    defaultTenant.Update();

                    SgSession.ChangeTenant(tntId);
                }
                else
                {
                    throw new SgException("Tenant yetkiniz bulunmamaktadır");
                }

            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SendInviteMail(String mail)
        {
            SgDbTxn.AutoMerge(() =>
            {
                var inv = FrmTntAutUsrTntInv.SelectFirst(a => a.Mail == mail && a.TntId == SgSession.Current.Tenant.TntId);
                if (inv == null)
                    throw new SgException("Davetiye bulunamadı. Lütfen ekranı yeniden açarak kontrol ediniz");

                if (inv.IsConfirmed)
                    throw new SgException("Davetiye onaylandığı için mail gönderilemez. Lütfen ekranı yeniden açarak kontrol ediniz");

                if (inv.IsCancelled)
                    throw new SgException("Davetiye iptal edildiği için mail gönderilemez. Lütfen ekranı yeniden açarak kontrol ediniz");

                var url = System.Web.HttpContext.Current.Request.Url.SgAddToRoot("Base/Login/InviteUser");
                SgMemberManager.SendInviteMail(inv.Mail, inv.VerificationCode, url);

            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteFrmTntAutUsrTntInv(String mail)
        {
            SgDbTxn.AutoMerge(() =>
            {
                var inv = FrmTntAutUsrTntInv.SelectFirst(a => a.Mail == mail && a.TntId == SgSession.Current.Tenant.TntId && a.IsConfirmed == false && a.IsCancelled == false);
                if (inv == null)
                    throw new SgException("Davetiye bulunamadı. Lütfen ekranı yeniden açarak kontrol ediniz");

                if (inv.IsConfirmed)
                    throw new SgException("Davetiye onaylandığı için iptal edilemez. Lütfen ekranı yeniden açarak kontrol ediniz");

                inv.IsCancelled = true;
                inv.Update();
            });
        }

        public String GetAvailableRoles()
        {
            return SgAuthManager.GetAvailableRoles().SgSerializeToJson();
        }
    }


    [SgDbCustomEntityAttribute("", "GET_USRS")]
    public partial class TenantUser : SgDbCustomEntity<TenantUser>
    {
        [SgDbCustomEntityFieldAttribute(0)]
        public String Guid { get; set; }

        [SgDbCustomEntityFieldAttribute(1)]
        public bool Status { get; set; }

        [SgDbCustomEntityFieldAttribute(2)]
        public Int64 Lastupdated { get; set; }

        [SgDbCustomEntityFieldAttribute(3)]
        public long UsrId { get; set; }

        [SgDbCustomEntityFieldAttribute(4)]
        public String Username { get; set; }

        [SgDbCustomEntityFieldAttribute(5)]
        public String Password { get; set; }

        [SgDbCustomEntityFieldAttribute(6)]
        public String AutType { get; set; }

        [SgDbCustomEntityFieldAttribute(7)]
        public String Mail { get; set; }

        [SgDbCustomEntityFieldAttribute(8)]
        public String Name { get; set; }

        [SgDbCustomEntityFieldAttribute(9)]
        public String Surname { get; set; }

        [SgDbCustomEntityFieldAttribute(10)]
        public String DisplayName { get; set; }

        [SgDbCustomEntityFieldAttribute(11)]
        public String CellPhone { get; set; }

        [SgDbCustomEntityFieldAttribute(12)]
        public String VerificationCode { get; set; }

        [SgDbCustomEntityFieldAttribute(13)]
        public Int64 ImgId { get; set; }

        [SgDbCustomEntityFieldAttribute(14)]
        public String ImgPath { get; set; }

        [SgDbCustomEntityFieldAttribute(15)]
        public bool IsActive { get; set; }

        [SgDbCustomEntityFieldAttribute(16)]
        public bool IsTenantOwner { get; set; }

        [SgDbCustomEntityFieldAttribute(17)]
        public bool IsApproved { get; set; }

        [SgDbCustomEntityFieldAttribute(18)]
        public DateTime LastLoginDate { get; set; }

        [SgDbCustomEntityFieldAttribute(19)]
        public String Roles { get; set; }
    }

}
