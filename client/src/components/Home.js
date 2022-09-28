import React from 'react'
import style from './Home.module.css';
import PeopleYouFollow from './PeopleYouFollow';
import PeopleYouMayKnow from './PeopleYouMayKnow';
import PostComponent from './PostComponent';

const Home = () => {
  return (
    <div className={style.homePage}>
      <div className={style.peopleYouMayKnow}>
        <h1 className={style.titleOfPeopleYouMayKnow}>People you may know</h1>
        <PeopleYouMayKnow />
        <PeopleYouMayKnow />
        <PeopleYouMayKnow />
        <PeopleYouMayKnow />
        <PeopleYouMayKnow />
      </div>
      <div className={style.postComponent}>
        <div className={style.containerPostComponents}>
          <PostComponent />
          <PostComponent />
          <PostComponent />
          <PostComponent />
          <PostComponent />
        </div>
      </div>
      <div className={style.peopleYouFollow}>
        <h1 className={style.titleOfPeopleYouFollow}>People you follow</h1>
        <PeopleYouFollow />
        <PeopleYouFollow />
        <PeopleYouFollow />
        <PeopleYouFollow />
        <PeopleYouFollow />
      </div>
    </div>
  )
}

export default Home;