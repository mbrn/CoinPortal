using Devia.Sigma.Business.Auth;
using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Auth.Tenancy;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.General
{
    public class MobileController : SgControllerBase
    {
        [HttpPost]
        [SgAuth(SgAuthType.Anonymous)]
        public String GenerateToken(String username, [SgMonitoring(false)] String password, String channel)
        {
            var result = SgSession.Login(username, password);
            var token = "";
            if (result == SgLoginResult.Success)
            {
                token = SgAuthManager.GenerateToken(SgAuthManager.TokenType.TOKEN, channel, Request.UserHostAddress);
            }

            return new { result = result.ToString(), token = token }.SgSerializeToJson();
        }

        [SgAuth(SgAuthType.LoginUsers)]
        public void Logout()
        {
            SgSession.Logout(SgSession.Token);            
        }

        [SgAuth(SgAuthType.LoginUsers)]
        public JsonResult GetUserData()
        {
            return SgDbTxn.AutoMerge(() =>
            {
                var screens = SgAuthManager.GetUserScreens();
                var user = (FrmTntAutUsr)SgSession.Current.UserInfo;

                var userInfo = new
                {
                    Name = user.Name,
                    Surname = user.Surname,
                    DisplayName = user.DisplayName,
                    CellPhone = user.CellPhone,
                    Mail = user.Mail,
                    ImgPath = user.ImgPath
                };

                var tntLst = SgTenantManager.GetTntListOfUser(SgSession.Current.UserInfo.UsrId);
                var currentTntId = SgSession.Current.Tenant.TntId;

                return Json(new { screens = screens, userInfo = userInfo, tntLst = tntLst, currentTntId = currentTntId }, JsonRequestBehavior.AllowGet);
            });
        }
    }
}