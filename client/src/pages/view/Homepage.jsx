
import { useEffect } from "react";
import { Header } from "./layout/Header";
import { useNavigate } from "react-router-dom";
import '../css/Homepage.css';

export default function RegisterForm(){
    const navigate = useNavigate();

    useEffect(() => {
        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if (token == null) {
        navigate('/homepage');
        }
    }, [navigate]);

    return (

        <div className='w-full'>

            {/* <!-- NAVBAR --> */}
            <Header />

            {/* <!-- HERO --> */}
            <section className="hero">
            <div className="overlay">
            <div className="hero-text">
                <h2 className='text-3xl font-bold text-blue-600'>Build Something Amazing</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Create modern websites easily.</p>
                <button>Get Started</button>
            </div>
            </div>
            </section>

            {/* <!-- FEATURES --> */}
            <section className="features">
            <h2>Our Features</h2>
            <div className="feature-grid">
                <div className="feature">
                <h3>Fast</h3>
                <p>Optimized for speed and performance.</p>
                </div>
                <div className="feature">
                <h3>Responsive</h3>
                <p>Looks great on all devices.</p>
                </div>
                <div className="feature">
                <h3>Modern</h3>
                <p>Clean and minimal design approach.</p>
                </div>
            </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
            <p>© 2026 MyBrand. All rights reserved.</p>
            </footer>

        </div>
    );
}