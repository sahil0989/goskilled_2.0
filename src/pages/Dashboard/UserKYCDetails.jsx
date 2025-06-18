import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Label } from '../../@/components/ui/label'
import { Input } from '../../@/components/ui/input'
import { Button } from '../../@/components/ui/button'
import { mediaPhotoDeleteService, mediaUploadService } from '../../api/ApiCall'

export default function UserKYCDetails({ user, handleVerifyKYC }) {
  // eslint-disable-next-line
  const [progressPercentage, setProgressPercentage] = useState(0)

  const [addressDocUpload, setAddressDocUpload] = useState({
    url: "",
    uniqueId: "",
    name: "addressDocUpload",
    loading: false
  })
  const [panUpload, setPanUpload] = useState({
    url: "",
    uniqueId: "",
    name: "panUpload",
    loading: false
  })
  const [bankDocumentFile, setBankDocumentFile] = useState({
    url: "",
    uniqueId: "",
    name: "bankDocumentFile",
    loading: false
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState("")

  useEffect(() => {
    if (user) {
      setAddressDocUpload({
        url: user?.kycDetails?.addressProofDocument || "",
        uniqueId: user?.kycDetails?.addressProofDocumentUniqueId || "",
        name: "addressDocUpload",
        loading: false
      });

      setBankDocumentFile({
        url: user?.kycDetails?.bankDocument || "",
        uniqueId: user?.kycDetails?.bankDocumentUniqueId || "",
        name: "bankDocumentFile",
        loading: false
      });

      setPanUpload({
        url: user?.kycDetails?.panCard || "",
        uniqueId: user?.kycDetails?.panCardUniqueId || "",
        name: "panUpload",
        loading: false
      });
    }
  }, [user]);


  const openModal = (url) => {
    setModalImageUrl(url)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalImageUrl("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = {}
    formData.forEach((value, key) => (data[key] = value))

    data.addressDocUpload = addressDocUpload
    data.panUpload = panUpload
    data.bankDocumentFile = bankDocumentFile

    if (checkDissableFunc()) {
      handleVerifyKYC(data)
    } else {
      alert("Please upload all required documents.")
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    const name = e.target.name

    if (name === "addressDocUpload") { setAddressDocUpload(prev => ({ ...prev, loading: true })); }
    else if (name === "panUpload") { setPanUpload(prev => ({ ...prev, loading: true })) }
    else if (name === "bankDocumentFile") { setBankDocumentFile(prev => ({ ...prev, loading: true })) }

    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      const response = await mediaUploadService(formData, setProgressPercentage)

      if (response) {
        const uploaded = {
          url: response?.data?.url,
          uniqueId: response?.data?.public_id,
          name,
        }
        if (name === "addressDocUpload") setAddressDocUpload(uploaded)
        else if (name === "panUpload") setPanUpload(uploaded)
        else if (name === "bankDocumentFile") setBankDocumentFile(uploaded)
      }
    }

    if (name === "addressDocUpload") { setAddressDocUpload(prev => ({ ...prev, loading: false })) }
    else if (name === "panUpload") { setPanUpload(prev => ({ ...prev, loading: false })) }
    else if (name === "bankDocumentFile") { setBankDocumentFile(prev => ({ ...prev, loading: false })) }
  }

  const handleReplaceDocFunc = async (data) => {
    if (data.name === "addressDocUpload") {

      const id = addressDocUpload?.uniqueId;
      await mediaPhotoDeleteService(id);

      setAddressDocUpload({ url: "", uniqueId: "", name: "addressDocUpload" })
    } else if (data.name === "panUpload") setPanUpload({ url: "", uniqueId: "", name: "panUpload" })
    else if (data.name === "bankDocumentFile") setBankDocumentFile({ url: "", uniqueId: "", name: "bankDocumentFile" })
  }

  const checkDissableFunc = () => {
    return (
      addressDocUpload.url &&
      panUpload.url &&
      bankDocumentFile.url
    )
  };

  const isReadOnly = user?.kycStatus === "pending" || user?.kycStatus === "approved" || user?.kycStatus === "verified";

  return (
    <div className='bg-white shadow-md rounded-lg p-6 mb-6'>

      <div className='flex  justify-between items-center'>
        <h2 className='text-xl font-bold mb-4'>Hello, {user?.name} !!</h2>
        <h4 className={`px-6 py-2 rounded-lg scale-75 md:scale-100 capitalize cursor-none ${user?.kycStatus === 'pending' ? 'bg-yellow-500 text-black' : user?.kycStatus === 'approved' ? 'bg-green-700 text-white' : 'bg-red-600 text-white'}`}>{user?.kycStatus}</h4>
      </div>

      {user?.kycStatus === 'rejected' && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded my-6">
          <span className='font-semibold'>Reason of Rejection : </span>{user?.kycDetails?.rejectionReason}
        </div>
      )}

      <div className='text-xl font-semibold mb-5'>KYC Details:</div>

      <form onSubmit={handleSubmit}>
        {/* initial row  */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6'>

          <div className="space-y-2">
            <Label htmlFor="emailId">Email ID:</Label>
            <Input id="emailId" value={user?.email} name="emailId" placeholder="1234567890" disabled required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number: </Label>
            <Input id="phoneNumber" value={user?.mobileNumber} name="phoneNumber" disabled placeholder="1234567890" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsAppNumber">WhatsApp Number:</Label>
            <Input
              type="tel"
              inputMode="numeric"
              id="whatsAppNumber"
              name="whatsAppNumber"
              placeholder="1234567890"
              defaultValue={user?.kycDetails?.whatsAppNumber || ""}
              required
              disabled={isReadOnly}
              pattern="^[6-9]\d{9}$"
              title="Enter a valid 10-digit WhatsApp number starting with 6-9"
            />
          </div>

        </div>

        {/* First Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6'>
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type:</Label>
            <select id="documentType" name="documentType"
              defaultValue={user?.kycDetails?.documentType || ""}
              required disabled={isReadOnly} className={`w-full border border-gray-300 rounded-md p-2`}>
              <option value="">Select a document</option>
              <option value="Aadhar Card">Aadhar Card</option>
              <option value="Passport">Passport</option>
              <option value="Voter ID">Voter ID</option>
              <option value="Driving License">Driving License</option>
              <option value="Utility Bill">Utility Bill</option>
              <option value="Ration Card">Ration Card</option>
              <option value="Bank Statement">Bank Statement</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentNumber">Document Number:</Label>
            <Input id="documentNumber" name="documentNumber"
              defaultValue={user?.kycDetails?.documentNumber || ""}
              disabled={isReadOnly} placeholder="1234567890" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressDocUpload">Upload Address Document:</Label>
            {addressDocUpload?.loading && !addressDocUpload?.url ? (
              <div className='border rounded-md px-4 py-1 font-semibold'>Uploading...</div>
            ) : addressDocUpload?.url ? (
              <div className='flex gap-4 items-center border rounded-md'>
                <Button type="button" variant="link" onClick={() => openModal(addressDocUpload?.url)}>View Document</Button>
                <Button disabled={isReadOnly} type="button" onClick={() => handleReplaceDocFunc(addressDocUpload)} size="sm" className="px-2 py-1 font-normal">Replace</Button>
              </div>
            ) : (
              <Input
                type="file"
                id="addressDocUpload"
                name="addressDocUpload"
                onChange={handleUpload}
                accept=".jpg,.jpeg,.png,.pdf"
                required
                disabled={isReadOnly}
              />
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6'>
          <div className="space-y-2">
            <Label htmlFor="panUpload">Upload PAN Card:</Label>
            {panUpload?.loading && !panUpload?.url ? (
              <div className='border rounded-md px-4 py-1 font-semibold'>Uploading...</div>
            ) : panUpload?.url ? (
              <div className='flex gap-4 items-center border rounded-md'>
                <Button type="button" variant="link" onClick={() => openModal(panUpload?.url)}>View Document</Button>
                <Button disabled={isReadOnly} type="button" onClick={() => handleReplaceDocFunc(panUpload)} size="sm" className="px-2 py-1 font-normal">Replace</Button>
              </div>
            ) : (
              <Input
                type="file"
                id="panUpload"
                name="panUpload"
                onChange={handleUpload}
                accept=".jpg,.jpeg,.png,.pdf"
                required
                disabled={isReadOnly}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="panNumber">PAN Number:</Label>
            <Input id="panNumber" name="panNumber" disabled={isReadOnly}
              defaultValue={user?.kycDetails?.panNumber || ""}
              placeholder="ABCDE1234F" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name:</Label>
            <select id="bankName" name="bankName" required disabled={isReadOnly}
              defaultValue={user?.kycDetails?.bankName || ""}
              className="w-full border border-gray-300 rounded-md p-2">
              <option value="">Select a bank</option>
              <option value="State Bank of India">State Bank of India</option>
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="Axis Bank">Axis Bank</option>
              <option value="Punjab National Bank">Punjab National Bank</option>
              <option value="Bank of Baroda">Bank of Baroda</option>
              <option value="Canara Bank">Canara Bank</option>
              <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              <option value="Union Bank of India">Union Bank of India</option>
              <option value="IDBI Bank">IDBI Bank</option>
            </select>
          </div>
        </div>

        {/* Third Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6'>
          <div className="space-y-2">
            <Label htmlFor="accHolderName">Account Holder Name:</Label>
            <Input id="accHolderName" name="accHolderName" placeholder="Your Name"
              defaultValue={user?.kycDetails?.accountHolderName || ""}
              required disabled={isReadOnly} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accNumber">Account Number:</Label>
            <Input id="accNumber" name="accNumber" placeholder="XXXX-XXXX-XXXX"
              defaultValue={user?.kycDetails?.accountNumber || ""}
              required disabled={isReadOnly} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifsc">IFSC Code:</Label>
            <Input id="ifsc" name="ifsc" placeholder="ABCD0123456"
              defaultValue={user?.kycDetails?.ifscCode || ""}
              required disabled={isReadOnly} />
          </div>
        </div>

        {/* Fourth Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6'>
          <div className="space-y-2">
            <Label htmlFor="bankDocumentType">Bank Document Type:</Label>
            <select id="bankDocumentType" name="bankDocumentType"
              defaultValue={user?.kycDetails?.bankDocumentType || ""}
              required disabled={isReadOnly} className="w-full border border-gray-300 rounded-md p-2">
              <option value="">Select a document</option>
              <option value="Cancelled Cheque">Cancelled Cheque</option>
              <option value="Passbook First Page">Passbook First Page</option>
              <option value="Bank Statement">Bank Statement</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankDocumentFile">Upload Bank Document:</Label>
            {bankDocumentFile?.loading && !bankDocumentFile.url ? (
              <div className='border rounded-md px-4 py-1 font-semibold'>Uploading...</div>
            ) : bankDocumentFile.url ? (
              <div className='flex gap-4 items-center border rounded-md'>
                <Button type="button" variant="link" onClick={() => openModal(bankDocumentFile.url)}>View Document</Button>
                <Button disabled={isReadOnly} type="button" onClick={() => handleReplaceDocFunc(bankDocumentFile)} size="sm" className="px-2 py-1 font-normal">Replace</Button>
              </div>
            ) : (
              <Input
                type="file"
                id="bankDocumentFile"
                name="bankDocumentFile"
                onChange={handleUpload}
                accept=".jpg,.jpeg,.png,.pdf"
                required
                disabled={isReadOnly}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accNumber">UPI ID:</Label>
            <Input id="upiId" name="upiId" placeholder="example@upi"
              defaultValue={user?.kycDetails?.upiId || ""}
              required disabled={isReadOnly} />
          </div>

        </div>

        <div className='w-full flex justify-center'>
          <Button type="submit" disabled={!checkDissableFunc() || isReadOnly}>
            Submit for Verification
          </Button>
        </div>
      </form>

      {/* Modal for viewing document */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
                    Uploaded Document
                  </Dialog.Title>
                  {modalImageUrl.endsWith('.pdf') ? (
                    <iframe src={modalImageUrl} title="PDF Document" className="w-full h-[500px]" />
                  ) : (
                    <img src={modalImageUrl} alt="Uploaded document" className="w-full max-h-[500px] object-contain" />
                  )}
                  <div className="mt-4">
                    <Button onClick={closeModal}>Close</Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
