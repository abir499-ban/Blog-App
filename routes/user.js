const { Router } = require('express');
const router = Router();
const User = require('../model/user');
const { name } = require('ejs');
router.get('/signup', (req, res) => {
    return res.render('signup');
})
router.get('/signin', (req, res) => {
    return res.render('signin');
})

router.post('/user/signup', async (req, res) => {
    const { fullname, email, password } = req.body;
    await User.create({
        fullname: fullname,
        email: email,
        password: password,
    })
    return res.redirect('/');
})

router.post("/user/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordandGenerateToken(email, password);
        return res.cookie('token', token).render("home");
    } catch (error) {
        return res.render("signin", {
            error: "Invalid email or password"
        })
    }
});
router.get('/logout', (req,res) =>{
    return res.clearCookie("token").render("home");
})


module.exports = router;