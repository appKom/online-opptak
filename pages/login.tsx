import type { NextPage } from "next";
import Image from "next/Image";
import { useState } from "react";

const Login: NextPage = (props)=>{

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");

    return(
        <section className="h-screen">
  <div className="px-6 h-full text-gray-800">
    <div
      className="flex justify-center lg:pt-20 flex-wrap h-full g-6"
    >
      <div className="xl:w-6/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
        <form>
            <div className="text-center">
                <h1 className="p-[4rem] font-bold text-6xl leading-[5rem]">Logg inn med <Image src="https://old.online.ntnu.no/wiki/70/plugin/attachments/download/679/" width="200" height="200" className="m-auto" alt=""/>brukeren din</h1>
            </div>
          <div className="mb-6">
            
            <input
              type="text"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleFormControlInput2"
              placeholder="Brukernavn"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>


          <div className="mb-6">
            <input
              type="password"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleFormControlInput2"
              placeholder="Passord"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button
              type="button"
              className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={()=>console.log(username,password)}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
    )
}

export default Login;
