const mongoose = require("mongoose");
const Contact = require("../model/contact");

const addContactService = async (req, res) => {
    try {
        // Check if the contact already exists for the user
        const existingContact = await Contact.findOne({ _id: req.user._id, contacts: req.query.q });

        if (existingContact) {
            // If the contact already exists, return it
            return res.status(200).send(existingContact);
        } else {
            // If the contact doesn't exist, add it
            const newContact = await Contact.findOneAndUpdate(
                { _id: req.user._id },
                { $push: { contacts: req.query.q } },
                { new: true, upsert: true }
            );
            return res.status(200).send(newContact);
        }
    } catch (error) {
        console.error("Error adding contact:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = addContactService;
