import './About.css'
import React from 'react';

export default function About() {
    return (
        <div className= "about-container">
            <h1 style = {{color: "black"}}>About</h1>

            <p>Hello! I’m Telrem and I create pin-up illustrations of beloved characters 
            from anime, games, and other media. I love to push myself to best my previous work
             and create new and exciting illustrations. Around 2019 my artist journey began and 
             since I have diligently been teaching myself the craft learning a host of relevant 
             skills. If you enjoy my work consider purchasing something from this store to support
              me as I continue to learn and create awesome art!</p>

            <h1 style = {{color: "black"}}>FAQ</h1>

            <h2 style = {{color: "black"}}>Q: How long do orders take to ship?</h2>
            <p>I am a one person operation both creating art and handling orders. 
                Orders will be posted the Friday of the week they are ordered though 
                there could be delays due to volume, life occurrences, or 
                delays with the shipping company. Please be patient but if you want an 
                update on your order please email telremart@gmail.com</p>

            <h2 style = {{color: "black"}}>Q: I need help with an issue specific to me!</h2>
            <p>Let me know at telremart@gmail.com and I will do my best to help!</p>

            <h2 style = {{color: "black"}}>Q: Do you take commissions?</h2>
            <p>Yep! check out <a href = "https://docs.google.com/document/d/1dre8DSOv_MJG792kHn5cOUfitHg2969ylvuGoDA8Des/edit?usp=sharing">this document</a> for all the info!</p>

            <h2 style = {{color: "black"}}>Q: What tools/programs do you use?</h2>
            <p>My drawing program of choice is Krita and I use an xp-pen artist 22R pro drawing tablet.
            For compiling reference material I use pureref.</p>

            <h2 style = {{color: "black"}}>Q: Who are your inspirations?</h2>
            <p>Many artists such as Reiq, Twaq, Merunyaa, Slugbox, Buru, among others! 
                I am also inspired by the art of anime studios like Studio Trigger and of 
                fighting games such as Street Fighter, Guilty Gear, etc.</p>

            <h2 style = {{color: "black"}}>Q: Can I repost your work?</h2>
            <p>As long as you clearly credit me and do not monetize the work then feel free!</p>

        </div>
    )
}