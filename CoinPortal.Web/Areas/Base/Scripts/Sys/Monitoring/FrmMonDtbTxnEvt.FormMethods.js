function getJsonObjForm(obj) {
    var text = '<div class="row">';
    if (obj.EvtType == "UP") {
        text += getJsonDiffForm(obj.OldJson, obj.NewJson);
    }
    else if (obj.EvtType == "IN") {
        text += getOneObjForm(obj.NewJson);
    }
    else if (obj.EvtType == "DE") {
        text += getOneObjForm(obj.OldJson);
    }
    text += "</div>";

    return text
}

function getOneObjForm(obj) {
    var result = "";

    var objJson = JSON.parse(obj);

    var keys = Object.keys(objJson);
    keys.forEach(function (key) {
        if (key == "Guid" || key == "Lastupdated" || key == "Status")
            return;

        if (objJson[key] != null  && objJson[key].length > 256)
            return;

        result += '<div class="form-group col-md-3 col-sm-4">' +
                       '<label class="control-label">' + key + '</label>' +
                   '</div>';
        result += '<div class="form-group col-md-9 col-sm-8">' +
                        '<input type="text" class="form-control" value="' + objJson[key] + '" readonly>' +
                    '</div>';
    });

    return result;
}

function getJsonDiffForm(oldObj, newObj) {
    var result = "";

    var oldJson = JSON.parse(oldObj);
    var newJson = JSON.parse(newObj);

    var keys = Object.keys(oldJson);
    keys.forEach(function (key) {

        if (key == "Guid" || key == "Lastupdated" || key == "Status")
            return;

        if (oldJson[key] != null && oldJson[key].length > 256)
            return;

        if (newJson[key] != null && newJson[key].length > 256)
            return;

        var dffStyle = oldJson[key] != newJson[key] ? 'style="background-color: #36D7B7;"': '';

        result += '<div class="form-group col-md-5 col-sm-4">' +                        
                        '<input type="text" class="form-control" value="' + oldJson[key] + '" ' + dffStyle + ' readonly>' +
                    '</div>';
        result += '<div class="form-group col-md-2 col-sm-4 text-center">' +
                       '<label class="control-label">' + key + '</label>' +
                   '</div>';
        result += '<div class="form-group col-md-5 col-sm-4">' +
                        '<input type="text" class="form-control" value="' + newJson[key] + '" ' + dffStyle + ' readonly>' +
                    '</div>';
    });

    return result;
}