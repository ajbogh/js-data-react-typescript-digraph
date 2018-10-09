var express = require('express');
var router = express.Router();

const workflows = require('./workflows.json').data.campaignsList;
const completeWorkflow = require('./workflow-complete.json');

/* GET workflows listing. */
router.get('/', function (req, res, next) {
  res.json(workflows);
});

router.get('/:uuid', function (req, res, next) {
  // terribly inefficient!
  if (req.params.uuid === completeWorkflow.data.campaign.goautobotsWorkflow.workflowUUID) {
    res.json(completeWorkflow.data.campaign.goautobotsWorkflow);
  } else {
    res.json(workflows.find(workflow => {
      return workflow.uuid === req.params.uuid
    }));
  }
});

module.exports = router;
