import { useEffect, useRef } from "react";

const UploadWidget = ({ setCoverImage }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dtatjlw9v',
            uploadPreset: 'punya-ucup'
        }, function (error, result) {
            if (!error && result && result.event === 'success') {
                console.log("upload success", result.info.secure_url);
                setCoverImage(result.info.secure_url);
            }
        });
    }, [setCoverImage]);

    return (
        <>
            <div>
                <button 
                onClick={(e)=>{
                    e.preventDefault();
                    widgetRef.current.open();
                }}
                className="btn btn-primary rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                    </svg>

                </button>
            </div>
        </>
    )
};
export default UploadWidget;