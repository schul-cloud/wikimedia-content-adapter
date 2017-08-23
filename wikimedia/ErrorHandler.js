function getErrorMessage(status){
    var msg = {};

    msg.status = String(status);
    switch (status){
        case 400 :
            msg.title = "Bad Request";
            msg.detail = "invalid parameter";
            break;
        case 500 :
            msg.title = "Internal Server Error";
            msg.detail =  "Something went wrong.";
            break;
        case 406 :
            msg.title = "Not Acceptable";
            msg.detail =  "Content type is not Acceptable";
            break;
        case 404 :
        default :
            msg.title = "Not Found";
            msg.detail =  "The requested resource could not be found.";
            break;
    }
    return msg;
}

module.exports.getMessage = function(status){
    var message = {
        jsonapi:{
            version: "1.0",
            meta :{
                name: "wikimedia-content-adapter",
                source: "https://github.com/schul-cloud/wikimedia-content-adapter",
                description: "This is an adpter for media-file search on wikimedia."
            }
        },
        errors: []
    };

    message.errors.push(getErrorMessage(status));
    return message;
};