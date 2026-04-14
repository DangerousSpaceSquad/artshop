import './Portfolio.css'
import { ImageGallery } from "../ImageGallery";


const GALLERY_IMAGES = [
    '/src/assets/GalleryImages/Bowsette2024Final.jpg',
    '/src/assets/GalleryImages/BulmaFinal.jpg',
    '/src/assets/GalleryImages/Cammy2026Final.jpg',
    '/src/assets/GalleryImages/Chun-li2024FinalV3.jpg',
    '/src/assets/GalleryImages/Day2RosalinaShaded.jpg',
    '/src/assets/GalleryImages/Day10MirkoFinal.jpg',
    '/src/assets/GalleryImages/JaneDoeFinalNoText.jpg',
    '/src/assets/GalleryImages/MiguFinal.jpg',
    '/src/assets/GalleryImages/SandyBashFinal.jpg',
    '/src/assets/GalleryImages/YoruichiFinal.jpg',
]

export default function Home() {
    return (
        <div>
            <h1 style = {{color: "#1E1B18"}} className= 'gallery-name'>Gallery</h1>
            <ImageGallery imageUrls={GALLERY_IMAGES} />
        </div>
    )
}