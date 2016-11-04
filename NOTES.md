# Notes

* Steps
  * Workflow and Task steps are versioned so their parameters need to be cloned to the step scope
    * This presents an issue with Task and Workflow parameters potentially getting out of sync with steps
    * In the event a param is added to a TASK after that task is added to a Workflow the new param will need to either be added or a sync function will be required
