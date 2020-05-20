module.exports = function (err, req, res, next) {
    if (err.type =='entity.parse.failed'){
        res.status(400).send('Entity parse failed, Invalid Json');
    }else if(err.name=='CastError' && err.path =='_id'){
        res.status(400).send('id must be a string of 24 hex characters');
    }else{
        res.status(500).send('Something Failed.');
    }
}