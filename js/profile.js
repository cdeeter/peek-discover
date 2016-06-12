var profileController = (function (){
  var selectors = {};

  return {
    init: function () {
      selectors.showSectionChevron     = $('.click-to-show');
      selectors.hideSectionChevron     = $('.click-to-hide');
      selectors.categoryNames          = $('.category-name');
      selectors.selectedMembershipPlan = $("#selected-membership-plan");
      selectors.selectedCategoriesList = $('#selected-categories');

      this.bindUIActions();
      this.setUpCategories();
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
      var membershipType = selectors.selectedMembershipPlan.val();

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
    }
  };
})();

$(document).ready(function () {
  profileController.init();
});
