# ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search in Microsoft Teams

This sample app demonstrates how to use a Microsoft Teams bot to chat with your data using natural language in the flow of work.

It builds on top of the [ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search](https://github.com/Azure-Samples/azure-search-openai-demo) sample.

> [!IMPORTANT]
> This sample has been tested against the 19th January 2024 [commit](https://github.com/Azure-Samples/azure-search-openai-demo/tree/5e9d142e50a624cd70e42c4c654097e2fb646d36) in the `Azure Search OpenAI Demo` repo

![Chat with your data bot in Microsoft Teams](./assets/bot.png)

This project was built using:

- [Teams Toolkit v5](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension), provides tools for building Teams apps, fast.
- [Teams AI Library](https://www.npmjs.com/package/@microsoft/teams-ai), provides a Microsoft Teams centric approach to building bots.
- [Adaptive Cards](https://adaptivecards.io), are an open card exchange format enabling developers to exchange UI content in a common and consistent way.
- [Azurite](https://www.npmjs.com/package/azurite), provides emulation for Azure Storage during development.

## Prepare

To run this project, you will need to:

1. Follow the steps to deploy the [ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search](https://github.com/Azure-Samples/azure-search-openai-demo#getting-started) sample to Azure.
1. Install Teams Toolkit from the extensions marketplace in VSCode.
1. Clone/fork this repo to your local machine.
1. Open the repo folder in VSCode.
1. In the `env/samples` folder, copy the sample files to the parent folder `env`
1. In the `env` folder, rename all files removing `.sample` from the name
1. In `.env.local`, update `APP_BACKEND_ENDPOINT` variable with the URL to your provisioned backend
1. In `.env.testtool`, update `APP_BACKEND_ENDPOINT` variable with the URL to your provisioned backend
1. In `.env.dev`, update `APP_BACKEND_ENDPOINT` variable with the URL to your provisioned backend

## Run against a simulated Microsoft 365 tenant and bot service

To run this sample:

> ![TIP]
> Use this approach if you don't have access to a Microsoft 365 tenant, are unable to use a Dev Tunnel, are unable to sideload apps into your tenant, or are unable provision Microsoft Entra ID or Bot Framework resources required to create a bot.

1. [Install](https://learn.microsoft.com/microsoft-cloud/dev/dev-proxy/get-started#install-dev-proxy) Dev Proxy on your local machine
1. Open a terminal in the root project folder
1. Execute `devproxy --config-file devProxy/use-mocks.json` to start Dev Proxy
1. Open the side bar in VS Code, select the `Run and Debug` panel
1. In the debug profile dropdown, select `Debug in Test Tool`
1. Press F5 to launch the Test Tool
1. In the `Welcome` message, select the first action button

## Run against a Microsoft 365 tenant

To run this sample:

> [!NOTE]
> An Azure subscription is not required to run this sample locally, however you will require a [Microsoft 365 tenant](https://developer.microsoft.com/microsoft-365/dev-program?WT.mc_id=m365-00000-garrytrinder) that has sideloading enabled.

1. Open the side bar in VS Code, select the `Run and Debug` panel
1. In the debug profile dropdown, select `Debug in Test Tool`
1. Press F5 to launch the Test Tool

## Deploy to Azure using Teams Toolkit

To deploy your local project you will need to:

> ![IMPORTANT]
> An Azure subscription is required to deploy this project to Azure.

1. Open the side bar in VS Code, select the `Teams Toolkit` icon
1. In the `Lifecycle` section, select `Provision` and follow steps to provision resources in Azure.
1. In the `Lifecycle` section, select `Deploy` and follow steps to build and deploy app code to Azure.
1. In the `Lifecycle` section, select `Publish` to publish to and approve the app in your Microsoft Teams organizational store.

The following resources will be deployed to Azure:

- Azure App Service Plan (B1)
- Azure Bot Service (Free)
- Microsoft Entra ID App Reg
- Azure Storage Account

> [!WARNING]
> The Azure App Service (B1) and Azure Storage Account resources incur a monthly cost. You should delete these resources when you no longer need them.