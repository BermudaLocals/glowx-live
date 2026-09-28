'use client'
import { LeftNav } from '../components/LeftNav'

const FEED_VIDEOS = [
  'https://videos.pexels.com/video-files/5310859/5310859-uhd_1440_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3191576/3191576-hd_1280_720_25fps.mp4',
]

export default function HomeFeed() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] flex">
      <LeftNav />
      <div className="flex-1 max-w- mx-auto border-x bg-white min-h-screen">
        <div className="p-4 border-b font-bold">Home</div>
        {FEED_VIDEOS.map((src,i)=>(
          <div key={i} className="border-b">
            <div className="p-4 flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-zinc-200" />
              <div><p className="font-bold text-sm">Aitana Lopez</p><p className="text-xs text-zinc-500">@fit_aitana</p></div>
            </div>
            <video autoPlay muted loop playsInline controls className="w-full aspect-[4/5] object-cover bg-black" src={src} />
            <div className="p-4 flex gap-4 text-sm">❤️ 1.2k 💬 84 🔗</div>
          </div>
        ))}
      </div>
      <div className="w- p-6 hidden lg:block">
        <div className="flex justify-end gap-3 mb-6"><span className="text-sm">0.00 $</span> 🔔 💬</div>
        <h3 className="font-bold mb-4">Suggested Creators</h3>
        {[1,2,3].map(i=>(
          <div key={i} className="relative h- rounded-xl overflow-hidden mb-3 bg-black">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" src={FEED_VIDEOS[i%2]} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-2 left-2 flex gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-white" />
              <div className="text-white text-xs"><p className="font-bold">Bella Bianchi</p><p>@italianluna</p></div>
            </div>
            <button className="absolute top-2 right-2 bg-white text-black text-xs px-3 py-1 rounded-full">Follow</button>
          </div>
        ))}
      </div>
    </div>
  )
}
