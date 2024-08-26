import { Link } from "react-router-dom"


export const Join = () => {
    return (
        <>
            <div className='flex justify-center items-center h-screen bg-gradient-to-br from-indigo-600 to-sky-500'>
                <Link to="/chat">
                    <button className='p-4 bg-black text-white font-mono rounded-md hover:bg-slate-800 transition hover:-translate-y-2'>Join Room</button>
                </Link>

            </div>
        </>
    )
}

