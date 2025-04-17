const Message = require('../models/messageModel');
module.exports.addMessage = async (req, res) => {
    try{
        const { from, to, message } = req.body;
        if (!from || !to || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) {
            return res.status(200).json({ msg: 'Message added successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to add message' });
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }



}
module.exports.getAllMessages = async (req, res) => {
    try {
      console.log(req.query);
      const { from, to } = req.query;
  
      if (!from || !to) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const messages = await Message.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });
  
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
  
      res.status(200).json(projectedMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };