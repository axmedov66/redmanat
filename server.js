const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // admin.html üçün

mongoose.connect('mongodb://127.0.0.1:27017/botdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    ads: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// API: bütün istifadəçilər
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// API: ümumi istifadəçi sayı
app.get('/api/users/count', async (req, res) => {
    const count = await User.countDocuments();
    res.json({ count });
});

// API: reklam izlənməsi üçün
app.post('/api/users/:id/ad', async (req, res) => {
    const user = await User.findOne({ id: req.params.id });
    if (user) {
        user.ads += 1;
        await user.save();
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// API: istifadəçi əlavə
app.post('/api/users', async (req, res) => {
    const { id, name } = req.body;
    let user = await User.findOne({ id });
    if (!user) {
        user = new User({ id, name });
        await user.save();
    }
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server 3000-də işləyir'));
