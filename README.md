# 🎵 MeetMusic 🎵

An online social network for musicians to connect with each other, share content, <br />
connecting with people with similar interests, and more.

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

- **Create `.env` file in the root-dir with the following fields** (can be found in the 'connect' section in Mongo Atlas) <br/>
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
- Change `base_url` variables on `client\src\config\config.json` to looks like this: <br />
`"_base_url": "https://meetmusic.onrender.com",` <br />
  `"base_url": "http://localhost:7000"` <br />
- Run `npm run dev` on the root-dir <br />
- The app will run at http://localhost:3000
