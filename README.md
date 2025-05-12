# Learnly

## Setup


1. Install the project dependencies:

    ```bash
    npm install
    cd functions
    npm install
    ```

2. Install the Firebase CLI globally:

    ```bash
    npm install -g firebase-tools
    ```

3. Log in to Firebase:

    ```bash
    firebase login
    ```

    If the Firebase emulators are not installed during the login process, you can install them manually:

    ```bash
    firebase setup:emulators
    ```

## Running the Project

You will need to run several commands in different terminal windows:

1. In the `functions` directory, start the TypeScript compiler in watch mode:

    ```bash
    npm run build:watch
    ```

2. In the root directory, start the Firebase emulators and the development server:

    ```bash
    cd ..
    npm run emus
    npm run webhooks
    npm run dev
    ```
3. Stripe requires two webhooks to be running for this project: webhook-stripe and webhook-stripeConnected. You can set them up by running the following command:

4. To enable full text search, you will need to run an instance of Meilisearch locally. This needs to be done _before_ adding users / creators.

  In the `functions` folder, run the command:

  ```bash
  curl -L https://install.meilisearch.com | sh
  ```

  Meili runs on port `7700` and uses a token to secure itself, so add the following to your `.env`:

  ```env
  `MEILISEARCH_URL="http://localhost:7700"`
  `MEILISEARCH_API_KEY="my-meili-token"`
  ```

  Run `npm run meilisearch`.

After running these commands, you can visit your app at `http://localhost:5173` and the Firebase emulator console at `http://localhost:4000`.



## Contributing

1. Ensure both the React and Firebase project build by running `npm run build` in the root of both projects.

2. Run `npm run lint` in the root folder to lint both projects.

3. Create a Pull Request against `dev` branch.

4. Once the pipeline passes, request a code review.
