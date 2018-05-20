# Move Club
Using Blockchain Technology to track and reward workouts.

# Roadmap
- more workout types
- add additional workout info cutom-type/photo/title/desc/sets+reps
- feed filters
- personal feed (show only friends)
- Streaks
- Leaderboards
- Achievements
- Groups


## What does it include
- Express server with routing
- Authentication with Steemconnect
- Main Feed (auth + new content modal), Profile View, About + Attributions Pages
- Data From Blockchain - stored on the @move-club.data account

## setup & install
- install node.js & NPM - [https://nodejs.org/en/](https://nodejs.org/en/)
- clone repo
- Go to [https://v2.steemconnect.com/dashboard](https://v2.steemconnect.com/dashboard) and create a new app, it currently costs 3 STEEM.
- add the Redirect URI - http://localhost:3000/auth/
- open ```config.example.js``` and rename to ```config.js``` enter your ```client_id``` from steemconnect and redirect uri to 'http://localhost:3000/auth/', update the session secret to a new secure random string
- npm install // to download dependencies
- npm start // run the project on default port 3000


## Compile SCSS & js via parcel
```npm install -g parcel-bundler```

```npm run dev``` - to watch for changes in src/ folder
```npm run build``` - builds for prod


- navigate to localhost:3000 in your browser
