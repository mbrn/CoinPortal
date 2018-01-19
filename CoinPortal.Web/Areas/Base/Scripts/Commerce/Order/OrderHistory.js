var tblOrdersName = '#tblOrders';
var tblOrders;

jQuery(document).ready(function () {
    /*============================================================================================*/
    // Init
    /*============================================================================================*/
    tblOrders = Sigma.createDT({
        tableName: tblOrdersName,
        columns: [
            { title: "Guid", mData: "Guid", visible: false, searchable: false },
            { title: "Status", mData: "Status", visible: false, searchable: false },
            { title: "Lastupdated", mData: "Lastupdated", visible: false, searchable: false },
            { title: "OrdId", mData: "OrdId" },
            { title: "TntId", mData: "TntId" },
            { title: "UsrId", mData: "UsrId" },
            { title: "OrdStatus", mData: "OrdStatus" },
            { title: "InsertUser", mData: "InsertUser" },
            { title: "InsertDate", mData: "InsertDate" },
            { title: "InsertTime", mData: "InsertTime" },
            { title: "UpdateUser", mData: "UpdateUser" },
            { title: "UpdateDate", mData: "UpdateDate" },
            { title: "UpdateTime", mData: "UpdateTime" },
            { title: "", searchable: false, orderable: false },
        ],
    });

    fillData();
    /*============================================================================================*/

    /*============================================================================================*/
    // Events
    /*============================================================================================*/


    /*============================================================================================*/

});

function fillData() {

}