
import { Link } from 'react-router-dom';
import './unAuthNavbar.css';

const UnAuthNavbar = () => {

    return (
        <div className="navBar">
            <div className="navbarTop">
                <h1>
                    <span>WE</span>
                    <span className="black"> App</span>
                </h1>
                <div>
                    <Link to={`/login`}>
                        Login
                    </Link>
                    <Link to={`/signup`}>
                        Signup
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnAuthNavbar;