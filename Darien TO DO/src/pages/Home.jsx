import React from 'react'
import ToDo from '../components/ToDoList/ToDo'
import Footer from '../components/footer/Footer'

function Home() {
  return (
    <div>
        <ToDo/>
        
        {/* <img className='img' src="wallpaper.jfif" alt="" /> */}
        {/* <svg className='waveCss' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#00cba9" fill-opacity="0.3" d="M0,256L60,245.3C120,235,240,213,360,208C480,203,600,213,720,218.7C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg> */}

    

        <Footer/>
    </div>
  )
}

export default Home
