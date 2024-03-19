const Contact = require("../model/contact");
const addContactService = async (req, res) => {
    const userId = req.user._id;
    const contact = req.query.q
  try {
    // Check if the contact already exists for the user
    const isContact = await Contact.findOne({
      userId,
      contacts: contact,
    });

    if (isContact) {
      // If the contact already exists, return it
      return res.status(200).send({data:isContact, success:false, message:"User already in the contact list!"});
    } else {
      // If the contact doesn't exist, add it
      const newContact = await Contact.findOneAndUpdate(
        { userId},
        { $push: { contacts: contact } },
        { new: true, upsert: true }
      );
      return res.status(200).send({data:newContact, success:true, message:"User added in the contact list!"});
    }
  } catch (error) {
    console.error();
    return res.status(500).send({message:"Internal server error: Failed to add contact:", error: error.message});
  }
};

module.exports = addContactService;

