# De-clockify
No need to enter everyday and just put your work day. Let the automation do the trick.

The pipeline will run everyday and will check the following scenarios:
- No entry for today? Generate one between 10 - 18 GMT+3
- Already have an entry today? Do nothing. This case is good when you provide days-off in the future
- Weekend? Do nothing.

### Secrets 
- Clockify API KEY - You can find it on the clockify website under User Settings

### Variables
- WORKSPACE_ID - You can find it the Network Tab
- USER_ID - You can find it in the Network Tab
- ENTRY_DESCRIPTION - If you want to add a custom description

