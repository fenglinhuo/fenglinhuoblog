function DbFilters(filters){
    for(var i in filters) {
        this[i] = filters[i];
    }
}

DbFilters.prototype.addFilter =function(filter){
    for(var i in filter) {
        this[i] = filter[i];
    }
}

function DbOptions(options) {
    for(var i in options) {
        this[i] = options[i];
    }
}

DbOptions.prototype.addOption = function(option) {
    for(var i in option) {
        this[i] = option[i];
    }
}

exports.DbOptions = DbOptions;
exports.DbFilters = DbFilters;


