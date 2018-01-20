using CoinPortal.Business.Entity;
using Devia.Sigma.Business.Sys.Provider;
using Devia.Sigma.Core.Threading;
using Devia.Sigma.Db.Transaction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoinPortal.Service.MarketData
{
    public class MarketPickerThreadPool
    {
        SgThreadPool<PoolItem> _ThreadPool;

        public void StartPool()
        {
            _ThreadPool = new SgThreadPool<PoolItem>(Produce);
            _ThreadPool.ProducerPeriod = 1; // 30 saniye
            _ThreadPool.MaxQueueSize = 100;
            _ThreadPool.AddConsumer(Consume, 2); // TOOD Ayni marketin threadleri birbirine girmesin diye consumerlari prv id ile ozellestirebiliriz. 
            _ThreadPool.Start();
        }

        public void StopPool()
        {
            if (_ThreadPool != null)
                _ThreadPool.Stop();
        }

        private static PoolItem Produce()
        {
            return SgDbTxn.Auto<PoolItem>(() => {
                //var excList = CrrMrkExc.SelectAll(a => a.IsActive == true && a.LastUpdateDatetime.AddSeconds(a.MinUpdatePeriod) > DateTime.Now);
                var excList = CrrMrkExc.SelectAll(a => a.IsActive == true);
                excList.RemoveAll(a => a.LastRequestDatetime.AddSeconds(a.MinUpdatePeriod) > DateTime.Now);

                if (excList.Count > 0)
                {
                    var exc = excList[0];
                    var mrk = CrrMrk.SelectFirst(a => a.MrkId == exc.MrkId);

                    var prv = SgProviderManager.GetProviderWithoutAccount<IMarketPicker>(mrk.MrkPrvId);
                    var requestList = new List<Tuple<String, String>>();
                    if(prv.Values[MarketConsts.IS_SUPPORT_FOR_MULTIPLE_REQUEST] == "1")
                    {
                        var list = excList.FindAll(a => a.MrkId == exc.MrkId).Select(a => Tuple.Create(a.CrrKey, a.UnitCrrKey));
                        requestList.AddRange(list);
                    }
                    else
                    {
                        requestList.Add(Tuple.Create(exc.CrrKey, exc.UnitCrrKey));
                    }

                    foreach(var e in excList)
                    {
                        e.LastRequestDatetime = DateTime.Now;
                        e.Update();
                    }

                    return new PoolItem()
                    {
                        MrkId = exc.MrkId,
                        RequestList = requestList,
                        MarketPicker = prv
                    };
                }

                return null;
            });
        }

        private static void Consume(PoolItem item)
        {
            if (item == null)
                return;

            SgDbTxn.Auto(() =>
            {
                try
                {
                    var excList = item.MarketPicker.GetPrices(item.RequestList);
                    if(excList != null)
                    {
                        foreach(var exc in excList)
                        {
                            exc.Insert();

                            var mrkExc = CrrMrkExc.SelectFirst(a => a.MrkId == item.MrkId && a.CrrKey == exc.CrrKey && a.UnitCrrKey == exc.UnitCrrKey);
                            if(mrkExc != null)
                            {
                                mrkExc.Diff24h = exc.Diff24h;
                                mrkExc.LastUpdateDatetime = exc.PriceDatetime;
                                mrkExc.MaxPrice24h = exc.MaxPrice24h;
                                mrkExc.MinPrice24h = exc.MinPrice24h;
                                mrkExc.Percent24h = exc.Percent24h;
                                mrkExc.Price = exc.Price;
                                mrkExc.Volume24h = exc.Volume24h;
                                mrkExc.Update();
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                }
            });

        }
    }

    public class PoolItem
    {
        public Int64 MrkId { get; set; }
        public IList<Tuple<String, String>> RequestList { get; set; }
        public IMarketPicker MarketPicker { get; set; }
    }
}
