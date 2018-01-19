using Devia.Sigma.Core.Configuration.Custom;
using Devia.Sigma.Core.Configuration.Custom.Db;
using Devia.Sigma.Db.DbSystem;
using Devia.Sigma.Db.DbSystem.Table;
using Devia.Sigma.Db.Query;
using Devia.Sigma.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;

namespace Devia.Sigma.Web.Template.Areas.Base.Controllers.Sys.Query
{
    public class QueryController : SgControllerBase
    {
        // GET: Base/Query
        public ActionResult Index()
        {
            return View();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetQueryList()
        {
            return SgDbQueryProvider.Current.GetAllQueryNames().SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetTableData()
        {
            var resultList = new Dictionary<String, String[]>();

            foreach(SgDbConfig con in SgConfig.Instance.DbConnections)
            {
                var objList = SgDbManager.GetAllSystemObjects(con.DbName, "sg_");
                foreach(var obj in objList)
                {
                    if (obj.ObjectType != SgDbSytemObjectType.Table)
                        continue;

                    var table = obj.To<SgDbTable>();
                    resultList.Add(table.Schema + "." + table.TableName, table.Columns.Select(a => a.Name).ToArray());
                }
            }

            return resultList.SgSerializeToJson();
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public String GetQuery(String name)
        {
            return SgDbQueryProvider.Current.GetQueryText(name);
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void SaveQuery(String name, String query, String dbName, String description)
        {
            SgDbQueryProvider.Current.SaveQuery(name, query);
        }

        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void DeleteQuery(String name)
        {
            SgDbQueryProvider.Current.DeleteQuery(name);
        }
    }
}