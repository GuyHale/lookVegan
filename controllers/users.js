const User = require("../models/user");

module.exports.getRegister = (req, res) => {
    res.render("users/register");
}

module.exports.postRegister = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to LookVegan!");
            res.redirect('/places');
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}

module.exports.getLogin = (req, res) => {
    res.render("users/login");
}

module.exports.postLogin = (req, res) => {
    req.flash("success", "welcome back!");
    const redirectUrl = req.session.returnTo || "/places";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/places");
}