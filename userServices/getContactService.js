const Contact = require("../model/contact");

const getContactService = async (req, res) => {
  const userId = req.user._id;
  try {
    const contacts = await Contact.findOne({userId})
    .populate("contacts")
    if(!contacts){
      return   res.status(200).send({data:{}, message:"Add contacts first", success:false})
    }
    return res.status(200).send({data:contacts, message:"contacts get successfully", success:true})

  } catch (error) {
   return res
      .status(500)
      .send({
        message: "Internal server error: Failed to get contacts",
        success: false,
      });
  }
};

module.exports = getContactService;
