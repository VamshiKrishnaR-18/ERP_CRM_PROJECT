export const validate = (schema)=>(req, res, next)=>{
    const payload = {
        body:req.body,
        params:req.params,
        query:req.query,
    }

    const {error, value}= schema.validate(payload);

    if(error){
        return res.status(400).json({
            status:"fail",
            errors:error.details.map(d=>({path:d.path.join("."), messsage:d.message})),
        });
    }

    req.validated = value.body || req.body;
    req.params= value.params || req.params;
    req.query = value.query || req.query;
    
    next();


}