steps = {
  firstStep: function(filters) {
    // Set filters
    for (id in filters) {
      if (filters.hasOwnProperty(id)) {
        jQuery('#' + id).val(filters[id]);
      }
    }
    // Submit buyer search.
    jQuery('#UCSearchAdvancePlus1_UCSearchAdvanceOtherCriteriaPlusA1_workProviderSearchButton').click();
    return 'secondStep';
  },
  secondStep: function() {
    // Select all buyers
    jQuery('#UCSearchAdvancePlus1_UCSearchAdvanceOtherCriteriaPlusA1_UCWorkProviderSelectedList1_cbxCheckAll').click();
    // Submit form.
    jQuery('#UCSearchAdvancePlus1_searchAdv1Button').click();
    return 'thirdStep';
  },
  thirdStep: function () {
    // Result is a redirect in JavaScript, let it happen.
    return 'fourthStep';
  },
  fourthStep: function (){
    // We should be done by now.
    return false;
  }
}

currentStep = steps.firstStep;

var fs = require('fs'),
  system = require('system');
if (system.args.length < 3) {
  console.log("Usage: " + system.args[0] +  " <destination file> <filters file>");
  phantom.exit(1);
} else {
  try {
    var filter = JSON.parse(fs.read(system.args[2]));
    console.log("Filter: " + JSON.stringify(filter));
    var page = require('webpage').create();
    page.onLoadFinished = function(status) {
      if (status === 'success') {
        var nextStep = page.evaluate(currentStep, filter);
        if (typeof steps[nextStep] === 'function') {
          currentStep = steps[nextStep];
        }
        else {
          try {
            f = fs.open(system.args[1], "w");
            f.writeLine(page.content);
            f.close();
          } catch (e) {
            console.log(e);
          }
          phantom.exit(0);
        }
      }
      else {
        phantom.exit(1);
      }
    };
    page.open('https://seao.ca/Recherche/rech_avancee_y.aspx');
  }
  catch (error) {
    console.log(error);
    phantom.exit();
  }
}

