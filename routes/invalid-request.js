exports.getInvalidRequest = (req, res) => {
    res.status(404).json({message: "invalid request sent", code: 404})
}