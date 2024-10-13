# Online-opptak

Online-opptak is a web application built with Next.js. It's designed to make the process of applying to committees at Online easier for both the applicants and the committees. This platform helps organize and manage applications, making everything simpler and more straightforward for everyone.

## Getting Started

### Prerequisites

Before you start, make sure you have Node.js and npm/yarn installed on your machine.

### Setup

Clone the repository to your local machine:

```bash
git clone https://github.com/appKom/online-opptak.git
```

Navigate into the project directory:

```bash
cd online-opptak
```

Install the dependencies:

```bash
npm install
# or
yarn install
```

### Environment Variables

Copy the .env.local.template file to .env.local and fill in the necessary environment variables:

```bash
cp .env.local.template .env.local
```

- **NODE_ENV**: Specifies the environment in which the app is running. Should be `development` for local development
- **MONGODB_URI**: The connection string to connect to a MongoDB database.
- **ADMIN_EMAILS**: A list or comma-separated string of email addresses with administrative privileges.
- **NEXTAUTH_URL**: The base URL of the application used by NextAuth for authentication callbacks. Should be `http://localhost:3000/` for local development.
- **NEXTAUTH_SECRET**: A random string used to sign and encrypt session cookies in NextAuth to ensure their security. Generate your secret with `openssl rand -hex 32`.
- **AUTH0_CLIENT_ID**: The client ID from Auth0 provider.
- **AUTH0_CLIENT_SECRET**: The secret key from Auth0 provider.
- **AUTH0_ISSUER**: The base URL of the Auth0 domain.
- **AWS_SECRET_ACCESS_KEY**: The access key for accessing AWS.
- **AWS_ACCESS_KEY_ID**: The access key ID for an AWS account.
- **TWILIO_ACCOUNT_SID**: The Account SID from Twilio.
- **TWILIO_AUTH_TOKEN**: The authentication token from Twilio.

For access to the application's environment variables, please contact Appkom at <appkom@online.ntnu.no>.

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open <http://localhost:3000> with your browser to see the result.
