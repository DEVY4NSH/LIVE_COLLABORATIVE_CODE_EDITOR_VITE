import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../actions.jsx';
import Client from '../components/Clients';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const EditorPage = () => {

    const [theme, setTheme] = useState("DARK");
    const [isToggled, setIsToggled] = useState(false);

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [sideBarVisible,setSideBar] = useState(true);

    const sideBarVisibility = () =>{
        setSideBar((prev)=>(!prev));
    }

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
                toast('Sorry for the inconvinience. Server was dormant for a while ! It would take a minute to start.', {
                    icon: '⚠️',
                    style: {
                        border: '1px solid #FFA500',
                        padding: '16px',
                        color: '#FFA500',
                    },
                });
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // socketRef.current.on(ACTIONS.JOIN_ERROR, ({ error }) => {
            //     toast('This is a warning message', {
            //         icon: '⚠️',
            //         style: {
            //             border: '1px solid #FFA500',
            //             padding: '16px',
            //             color: '#FFA500',
            //         },
            //     });                
            //     reactNavigator('/');
            // });
            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        // console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
          }
        }
    }, [location.state?.username, reactNavigator, roomId, socketRef]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    const changeTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'LIGHT' ? 'DARK' : 'LIGHT'));
        setIsToggled((prevIsToggled) => !prevIsToggled);
        toast.success(`Theme set to ${theme === 'DARK' ? 'LIGHT' : 'DARK'}`);
    };

    return (
        <div className="mainwrap">
            <div className="editorWrap">
                <Editor
                    settheme={theme}
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
            {sideBarVisible ? (
                <div className="aside">
                    <div className="asideInner">
                        <div className='logosort'>
                            <span className='ChangeTheme'>{theme}</span>
                            <label className="switch">
                                <input type="checkbox" checked={isToggled} onChange={changeTheme} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <button className="menuOpen btn" onClick={sideBarVisibility}>
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                        <h3>Connected</h3>
                        <div className="clientsList">
                            {clients.map((client) => (
                                <Client
                                    key={client.socketId}
                                    username={client.username}
                                />
                            ))}
                        </div>
                    </div>
                    <button className="btn copyBtn" onClick={copyRoomId}>
                        Copy ROOM ID
                    </button>
                    <button className="btn leaveBtn" onClick={leaveRoom}>
                        Leave
                    </button>
                </div>
            ) : null}
            {
                !sideBarVisible && 
                <button className="menuClosed btn" onClick={sideBarVisibility}>
                    <FontAwesomeIcon icon={faBars} size="lg"/>
                </button>
            }
            
        </div>
    );
};

export default EditorPage;