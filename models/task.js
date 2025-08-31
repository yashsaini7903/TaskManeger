const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true },
notes: { type: String, default: '' },
status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });


module.exports= mongoose.model('task', taskSchema);