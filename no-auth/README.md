# ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search in Microsoft Teams (No Authentication)

This sample app demonstrates how to use a Microsoft Teams bot to chat with your data using natural language in the flow of work.

It builds on top of the [ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search](https://github.com/Azure-Samples/azure-search-openai-demo) sample.

![Chat with your data bot in Microsoft Teams](../assets/bot.png)

This project was built using: 

- [Teams Toolkit v5.0.1](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension), provides tools for building Teams apps, fast.
- [Teams AI Library (public preview)](https://www.npmjs.com/package/@microsoft/teams-ai), provides a Microsoft Teams centric approach to building bots.
- [Adaptive Cards](https://adaptivecards.io), are an open card exchange format enabling developers to exchange UI content in a common and consistent way.
- [Azurite](https://www.npmjs.com/package/azurite), provides emulation for Azure Storage during development.

## Run locally using Teams Toolkit

To run this project locally you will need to:

> **NOTE**: An Azure subscription is not required to run this sample locally, however you will require a Microsoft 365 tenant that has sideloading enabled.

1. Follow the steps to deploy the [ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search](https://github.com/Azure-Samples/azure-search-openai-demo#getting-started) sample to Azure.
1. Install `Teams Toolkit` from the `Extensions` marketplace in VSCode.
1. Clone/fork this repo to your local machine.
1. Open the `no-auth` folder in VSCode.
1. Rename `env/.env.local.sample` to `env/.env.local`.
1. Open `env/.env.local` and update the `APP_BACKEND_ENDPOINT` variable with the URL to your provisioned backend in Azure.
1. Rename `env/.env.local.user.sample` to `env/.env.local.user`.
1. Run a debug session (F5) and follow the prompts.

> **TIP**: [Join](https://developer.microsoft.com/microsoft-365/dev-program?WT.mc_id=m365-00000-garrytrinder) the Microsoft 365 Developer Program and get your _free_ developer instant sandbox with sideloading enabled.

## Deploy to Azure using Teams Toolkit

To deploy your local project you will need to:

> **NOTE**: An Azure subscription is required to deploy this project to Azure.

1. Rename `env/.env.dev.sample` to `env/.env.dev`.
1. Open `env/.env.dev` and update the `APP_BACKEND_ENDPOINT` variable with the URL to your provisioned backend in Azure.
1. Rename `env/.env.dev.user.sample` to `env/.env.dev.user`.
1. Open Teams Toolkit from the sidebar in VSCode.
1. Select `Provision` and follow steps to provision resources in Azure.
1. Select `Deploy` and follow steps to build and deploy app code to Azure.
1. Select `Publish` to publish to and approve the app in your Microsoft Teams organizational store.

The following resources will be deployed to Azure:

- Azure App Service Plan (B1)
- Azure Bot Service (Free)
- Microsoft Entra ID app registration
- Azure Storage Account

> **COST**: The Azure App Service (B1) and Azure Storage Account resources incur a monthly cost. You should delete these resources when you no longer need them.
