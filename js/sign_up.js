var signupController = (function (){
  var selectors = {};

  return {
    init: function () {
      selectors.emptyCategoryCheckbox      = $('.category').find('.empty-checkbox');
      selectors.selectedCategoryCheckbox   = $('.category').find('.checked-checkbox');
      selectors.selectedCategoriesList     = $('#selected-categories');
      selectors.categoryNames              = $('.category-name');
      selectors.emptyMembershipCheckbox    = $('.membership').find('.empty-checkbox');
      selectors.selectedMembershipCheckbox = $('.membership').find('.checked-checkbox');
      selectors.selectedMembershipList     = $('#selected-membership-plan');
      selectors.membershipsSection         = $('#memberships');
      selectors.email                      = $('#email');

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

      selectors.emptyMembershipCheckbox.click(function () {
        var selectedMembership = $(this).closest('.membership-option-container').find('.membership-type')
                                    .text().toLowerCase();

        signupController.setMembership(selectedMembership, $(this));
      });

      selectors.selectedMembershipCheckbox.click(function () {
        signupController.unsetMembership();
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
      } else {
        var cutStart = categoryList.indexOf(category);
        var cutEnd = cutStart + category.length + 2;
        var newCategories = categoryList.substr(0, cutStart) + categoryList.substr(cutEnd);

        selectors.selectedCategoriesList.val(newCategories);
      }

      context.hide().closest('.category').find(oppositeCheckbox).css('display', 'inline-block');
    },
    checkForMembership: function () {
      var membershipType = window.sessionStorage.getItem('membershipType');

      if (membershipType) {
        var membershipTypeId = "#" + membershipType;
        var membershipTypeCheckbox = $(membershipTypeId).find('.empty-checkbox');

        this.setMembership(membershipType, membershipTypeCheckbox);

        window.sessionStorage.removeItem('membershipType');
      }
    },
    setMembership: function (membershipType, context) {
      this.unsetMembership();

      context.closest('.membership-option-container').addClass('selected-membership');
      context.hide().closest('.membership-option-container').find('.checked-checkbox').fadeIn();
      selectors.selectedMembershipList.val(membershipType);

      selectors.categoryNames.each(function () {
        if (!$(this).hasClass(membershipType)) {
          $(this).closest('.category').hide();
        } else {
          $(this).closest('.category').show();
        }
      });
    },
    unsetMembership: function () {
      selectors.membershipsSection.find('.membership-option-container').removeClass('selected-membership');
      selectors.membershipsSection.find('.checked-checkbox').hide().prev('.empty-checkbox').show();
    },
  }
})();

$(document).ready(function () {
  signupController.init();
});
