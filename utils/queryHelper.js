function queryHelper(filter){
    let queryStack = "";
    for(let [key,val] of Object.entries(filter)) {
        queryStack+=`&${key}=${val}`
    }
    return queryStack;
}

module.exports = queryHelper;