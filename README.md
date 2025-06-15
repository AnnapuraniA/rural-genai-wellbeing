# Rural GenAI Wellbeing Platform

A comprehensive healthcare platform for rural areas, connecting patients with Health Sakhis and providing access to essential healthcare services.

## Features

- Interactive map showing nearby healthcare facilities
- Real-time messaging with Health Sakhis
- Educational video content
- Health history tracking
- Appointment scheduling

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Download Leaflet marker icons:
   - Create a directory: `public/images/`
   - Download the following files from [Leaflet's GitHub repository](https://github.com/Leaflet/Leaflet/tree/main/dist/images):
     - `marker-icon.png`
     - `marker-icon-2x.png`
     - `marker-shadow.png`
   - Place them in the `public/images/` directory

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

- `src/components/` - React components
- `src/data/` - Mock data and types
- `src/types/` - TypeScript interfaces
- `public/` - Static assets

## Technologies Used

- React
- TypeScript
- Vite
- React Bootstrap
- Leaflet (for maps)
- React Leaflet

## Development

The project uses:
- TypeScript for type safety
- React Bootstrap for UI components
- Leaflet for interactive maps
- Mock data for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Project info

**URL**: https://lovable.dev/projects/818855fa-f01f-4c02-80e0-e7eae20131d3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/818855fa-f01f-4c02-80e0-e7eae20131d3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/818855fa-f01f-4c02-80e0-e7eae20131d3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
