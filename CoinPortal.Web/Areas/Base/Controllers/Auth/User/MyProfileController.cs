using Devia.Sigma.Business.Auth;
using Devia.Sigma.Business.Auth.Entity;
using Devia.Sigma.Business.Auth.Session;
using Devia.Sigma.Business.Document;
using Devia.Sigma.Core.Exceptions;
using Devia.Sigma.Db.Transaction;
using Devia.Sigma.Web.Mvc;
using Devia.Sigma.Web.MvcAttribute;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Auth.User
{
    [SgAuth(SgAuthType.LoginUsers)]
    public class MyProfileController : SgControllerBase
    {
        // GET: Base/MyProfile
        
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdateInfo(String name, String surname, String cellPhone, String img)
        {            
            SgDbTxn.AutoMerge(() =>
            {
                var usr = FrmTntAutUsr.SelectFirst(a => a.UsrId == SgSession.Current.UserInfo.UsrId);
                if (usr == null)
                    throw new SgException("Kaydınız güncellenemedi. Lütfen daha sonra tekrar deneyiniz.");


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

                usr.Name = name.Trim();
                usr.Surname = surname.Trim();
                usr.DisplayName = usr.Name + " " + usr.Surname;
                usr.CellPhone = cellPhone;

                usr.Update();

                SgSession.RefreshUserInfo();
            });
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void UpdatePassword(String currentPassword, String newPassword)
        {
            SgDbTxn.AutoMerge(() =>
            {
                var usr = FrmTntAutUsr.SelectFirst(a => a.UsrId == SgSession.Current.UserInfo.UsrId);
                if (usr == null)
                    throw new SgException("Kaydınız güncellenemedi. Lütfen daha sonra tekrar deneyiniz.");

                if(SgAuthManager.Hash(currentPassword) != usr.Password)
                    throw new SgException("Mevcut şifrenizi yanlış girdiniz. Lütfen kontrol ederek tekrar deneyiniz.");

                if(String.IsNullOrEmpty(newPassword) || newPassword.Length < 6)
                    throw new SgException("Yeni şifreniz 6 karakterden az olamaz.");

                usr.Password = SgAuthManager.Hash(newPassword);
                usr.Update();

                SgSession.RefreshUserInfo();
            });
        }

        private static String SaveImage(String path, String name, String base64Data)
        {
            var fileName = Path.Combine(System.Web.HttpContext.Current.Request.PhysicalApplicationPath, path);
            if (Directory.Exists(fileName) == false)
            {
                Directory.CreateDirectory(fileName);
            }
            fileName = Path.Combine(fileName, name);

            const string ExpectedImagePrefixJpeg = "data:image/jpeg;base64,";
            const string ExpectedImagePrefixPng = "data:image/png;base64,";
            var subStringValue = 0;
            if (base64Data.StartsWith(ExpectedImagePrefixJpeg))
            {
                subStringValue = ExpectedImagePrefixJpeg.Length;
            }
            else if (base64Data.StartsWith(ExpectedImagePrefixPng))
            {
                subStringValue = ExpectedImagePrefixPng.Length;
            }

            var bytes = Convert.FromBase64String(base64Data.Substring(subStringValue));

            using (var imageFile = new FileStream(fileName, FileMode.Create))
            {
                imageFile.Write(bytes, 0, bytes.Length);
                imageFile.Flush();
            }

            return fileName.Replace(System.Web.HttpContext.Current.Request.PhysicalApplicationPath, String.Empty);
        }
    }
}