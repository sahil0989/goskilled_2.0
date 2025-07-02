import { toast } from 'sonner'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDetails({ user, setActiveTab }) {

  const isLoading = !user?._id;
  const [quote, setQuote] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/auth/login");
      }
    };

    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const savedQuote = sessionStorage.getItem("motivationalQuote");
    if (savedQuote) {
      setQuote(savedQuote);
    } else {
      const random = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setQuote(random);
      sessionStorage.setItem("motivationalQuote", random);
    }
  }, []);


  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied successfully!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };


  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const motivationalQuotes = [
    "Every click you make is a step closer to mastering your skills.",
    "Learning today, leading tomorrow — keep going!",
    "Your future self will thank you for showing up today.",
    "One lesson at a time — you're building something powerful.",
    "Stay consistent. Even small progress is progress.",
    "Your growth is just one module away. Keep learning!",
    "Knowledge compounds — even 10 minutes today adds up!",
    "Champions don’t quit. Keep sharpening your skills!",
    "The best investment is in yourself — and you’ve already started.",
    "You’re not just watching lessons — you’re building your future."
  ];

  const skeletonBox = 'bg-gray-200 animate-pulse rounded-md'


  return (
    <>
      {user?.kycStatus !== 'approved' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            <p className="text-sm">KYC verification is required to redeem balance.</p>
          </div>
          <button
            onClick={() => setActiveTab('KYC Verification')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md text-sm"
          >
            Verify KYC
          </button>
        </div>
      )}

      <div className='bg-white shadow-md rounded-lg p-6 mb-4'>
        {isLoading ? (
          <div className={`${skeletonBox} h-6 w-3/4 mb-4`}></div>
        ) : (
          <>
            <div className='flex flex-col md:px-8'>
              <div className='flex flex-col'>
                <h2 className='text-2xl font-bold flex flex-wrap'>
                  {getGreeting()}, <span className='capitalize pl-1'>{user?.name}!</span>
                </h2>
                <p className='text-sm text-gray-600 mt-2 italic'>{quote}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Earning Blocks  */}
      <div className='bg-white shadow-md rounded-lg p-4 md:p-6 mb-4 md:text-2xl md:font-black'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
          {['Today', 'Last 7 days', 'Last 30 days', 'Total'].map((label, idx) => {
            const color = ['bg-orange-500', 'bg-purple-600', 'bg-blue-500', 'bg-pink-500'][idx]

            return (
              <div key={label} className={`${color} w-full h-28 md:h-36 rounded-lg shadow-lg relative`}>
                <div className='flex flex-col text-white/90 justify-between w-full h-full p-4'>
                  <h4 className='font-normal text-sm md:text-base uppercase'>{label} Earning</h4>
                  {isLoading ? <div className={`${skeletonBox} h-6 w-1/2`}></div> : <h4 className='font-bold text-2xl'>Rs. 0</h4>}
                </div>
                <div className='absolute w-8 h-8 bg-white/10 top-0 right-0 rounded-full'></div>
                <div className='absolute w-8 h-8 bg-white/5 top-8 right-0 rounded-full'></div>
                <div className='absolute w-8 h-8 bg-white/5 top-0 right-8 rounded-full'></div>
              </div>
            )
          })}
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:gap-6'>
        <div className='bg-white shadow-md rounded-lg p-6 mb-4 md:text-2xl md:font-black w-full'>
          <div className='flex justify-between items-center flex-col w-full'>
            <div className='flex flex-col w-full'>
              <h3 className='font-semibold mb-2'>Share your referral Link: </h3>
              {isLoading ? (
                <div className={`${skeletonBox} h-10 w-full`}></div>
              ) : (
                <div className='w-full font-bold border-2 text-xs italic text-blue-600 line-clamp-1 rounded-md flex items-center pl-4 gap-5'>
                  <p className='line-clamp-1'>
                    {process.env.REACT_APP_FRONTEND}/referralLink?code={user?.referralCode}&id={user?._id}
                  </p>
                  <div
                    className='bg-[#1a4d10] px-6 py-3 text-white cursor-pointer rounded-r-md'
                    onClick={() =>
                      handleCopy(
                        `${process.env.REACT_APP_FRONTEND}/referralLink?code=${user?.referralCode}&id=${user?._id}`
                      )
                    }>Copy</div>
                </div>
              )}
            </div>


            <div className='flex flex-col w-full mt-6'>
              <h3 className='font-semibold mb-2'>Share your referral Code: </h3>
              {isLoading ? (
                <div className={`${skeletonBox} h-10 w-full`}></div>
              ) : (
                <div className='w-full font-bold border-2 text-xs italic text-blue-600 line-clamp-1 rounded-md flex items-center pl-4 gap-5'>
                  <p className='line-clamp-1 w-full text-lg'>{user?.referralCode}</p>
                  <div
                    className='bg-[#1a4d10] px-6 py-3 text-white cursor-pointer rounded-r-md'
                    onClick={() => handleCopy(user?.referralCode)}>Copy</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='bg-white shadow-md rounded-lg p-6 mb-4 md:text-2xl md:font-black w-full flex items-center md:justify-center'>
          {isLoading ? (
            <div className={`${skeletonBox} h-8 w-2/3`}></div>
          ) : (
            <div className='font-normal'>Total Referred Users: <span className='font-bold text-2xl pl-2'>{user?.referralLevels?.level1?.length}</span></div>
          )}
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:gap-6'>
        <div className="bg-white shadow-md rounded-lg p-6 mb-4 w-full flex justify-center items-center">
          {isLoading ? (
            <div className='flex flex-col gap-3 w-full'>
              <div className={`${skeletonBox} h-4 w-1/3 mx-auto`}></div>
              <div className={`${skeletonBox} h-8 w-1/4 mx-auto`}></div>
              <div className={`${skeletonBox} h-10 w-1/3 mx-auto`}></div>
            </div>
          ) : (
            <div>
              <h2 className="text-gray-600 text-lg mb-2">Wallet Balance</h2>
              <br />
              <p className="text-4xl font-bold">₹ {user?.wallet?.balance?.toFixed(2)}</p>
              <br className='block' />
              <button onClick={() => setActiveTab('Wallet')} className='bg-[#1a4d10] px-8 py-3 rounded-lg shadow-md text-white font-semibold'>Redeem</button>
            </div>
          )}
        </div>

        <div className='bg-white shadow-md rounded-lg p-4 md:p-6 mb-4 w-full'>
          <div className='grid grid-cols-1 py-3 gap-3 text-white'>
            {['Level 1', 'Level 2', 'Level 3'].map((level, idx) => {
              const color = ['bg-pink-500', 'bg-purple-600', 'bg-blue-600'][idx]
              const count = user?.referralLevels?.[`level${idx + 1}`]?.length || 0

              return (
                <div key={level} className={`w-full h-20 ${color} rounded-lg shadow-md px-8`}>
                  <div className='w-full h-full flex justify-between items-center'>
                    <h2 className='font-normal uppercase'>{level} Referrals</h2>
                    {isLoading ? <div className={`${skeletonBox} h-6 w-8`}></div> : <h2 className='font-bold text-2xl'>{count}</h2>}
                  </div>
                </div>
              )
            })}
            <button onClick={() => setActiveTab('Referrals')} className='bg-[#1a4d10] px-8 py-3 rounded-lg shadow-md text-white font-semibold'>View Details</button>
          </div>
        </div>
      </div>

    </>
  )
}
