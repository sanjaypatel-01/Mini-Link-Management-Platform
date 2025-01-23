import React from "react";
import bgImage from '../assets/bg_image.png';

function SignUp() {
    return (
        <div className="w-full h-screen bg-blue-100 flex">
            <div className="w-1/2">
                <img className="w-full h-full object-cover" src={bgImage} alt="" />
            </div>
            <div className="w-1/2 flex flex-col">
                <div className="h-[10%] flex justify-end items-center p-12">
                    <button>SignUp</button>
                    <button className="text-white bg-blue-700 px-2 py-1 rounded ml-6">Login</button>
                </div>
                <div className="flex flex-col h-[90%] items-center">
                    <h3 className="m-6 w-3/5 text-lg">Join us Today!</h3>
                    <input className="w-3/5 border border-gray-500 p-2 rounded  mb-4" type="text"  placeholder="Name"/>
                    <input className="w-3/5 border border-gray-500 p-2 rounded  mb-4" type="email"  placeholder="Email id"/>
                    <input className="w-3/5 border border-gray-500 p-2 rounded  mb-4" type="number"  placeholder="Mobile no."/>
                    <input className="w-3/5 border border-gray-500 p-2 rounded  mb-4" type="number"  placeholder="Password"/>
                    <input className="w-3/5 border border-gray-500 p-2 rounded  mb-8" type="number"  placeholder="Confirm Password"/>
                    <button className="bg-blue-700 text-white w-3/5 rounded py-1 mb-6">Register</button>
                    <span>Already have an account? <button className="text-blue-600 font-semibold">Login</button></span>
                </div>
            </div>
            
        </div>
    ) 
}

export default SignUp;