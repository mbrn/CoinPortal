using CoinPortal.Service.MarketData;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace CoinPortal.Service
{
    public partial class Service : ServiceBase
    {
        private MarketPickerThreadPool MarketPickerThreadPool;

        public Service()
        {
            InitializeComponent();
        }

        public void StartService()
        {
            OnStart(null);
        }

        public void StopService()
        {
            OnStop();
        }

        protected override void OnStart(string[] args)
        {
            MarketPickerThreadPool = new MarketPickerThreadPool();
            MarketPickerThreadPool.StartPool();
        }

        protected override void OnStop()
        {
            MarketPickerThreadPool.StopPool();
        }
    }
}
