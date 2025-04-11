import React from "react"
import { CircleX } from "lucide-react"
import './ImageGallery.css'

type ImageGalleryProps = {
    imageUrls: string[]
}

export function ImageGallery({ imageUrls }: ImageGalleryProps) {

    function CloseFullImg(){
        var fullImgBox = document.getElementById("fullImgBox")
        
        fullImgBox?.style.setProperty('--full-img-status', 'none')
    }

    function OpenFullImg(pic){
        var fullImgBox = document.getElementById("fullImgBox")
        var fullImg = document.getElementById("fullImg") as HTMLImageElement
        fullImgBox?.style.setProperty('--full-img-status', 'flex')
        fullImg.src = pic
    }
    

    const imgItems = imageUrls.map(url => (
        <img src={url} key={url} className="gallery-img" onClick={() => OpenFullImg(url)} />
    ))

    

    return (
        <div>
            <div class="full-img" id="fullImgBox">
                <img src = {imageUrls[0]} id="fullImg" />
                <button onClick={CloseFullImg} className="full-img-close-btn" >
                    
                                <CircleX />
                </button>
            </div>

            <div className="image-container">
                {imgItems}
            </div>
        </div>
    )
}