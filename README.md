# ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search in Microsoft Teams

This sample app demonstrates how to use a Microsoft Teams bot to chat with your data using natural language in the flow of work.

It builds on top of the [ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search](https://github.com/Azure-Samples/azure-search-openai-demo) sample.

![Chat with your data bot in Microsoft Teams](./assets/bot.png)

This project was built using: 

- [Teams Toolkit v5.0.1](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension), provides tools for building Teams apps, fast.
- [Teams AI Library (public preview)](https://www.npmjs.com/package/@microsoft/teams-ai), provides a Microsoft Teams centric approach to building bots.
- [Adaptive Cards](https://adaptivecards.io), are an open card exchange format enabling developers to exchange UI content in a common and consistent way.
- [Azurite](https://www.npmjs.com/package/azurite), provides emulation for Azure Storage during development.

## Try it now!

This sample is available to download and use inMicrosoft Teams.

1. Go to the [releases](https://github.com/garrytrinder/msteams-azure-search-openai-demo/releases) page and download the ZIP file.
1. Open Microsoft Teams.
1. Select `Apps` from the left rail.
1. Select `Manage your apps`.
1. Select `Upload an app`.
1. Select `Upload a customised app`.
1. Select the ZIP file you downloaded.
1. Select `Add` to install the app.

> **NOTE**: If `Upload a customised app option` does not appear, you do not have the ability to sideload apps.

> **TIP**: [Join](https://developer.microsoft.com/microsoft-365/dev-program?WT.mc_id=m365-00000-garrytrinder) the Microsoft 365 Developer Program and get your _free_ developer instant sandbox with sideloading enabled.

## Run locally using Teams Toolkit

To run this project locally you will need to:

> **NOTE**: An Azure subscription is not required to run this sample locally, however you will require a Microsoft 365 tenant that has sideloading enabled.

1. Follow the steps to deploy the [ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search](https://github.com/Azure-Samples/azure-search-openai-demo#getting-started) sample to Azure.
1. Install Teams Toolkit from the extensions marketplace in VSCode.
1. Clone/fork this repo to your local machine.
1. Open the repo folder in VSCode.
1. Create `env` folder in root of the project.
1. Create [env.local](#envlocal) and [env.local.user](#envlocaluser) files in `env` folder.
1. Update `APP_BACKEND_ENDPOINT` variable with the URL to your provisioned backend.
1. Run Debug session (F5).

> **TIP**: [Join](https://developer.microsoft.com/microsoft-365/dev-program?WT.mc_id=m365-00000-garrytrinder) the Microsoft 365 Developer Program and get your _free_ developer instant sandbox with sideloading enabled.

## Deploy to Azure using Teams Toolkit

To deploy your local project you will need to:

> **NOTE**: An Azure subscription is required to deploy this project to Azure.

1. Create [env.dev](#envdev) and [env.dev.user](#envdevuser) files in `env` folder.
1. Update `APP_BACKEND_ENDPOINT` variable in `env.dev` with the URL of your provisioned backend.
1. Open Teams Toolkit from the sidebar in VSCode.
1. Select `Provision` and follow steps to provision resources in Azure.
1. Select `Deploy` and follow steps to build and deploy app code to Azure.
1. Select `Publish` to publish to and approve the app in your Microsoft Teams organizational store.

The following resources will be deployed to Azure:

- Azure App Service Plan (B1)
- Azure Bot Service (Free)
- Microsoft Entra ID App Reg
- Azure Storage Account

> **COST**: The Azure App Service (B1) and Azure Storage Account resources incur a monthly cost. You should delete these resources when you no longer need them.

## Reference files

### env.local

```
TEAMSFX_ENV=local

BOT_ID=
TEAMS_APP_ID=
BOT_DOMAIN=
BOT_ENDPOINT=
TEAMS_APP_TENANT_ID=

BLOB_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
BLOB_STORAGE_CONTAINER_NAME=state

APP_BACKEND_ENDPOINT=https://app-backend-{randomid}.azurewebsites.net
```

> NOTE: You need to replace the `APP_BACKEND_ENDPOINT` value with the URL of your provisioned backend.

### env.local.user

```
SECRET_BOT_PASSWORD=
```

### env.dev

```
TEAMSFX_ENV=dev

AZURE_SUBSCRIPTION_ID=
AZURE_RESOURCE_GROUP_NAME=
RESOURCE_SUFFIX=

BOT_ID=
TEAMS_APP_ID=
BOT_AZURE_APP_SERVICE_RESOURCE_ID=
BOT_DOMAIN=

APP_BACKEND_ENDPOINT=https://app-backend-{randomid}.azurewebsites.net
```

> NOTE: You need to replace the `APP_BACKEND_ENDPOINT` value with the URL of your provisioned backend.

### env.dev.user

```
SECRET_BOT_PASSWORD=
```
