import './Portfolio.css'
import { ImageGallery } from "../ImageGallery";


const GALLERY_IMAGES = [
    '../assets/GalleryImages/Bowsette2024Final.jpg',
    '../assets/GalleryImages/BulmaFinal.jpg',
    '../assets/GalleryImages/Cammy2026Final.jpg',
    '../assets/GalleryImages/Chun-li2024FinalV3.jpg',
    '../assets/GalleryImages/Day2RosalinaShaded.jpg',
    '../assets/GalleryImages/Day10MirkoFinal.jpg',
    '../assets/GalleryImages/JaneDoeFinalNoText.jpg',
    '../assets/GalleryImages/MiguFinal.jpg',
    '../assets/GalleryImages/SandyBashFinal.jpg',
    '../assets/GalleryImages/YoruichiFinal.jpg',
]

export default function Home() {
    return (
        <div>
            <h1 style = {{color: "#1E1B18"}} className= 'gallery-name'>Gallery</h1>
            <ImageGallery imageUrls={GALLERY_IMAGES} />
        </div>
    )
}