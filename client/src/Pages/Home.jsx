import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Keep your original CSS file
import ResponsiveAppBar from "../components/AppBar";

function Home({ userData, handleLogout }) {
    const [swiperReady, setSwiperReady] = useState(false);

    const slides = [
        {
            img: "/images/Photography.jpg",
            title: "Exploring...",
            date: "10 Mar 2025"
        },
        {
            img: "/images/IMG_20250128_155241213_HDR_AE.jpg",
            title: "Traditional 2025",
            date: "28 Jan 2025"
        },
        {
            img: "/images/Rajesj_Sir.jpg",
            title: "BirthDay Boyy....",
            date: "24 Jan 2025"
        },
        // {
        //     img: "/images/Winner_Winner.jpg",
        //     title: "Winner_Winner..",
        //     date: "16 Oct 2024"
        // },
        {
            img: "/images/Have_a_Break.jpg",
            title: "Have_a_Break",
            date: "09 Dec 2024"
        }
    ];

    useEffect(() => {
        const initSwiper = () => {
            if (window.Swiper) {
                new window.Swiper('.swiper', {
                    slidesPerView: 1,
                    centeredSlides: true,
                    spaceBetween: 30,
                    loop: true,
                    effect: 'coverflow',
                    coverflowEffect: {
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        640: {
                            slidesPerView: 1.5,
                            spaceBetween: 20
                        },
                        1024: {
                            slidesPerView: 2.5,
                            spaceBetween: 30
                        }
                    }
                });
                return true;
            }
            return false;
        };

        if (!initSwiper()) {
            const interval = setInterval(() => {
                if (initSwiper()) {
                    clearInterval(interval);
                    setSwiperReady(true);
                }
            }, 100);
            return () => clearInterval(interval);
        } else {
            setSwiperReady(true);
        }
    }, []);

    return (
        <div className="visual-diary-app">
            <ResponsiveAppBar
                userData={userData}
                onLogout={handleLogout}
            />

            {/* Swiper with original class names */}
            <div className="swiper-container" style={{
                height: '90vh',
                opacity: swiperReady ? 1 : 0,
                transition: 'opacity 0.5s ease'
            }}>
                <div className="swiper">
                    <div className="swiper-wrapper">
                        {slides.map((slide, index) => (
                            <div className="swiper-slide" key={index}>
                                <div className="slide-card">
                                    <img
                                        src={slide.img}
                                        alt={slide.title}
                                        className="slide-card-img-top"
                                        style={{ height: '85%', objectFit: 'cover' }}
                                    />
                                    <div className="slide-card-body">
                                        <h5>{slide.title}</h5>
                                        <span className="d-block text-muted small">{slide.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
            </div>
        </div>
    );
}

export default Home;