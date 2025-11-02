export default {
  success: (res, data, message = "Success", statusCode = 200) =>
    res.status(statusCode).json({ status: "success", message, data }),

  error: (res, message = "Error", statusCode = 500) =>
    res.status(statusCode).json({ status: "fail", message }),
};
