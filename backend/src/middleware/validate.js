const validate = (schema) => (req, res, next) => {
    const payload = {
        body: req.body,
        params: req.params,
        query: req.query,
    };

    const { error, value } = schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            status: "fail",
            message: "Validation failed",
            errors: error.details.map(d => ({
                path: d.path.join("."),
                message: d.message
            })),
        });
    }

    // Store validated data in req.validated object
    req.validated = {
        body: value.body || {},
        params: value.params || {},
        query: value.query || {}
    };

    next();
};

export { validate };
export default validate;
