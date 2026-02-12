const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');


async function createChat(req, res){
    const {title} = req.body;
    const user = req.user;
    const chat = await chatModel.create({
        user: user._id,
        title
    })
    res.status(201).json({
        message: 'Chat created successfully',
        chat:{
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    })
}
async function getChats(req, res){
    const user = req.user;
    const chats = await chatModel.find({user: user._id});
    const messages = await messageModel.find({user: user._id});
    res.status(200).json({
        message: 'Chats fetched successfully',
        chats: chats.map(c => ({
            _id: c._id,
            title: c.title,
            lastActivity: c.lastActivity,
            user: c.user,
            messages: messages.filter(m => m.chat.toString() === c._id.toString()).map(m => ({
                id: m._id,
                role: m.role === 'user' ? 'user' : 'assistant',
                text: m.content
            }))

        }))
        });
    }

    async function deleteAllChats(req, res){
        const user = req.user;
        // delete messages and chats belonging to the user
        await messageModel.deleteMany({ user: user._id });
        await chatModel.deleteMany({ user: user._id });
        res.status(200).json({ message: 'All chats deleted successfully' });
    }

    module.exports = {
        createChat,
        getChats,
        deleteAllChats
    }