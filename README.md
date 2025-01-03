# product-management-system

# Product Management System - Setup Instructions
Follow the steps below to set up and run the Product Management System locally.

## Prerequisites
Make sure you have the following installed:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet) (for running the backend)
- [Node.js](https://nodejs.org/) (version 16 or above for Angular)
- [Angular CLI](https://angular.io/cli) (for managing Angular projects)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

  ## Steps

### 1. Clone the Repository

Clone the repository to your local machine

# for the frontend
## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Run the server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

# for the backend
## Restore the required .NET dependencies:
-open cmd
-cd product-management-system/backend
-dotnet restore

### update the appsettings.json or the environment variables with your database connection string.

### open cmd
### dotnet run




