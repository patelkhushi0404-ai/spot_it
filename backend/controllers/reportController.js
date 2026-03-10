const Report = require("../models/Report");

exports.createReport = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { description, lat, lng } = req.body;

    const report = new Report({
      image: req.file ? req.file.filename : "",
      description: description,
      location: {
        lat: lat,
        lng: lng,
      },
    });

    await report.save();

    res.json({
      message: "Waste spot submitted successfully",
      report,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};