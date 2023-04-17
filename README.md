#🎵 MeetMusic 🎵

Designation: A social network for creating connections and collaborations between artists, singers and musicians, and for sharing music between people.

Link to the website: https://meetmusic.onrender.com

Possible actions:
A user can - register and log in, see his last connections and log in through them, see his page, edit his details and exit the application.
In addition, the user is shown people he follows and people he may know based on an algorithm.
The user can search for another user and see their page, and their followers and those he follows them.
The user can add or remove a follower for any registered user (except himself).
Posts: it is possible to create a post with content (text / images (up to 9) / audio (only 1) / both), edit and delete it.
He can also share another user's post, edit and delete the shared post.
Also, you can add a like to a post or remove it from it, comment, reply, with option to an infinite number of comments to comments, edit and delete the comments.
On the home page, the user is shown his posts and those of the users he follows them in chronological order, and additional posts of people he does not follow - one post for the user randomly according to an algorithm, and the possibility of following on top of the post.
Notifications: The user receives a welcome notification when he enters the application, and additional notifications for every follow / like a post / reply to a post / reply to a reply / share a post that he receives from another user, and has the option to mark them as "readed".
The application is responds well up to a screen width of 320 pixels, and a loading sign appears on the screen (loader) in every action that requires time.

## 🛠 Main technologies
### Front-End
ReactJS, Material-UI

### Back-End
NodeJS, Express, Mongoose(MongoDB), Cloudinary

## ⚙️ Local execution
- Clone this repo
- Run `npm i` on the root-dir and `client` dirs - To install all the dependencies

#### Seed the DB (Mongoose)
- Create [MondoDB account](https://account.mongodb.com/account/login) and create a DB. <br/>

- Create `.env` file in the root-dir with the following fields (can be found in the 'connect' section in Mongo Atlas) <br/>
  - `DB_USER = "<Your DB user name>"` <br/>
  - `DB_PASS = "<Your DB password>"` <br/>
  - `DB_HOST = "<Your DB host>"` <br/>
  - `DB_NAME = "<Your DB name>"` <br/>

#### More .env fields
- Port:
  - `PORT=7000` <br />
- User auth:
  - `ACCESS_TOKEN_SECRET="<Your access token secret>"` (can be a dummy string like "secret string") <br />
  - `REFRESH_TOKEN_SECRET="<Your refresh token secret>"` (can be a dummy string like "secret string") <br />
- Cloudinary: (You can create your [cloudinary account here](https://cloudinary.com/)) <br />
  - `CLOUDINARY_CLOUD_NAME = "<Your cloudinary cloud name>"` <br />
  - `CLOUDINARY_API_KEY = "<Your cloudinary API Key>"` <br />
  - `CLOUDINARY_API_SECRET = "<Your cloudinary API Secret>"` <br />

#### Run the app
- Change `base_url` variables on `client\src\config\config.json` to look like this: <br />
`"_base_url": "https://meetmusic.onrender.com",` <br />
  `"base_url": "http://localhost:7000"` <br />
- Run `npm run dev` on the root-dir <br />
- The app will run at http://localhost:3000

