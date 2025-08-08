import c1 from '../assets/c1.jpg'
import c2 from '../assets/c2.jpg'
import c3 from '../assets/c3.jpg'
import c4 from '../assets/c4.jpg'
import c5 from '../assets/c5.jpg'
import c6 from '../assets/c6.jpg'

export default function CarouselAuth() {
    return (
        <>
            <div className="carousel rounded-box w-64 lg:w-[500px] m-2">
                <div className="carousel-item w-full">
                    <img
                        src={c1}
                        className="w-full"
                        alt="light novel" />
                </div>
                <div className="carousel-item w-full">
                    <img
                        src={c2}
                        className="w-full"
                        alt="light novel" />
                </div>
                <div className="carousel-item w-full">
                    <img
                        src={c3}
                        className="w-full"
                        alt="light novel" />
                </div>
                <div className="carousel-item w-full">
                    <img
                        src={c4}
                        className="w-full"
                        alt="manga" />
                </div>
                <div className="carousel-item w-full">
                    <img
                        src={c5}
                        className="w-full"
                        alt="manga" />
                </div>
                <div className="carousel-item w-full">
                    <img
                        src={c6}
                        className="w-full"
                        alt="manga" />
                </div>
            </div>
        </>
    )
}
