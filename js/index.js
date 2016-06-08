var homeController = (function(){
  var selectors = {};

  return {
    init: function() {
      selectors.homePage         = $("#home-page");
      selectors.signupEmailField = $("#signup-email");
      selectors.loginEmailField  = $("#login-email");
      selectors.signupButton     = $("#signup-button");
      selectors.loginButton      = $("#login-button");
      selectors.loginForm        = $("#home-page #login-form");
      selectors.signupForm       = $("#signup-form");
      selectors.actionLinks      = $("#action-links");
      selectors.signupLink       = $("#signup-link");
      selectors.loginLink        = $("#login-link");
      selectors.switchToSignup   = $("#or-signup-link");
      selectors.switchToLogin    = $("#or-login-link");
      this.bindUIActions();
    },
    bindUIActions: function() {
      selectors.signupButton.click(function(e) {
        var email = selectors.signupEmailField.val();

        e.preventDefault();
        this.signUp(email);
      }.bind(this));

      selectors.loginButton.click(function(e) {
        var email = selectors.loginEmailField.val();

        e.preventDefault();
        this.logIn(email);
      }.bind(this));

      selectors.signupLink.click(function () {
        this.showSection(selectors.signupForm, selectors.actionLinks);
      }.bind(this));

      selectors.loginLink.click(function () {
        this.showSection(selectors.loginForm, selectors.actionLinks);
      }.bind(this));

      selectors.switchToSignup.click(function () {
        this.showSection(selectors.signupForm, selectors.loginForm);
      }.bind(this));

      selectors.switchToLogin.click(function () {
        this.showSection(selectors.loginForm, selectors.signupForm);
      }.bind(this));
    },
    hideSection: function(selector) {
      selector.hide();
    },
    showSection: function(sectionToShow, sectionToHide) {
      var findShowSelector = selectors.homePage.find(sectionToShow);
      var findHideSelector = selectors.homePage.find(sectionToHide);

      this.hideSection(findHideSelector);
      findShowSelector.fadeIn(500);
    },
    signUp: function (email) {
      window.sessionStorage.setItem('peekDiscoverEmail', email);
      window.location.assign('/sign_up.html');
    },
    logIn: function(email) {
      window.sessionStorage.setItem('peekLoginEmail', email);
      window.location.assign('/profile.html');
    },
  }
})();

$(document).ready(function () {
  homeController.init();
});
