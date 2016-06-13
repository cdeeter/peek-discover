var profileController = (function (){
  var selectors = {};

  return {
    init: function () {
      selectors.preferencesContainer   = $('#preferences-container');
      selectors.membershipContainer    = $('#subscription-section');
      selectors.showSectionChevron     = $('.click-to-show');
      selectors.hideSectionChevron     = $('.click-to-hide');
      selectors.categoryNames          = $('.category-name');
      selectors.selectedMembershipPlan = $('#selected-membership-plan');
      selectors.selectedCategoriesList = $('#selected-categories');
      selectors.membershipOptions      = $('.membership-option-container');
      selectors.firstNameSpan          = $('.first-name');
      selectors.firstNameInput         = $('#first-name');
      selectors.lastNameSpan           = $('.last-name');
      selectors.lastNameInput          = $('#last-name');
      selectors.emailSpan              = $('.email');
      selectors.emailInput             = $('#email-address');
      selectors.nameOnCard             = $('#name-on-card');
      selectors.cardNum                = $('#card-number');
      selectors.cardExp                = $('#card-exp-date');
      selectors.cardCvv                = $('#card-cvv');
      selectors.locationInput          = $('#location');
      selectors.locationSpan           = $('.location');
      selectors.eventName              = $('.upcoming-event-name');
      selectors.eventDate              = $('.upcoming-event-date');
      selectors.profileImage           = $('#profile-image');

      profileController.getProfileInfo();
      this.bindUIActions();
    },
    bindUIActions: function () {
      selectors.showSectionChevron.click(function () {
        $(this).closest('.toggled-section').find('.section-content').slideDown();
        $(this).hide();
        $(this).next('.click-to-hide').css('display', 'inline-block');
      });

      selectors.hideSectionChevron.click(function () {
        $(this).closest('.toggled-section').find('.section-content').slideUp();
        $(this).hide();
        $(this).prev('.click-to-show').css('display', 'inline-block');
      });
    },
    setUpCategories: function () {
      var membershipType = selectors.selectedMembershipPlan.val() === '' ? 'gold' : selectors.selectedMembershipPlan.val();

      if (!selectors.selectedMembershipPlan.val()) {
        selectors.selectedCategoriesList.val('Historical Sites & Monuments, Cultural Tours, Food Tours, Water Sports, Walking Tours');
      }

      selectors.membershipOptions.each(function() {
        if ($(this).attr('id') === membershipType) {
          $(this).find('.empty-checkbox').hide();
          $(this).find('.checked-checkbox').css('display', 'inline-block');
          $(this).addClass('selected-membership');
        } else {
          $(this).find('.empty-checkbox').css('display', 'inline-block');
        }
      });

      selectors.categoryNames.each(function () {
        if (!$(this).hasClass(membershipType)) {
          $(this).closest('.category').hide();
        } else {
          $(this).closest('.category').show();
        }

        if (selectors.selectedCategoriesList.val().indexOf($(this).text()) !== -1) {
          $(this).closest('.category').find('.checked-checkbox').css('display', 'inline-block');
          $(this).closest('.category').find('.empty-checkbox').hide();
        }
      });
    },
    getProfileInfo: function () {
      $.get('/profile', function (data) {
        if (!data) {
          profileController.setUpCategories();
        } else {
          var profile = JSON.parse(data);

          selectors.firstNameSpan.text(profile.userData.firstName);
          selectors.firstNameInput.val(profile.userData.firstName);
          selectors.lastNameSpan.text(profile.userData.lastName);
          selectors.lastNameInput.val(profile.userData.lastName);
          selectors.emailSpan.text(profile.userData.email);
          selectors.emailInput.val(profile.userData.email);
          selectors.locationSpan.text(profile.userData.location);
          selectors.locationInput.val(profile.userData.location);
          selectors.eventName.text(profile.activityData.name);
          selectors.eventDate.text(profile.activityData.date);
          selectors.nameOnCard.val(profile.userData.raw.nameOnCard);
          selectors.cardNum.val(profile.userData.raw.cardNumber);
          selectors.cardExp.val(profile.userData.raw.cardExpDate);
          selectors.cardCvv.val(profile.userData.raw.cardCvv);

          selectors.selectedCategoriesList.val(profile.userData.categories);
          selectors.selectedMembershipPlan.val(profile.userData.membership.type);

          profileController.setUpCategories();

          if (profile.activityData.name.length >= 25) {
            selectors.eventName.css('font-size', '22px');
          }

          if (profile.userData.lastName !== 'Shapiro') {
            selectors.profileImage.prop('src', 'assets/no_user.png');
          }
        }
      });
    },
  };
})();

$(document).ready(function () {
  profileController.init();
});
