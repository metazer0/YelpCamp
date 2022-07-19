const User = require('../models/user')

module.exports.renderRegisterForm = (req,res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req,res,next) => {
    try {
        const {username, email, password} = req.body

        const newUser = new User({
            email,
            username
        })
    
        const registeredUser = await User.register(newUser, password)

        req.login(registeredUser, err => {
            if(err){
                return next(err)
            }else{
                req.flash('success','Welcome to YelpCamp')
                res.redirect('/campgrounds')
            }
        })
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('register')
    }
}

module.exports.renderLoginForm = (req,res) =>{
    res.render('users/login')
}

module.exports.login = (req,res) =>{
    req.flash('success', 'welcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next) => {
    req.logout(function(err){
        if(err){
            return next(err)
        }
        req.flash('success', 'goodbye')
        res.redirect('/campgrounds')
    })
}