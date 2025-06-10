import { toast } from 'sonner'
import { generateReferralLink } from '../../api/ApiCall'

export default function UserDetails({ user, referrals, setActiveTab }) {
  const isLoading = !user || !referrals

  const handleCopy = async () => {
    try {
      const params = {
        code: user?.referralCode
      }

      const url = await generateReferralLink(params)
      await navigator.clipboard.writeText(url)
      toast.success("Referral-Code Copied Successfully!!")
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

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
          <h2 className='text-2xl font-bold flex'>
            Welcome, <span className='uppercase'>{user?.name}</span>
            <span className='hidden md:block pl-2'>in the GoSkilled Family!</span>
          </h2>
        )}

        <div className='py-4 flex flex-col gap-3'>
          {isLoading ? (
            <>
              <div className={`${skeletonBox} h-4 w-1/2`}></div>
              <div className={`${skeletonBox} h-4 w-1/3`}></div>
            </>
          ) : (
            <>
              <h2 className='font-semibold'>Email: <span>{user?.email}</span></h2>
              <h2 className='font-semibold'>Phone No. : <span>+91 {user?.mobileNumber}</span></h2>
            </>
          )}
        </div>
      </div>

      <div className='flex flex-col md:flex-row md:gap-6'>
        <div className='bg-white shadow-md rounded-lg p-6 mb-4 md:text-2xl md:font-black w-full'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex flex-col w-full'>
              <h3 className='font-semibold mb-2'>Share your referral Link: </h3>
              {isLoading ? (
                <div className={`${skeletonBox} h-10 w-full`}></div>
              ) : (
                <div className='w-full font-bold border-2 text-xs italic text-blue-600 line-clamp-1 rounded-md flex items-center pl-4 gap-5'>
                  <p className='line-clamp-1'>http://localhost:3000/referralLink?code={user?.referralCode}&id={user?._id}</p>
                  <div className='bg-[#1a4d10] px-6 py-3 text-white cursor-pointer rounded-r-md' onClick={handleCopy}>Copy</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='bg-white shadow-md rounded-lg p-6 mb-4 md:text-2xl md:font-black w-full flex items-center md:justify-center'>
          {isLoading ? (
            <div className={`${skeletonBox} h-8 w-2/3`}></div>
          ) : (
            <div className='font-normal'>Total Referred Users: <span className='font-bold text-2xl pl-2'>{referrals?.level1.length}</span></div>
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
              <p className="text-4xl font-bold">₹ {user?.wallet?.balance.toFixed(2)}</p>
              <br className='hidden md:block' />
              <button onClick={() => setActiveTab('Wallet')} className='bg-[#1a4d10] px-8 py-3 rounded-lg shadow-md text-white font-semibold'>Redeem</button>
            </div>
          )}
        </div>

        <div className='bg-white shadow-md rounded-lg p-4 md:p-6 mb-4 w-full'>
          <div className='grid grid-cols-1 py-3 gap-3 text-white'>
            {['Level 1', 'Level 2', 'Level 3'].map((level, idx) => {
              const color = ['bg-pink-500', 'bg-purple-600', 'bg-blue-600'][idx]
              const count = referrals?.[`level${idx + 1}`]?.length || 0

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
    </>
  )
}
