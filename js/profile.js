var profileController = (function (){
  var selectors = {};

  return {
    init: function () {
      selectors.showSectionChevron = $('.click-to-show');
      selectors.hideSectionChevron = $('.click-to-hide');
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
  };
})();

$(document).ready(function () {
  profileController.init();
});
