var homeController = (function (){
  var selectors = {};

  return {
    init: function () {
      selectors.homePage                = $('#home-page');
      selectors.signupEmailInput        = $('#signup-email');
      selectors.loginEmailInput         = $('#login-email');
      selectors.loginPasswordInput      = $('#login-password');
      selectors.signupButton            = $('#signup-button');
      selectors.loginButton             = $('#login-button');
      selectors.loginForm               = $('#home-page #login-form');
      selectors.signupForm              = $('#signup-form');
      selectors.actionLinks             = $('#action-links');
      selectors.signupLink              = $('#signup-link');
      selectors.loginLink               = $('#login-link');
      selectors.switchToSignup          = $('#or-signup-link');
      selectors.switchToLogin           = $('#or-login-link');
      selectors.membershipSignupButtons = $('.membership-signup-button');

      this.bindUIActions();
    },
    bindUIActions: function () {
      selectors.signupButton.click(function(e) {
        var email = selectors.signupEmailInput.val();

        e.preventDefault();
        this.signUp(email);
      }.bind(this));

      selectors.loginButton.click(function (e) {
        var email = selectors.signupEmailInput.val();
        var password = selectors.loginPasswordInput.val();
        var data = { "email": email, "password": password };

        e.preventDefault();
        this.logIn(data);
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

      selectors.membershipSignupButtons.click(function () {
        var membershipType = $(this).attr('id').split('-')[0];

        homeController.membershipSignUp(membershipType);
      });
    },
    hideSection: function (selector) {
      selector.hide();
    },
    showSection: function (sectionToShow, sectionToHide) {
      var findShowSelector = selectors.homePage.find(sectionToShow);
      var findHideSelector = selectors.homePage.find(sectionToHide);

      this.hideSection(findHideSelector);
      findShowSelector.fadeIn(500);
    },
    signUp: function (email) {
      window.sessionStorage.setItem('signupEmail', email);
      window.location.assign('/sign_up.html');
    },
    logIn: function (loginData) {
      selectors.loginForm.removeClass('bad-login');

      $.post('/login', loginData, function (response) {
        console.log(response);
        if (response === 'Success!') {
          window.location.assign('/profile.html');
        } else {
          selectors.loginForm.addClass('bad-login');
        }
      });
    },
    membershipSignUp: function(membershipType) {
      window.sessionStorage.setItem('membershipType', membershipType);
      window.location.assign('/sign_up.html');
    },
  }
})();

$(document).ready(function () {
  homeController.init();
});
