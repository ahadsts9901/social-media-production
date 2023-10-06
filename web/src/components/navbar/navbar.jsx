import { ChatDots, House, HouseFill, Person, PersonFill, Controller, Search as SearchBS, Bell, BellFill, PlusCircle, PlusCircleFill, PersonLock, PersonFillLock } from 'react-bootstrap-icons';
import { useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalContext } from '../../context/context';
import './navbar.css';
// import logo from '../assets/logoDark.png';
import axios from 'axios';

const Navbar = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const location = useLocation();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const resp = await axios.get(`/api/v1/ping`, {
                    withCredentials: true,
                });
                dispatch({
                    type: 'USER_LOGIN',
                    payload: resp.data.data,
                });
                state.isLogin = true;
                state.isAdmin = resp.data.data.isAdmin;
            } catch (err) {
                console.log(err);
                dispatch({
                    type: 'USER_LOGOUT',
                });
                state.isLogin = false;
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <div className="navBar">
            <div className="navbarTop">
                <h1>
                    <span>WE</span>
                    <span className="black"> App</span>
                </h1>
                <div>
                    <Link to={`/search`}>
                        <SearchBS className="navIcons" />
                    </Link>
                    <Link to={`/chat`}>
                        <ChatDots className="navIcons" />
                    </Link>
                    {(state.isAdmin === true || state.isAdmin === "true") ?

                        <Link to={`/admin`}>
                            {location.pathname === '/admin' || location.pathname === '/admin/' ? (
                                <PersonFillLock className="navIcons" />
                            ) : (
                                <PersonLock className="navIcons" />
                            )}
                        </Link>

                        // <Link to={`/admin`}>
                        //     <PersonLinesFill className="navIcons" />
                        // </Link> 


                        : null}
                </div>
            </div>
            <div className="navbarBottom">
                <Link to="/">
                    {location.pathname === '/' ? (
                        <HouseFill className="navIcons active" />
                    ) : (
                        <House className="navIcons" />
                    )}
                </Link>
                <Link to="/games">
                    {location.pathname === '/games' || location.pathname === '/games/' ? (
                        <Controller className="navIcons active" />
                    ) : (
                        <Controller className="navIcons" />
                    )}
                </Link>
                <Link to="/create">
                    {location.pathname === '/create' || location.pathname === '/create/' ? (
                        <PlusCircleFill className="add active" />
                    ) : (
                        <PlusCircle className="add" />
                    )}
                </Link>
                <Link to="/notifications">
                    {location.pathname === '/notifications' || location.pathname === '/notifications/' ? (
                        <BellFill className="navIcons active" />
                    ) : (
                        <Bell className="navIcons" />
                    )}
                </Link>
                <Link to={`/profile/${state.user.userId}`}>
                    {location.pathname === '/profile' || location.pathname === '/profile/' ? (
                        <PersonFill className="navIcons active" />
                    ) : (
                        <Person className="navIcons" />
                    )}
                </Link>
            </div>
        </div>
    );
};

export default Navbar;