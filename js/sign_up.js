var signupController = (function (){
  var selectors = {};

  return {
    init: function () {
      selectors.emptyCategoryCheckbox      = $('.category').find('.empty-checkbox');
      selectors.selectedCategoryCheckbox   = $('.category').find('.checked-checkbox');
      selectors.selectedCategoriesList     = $('#selected-categories');
      selectors.categoryNames              = $('.category-name');
      selectors.categoryPreferences        = $('#preferences-container');
      selectors.membershipContainer        = $('.membership-option-container');
      selectors.emptyMembershipCheckbox    = $('.membership').find('.empty-checkbox');
      selectors.selectedMembershipCheckbox = $('.membership').find('.checked-checkbox');
      selectors.selectedMembershipList     = $('#selected-membership-plan');
      selectors.membershipsSection         = $('#memberships');
      selectors.email                      = $('#email');
      selectors.signupButton               = $('#signup-button');

      this.setSignupEmail();
      this.checkForMembership();
      this.bindUIActions();
    },
    bindUIActions: function () {
      selectors.emptyCategoryCheckbox.click(function () {
        var selectedCategory = $(this).closest('.category').find('.category-name').text();

        signupController.controlCategories(selectedCategory, 'add', $(this));
      });

      selectors.selectedCategoryCheckbox.click(function () {
        var selectedCategory = $(this).closest('.category').text().trim();

        signupController.controlCategories(selectedCategory, 'remove', $(this));
      });

      selectors.membershipContainer.click(function () {
        var selectedMembership = $(this).find('.membership-type').text().toLowerCase();

        if ($(this).hasClass('selected-membership')) {
          signupController.unsetMembership($(this));
        } else {
          signupController.setMembership(selectedMembership, $(this));
        }
      });
    },
    setSignupEmail: function () {
      var email = window.sessionStorage.getItem('signupEmail');

      selectors.email.val(email);
      window.sessionStorage.removeItem('signupEmail');
    },
    controlCategories: function (category, action, context) {
      var categoryList = selectors.selectedCategoriesList.val();
      var oppositeCheckbox = action === 'add' ? '.checked-checkbox' : '.empty-checkbox';

      if (action === 'add') {
        categoryList += category + ", ";
        selectors.selectedCategoriesList.val(categoryList);

        if (selectors.selectedMembershipList.val()) {
          selectors.signupButton.prop('disabled', false);
        }

      } else {
        var cutStart = categoryList.indexOf(category);
        var cutEnd = cutStart + category.length + 2;
        var newCategories = categoryList.substr(0, cutStart) + categoryList.substr(cutEnd);

        selectors.selectedCategoriesList.val(newCategories);
      }

      context.hide().closest('.category').find(oppositeCheckbox).css('display', 'inline-block');
    },
    clearCategories: function () {
      selectors.categoryPreferences.find('.checked-checkbox').hide();
      selectors.categoryPreferences.find('.empty-checkbox').css('display', 'inline-block');
      selectors.categoryPreferences.find('.category').show();
      selectors.selectedCategoriesList.val('');
    },
    checkForMembership: function () {
      var membershipType = window.sessionStorage.getItem('membershipType');

      if (membershipType) {
        var membershipTypeId = "#" + membershipType;
        var membershipContainer = $(membershipTypeId);

        this.setMembership(membershipType, membershipContainer);

        window.sessionStorage.removeItem('membershipType');
      } else {
        selectors.signupButton.prop('disabled', true);
      }
    },
    setMembership: function (membershipType, context) {
      var selectedMembership = $('.selected-membership');

      this.unsetMembership(selectedMembership);

      context.addClass('selected-membership');
      context.find('.empty-checkbox').hide();
      context.find('.checked-checkbox').show();
      selectors.selectedMembershipList.val(membershipType);

      selectors.categoryNames.each(function () {
        if (!$(this).hasClass(membershipType)) {
          $(this).closest('.category').hide();
        } else {
          $(this).closest('.category').show();
        }
      });
    },
    unsetMembership: function (membershipOptionContainer) {
      membershipOptionContainer.removeClass('selected-membership');
      membershipOptionContainer.find('.checked-checkbox').hide().prev('.empty-checkbox').css('display', 'inline-block');
      this.clearCategories();
      selectors.signupButton.prop('disabled', true);
    },
  }
})();

$(document).ready(function () {
  signupController.init();
});
