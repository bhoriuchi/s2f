# Notes

### Versioning
* Workflows are versioned
* Tasks are versioned
* Published workflows cannot be modified directly
* On branch/fork of Workflow
  * All Steps should be cloned
    * All local step parameters should be cloned
  * All global workflow parameters should be cloned
  * A mapping should be created for new/old steps and parameters in order to recreate the same step and parameter relationships with the cloned records
