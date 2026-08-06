import React from 'react'
import { Link } from 'react-router-dom'
import arrow from '../assets/icons/arrow.svg'

const InfoBox=({text,link,btnText})=>(
    <div className="info-box">
        <p className="font-medium sm:text-xl text-center">{text}</p>
        <Link to ={link} className="neo-brutalism-white neo-btn w-8">
            {btnText}
        <img src={arrow}className="w-8 h-4 object-contain"/>
        </Link>
    </div>
)
const renderContent ={
   1: (
        <h1 className="sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5">
            Hi 👋, We are  <span className= "font-semibold"> Team Bravos ✶ </span>

            <br/>
           <span className= "font-light">◀ Crafting effortless comfort for every step you take ▶</span>
        </h1>
    ),
     2: (
        <InfoBox
        text="Shop our Products 👟 "

        link="/projects"
        btnText="Buy Now"
        />
    ),
     3: (
        
            <InfoBox
        text="Customise your pair of Shoes now 🟢"

        link="/ShoeCustomizer"
        btnText="Customise"
        />
        
    ),
     4: (
        <InfoBox
        text="Know about our Product ⓘ"

        link="/AppleStyleLanding"
        btnText=" Click here"
        />
    ),
    
}



const HomeInfo = ({currentStage}) => {
  return renderContent[currentStage] || null ;
    
  
}

export default HomeInfo
