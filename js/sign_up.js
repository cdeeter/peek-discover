var signupController = (function (){
  var selectors = {};

  return {
    init: function () {
      selectors.emptyCategoryCheckbox = $('.category').find('.empty-checkbox');
      selectors.selectedCategoryCheckbox = $('.category').find('.checked-checkbox');
      selectors.selectedCategoriesList = $('#selected-categories');
      selectors.emptyMembershipCheckbox = $('.membership').find('.empty-checkbox');
      selectors.selectedMembershipCheckbox = $('.membership').find('.checked-checkbox');
      selectors.selectedMembershipList = $('#selected-membership-plan');
      selectors.membershipsSection = $("#memberships");
      this.bindUIActions();
    },
    bindUIActions: function () {
      selectors.emptyCategoryCheckbox.click(function () {
        var selectedCategory = $(this).closest('.category').text().trim();

        signupController.controlCategories(selectedCategory, 'add', $(this));
      });

      selectors.selectedCategoryCheckbox.click(function () {
        var selectedCategory = $(this).closest('.category').text().trim();

        signupController.controlCategories(selectedCategory, 'remove', $(this));
      });

      selectors.emptyMembershipCheckbox.click(function () {
        var selectedMembership = $(this).closest('.membership-option-container').find('.membership-type').text();

        signupController.setMembership(selectedMembership, $(this));
      });

      selectors.selectedMembershipCheckbox.click(function () {
        var selectedMembership = $(this).closest('.membership-option-container').find('.membership-type').text();

        signupController.setMembership(selectedMembership, $(this));
      });
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
    setMembership: function (membershipType, context) {
      // remove old selected membership class from old membership and
      // add selected membership class to new membership
      selectors.membershipsSection.find('.membership-option-container').removeClass('selected-membership');
      context.closest('.membership-option-container').addClass('selected-membership');

      // uncheck old checkbox and check the new one
      selectors.membershipsSection.find('.checked-checkbox').hide().prev('.empty-checkbox').show();
      context.hide().closest('.membership-option-container').find('.checked-checkbox').show();

      // save membership type
      selectors.selectedMembershipList.val(membershipType);
    },
  }
})();

$(document).ready(function () {
  signupController.init();
});
