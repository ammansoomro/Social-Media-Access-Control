import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YourProfile.css';
import avatar from "./images/Avatar.png";
import styled from "styled-components";
import friendPic from "./images/Friend.png";
import { FiUser } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import { CgNametag } from 'react-icons/cg';
import { MdDateRange } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import swal from 'sweetalert';
import SearchBar from "./Search"
import { Link } from "react-router-dom";

function YourProfile(props) {
    const [data, setData] = useState(null);
    const [friends, setFriends] = useState(
        [
            {
                "username": "",
            }
        ]
    );
    const [friendRequests, setFriendRequests] = useState(
        [
            {
                "username": "",
            }
        ]
    );
    console.log(data)
    const [postPrivacy, setPostPrivacy] = useState('public');
    const [postContent, setPostContent] = useState('');
    const nav = useNavigate();
    useEffect(() => {
        fetch('http://localhost:8081/getYourProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            })
            .then(data => {
                setData(data);
            });
        fetch('http://localhost:8081/getYourFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            })

            .then(data => {
                setFriends(data);
            });

        fetch('http://localhost:8081/listFriendRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })

            .then(data => {
                setFriendRequests(data);
            }
            );



    }, [props.user]);
    const newPost = () => {
        fetch('http://localhost:8081/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                postContent: postContent,
                postPrivacy: postPrivacy,
                postDate: new Date()
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            })
            .then(data => {
                setData(data);
            });
        // Clear the post content
        setPostContent('');
        // Swal Alert then reload the page
        swal({
            title: "Posted!",
            text: "New Post Created Successfully",
            icon: "success",
            button: false,
            timer: 1500
        }).then(() => {
            window.location.reload();
        });
    }

    // Fuction to change the privacy of a single post using the post id and the privacy
    const changePostPrivacy = (id, privacy) => {
        fetch('http://localhost:8081/changePostPrivacy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                postId: id,
                postPrivacy: privacy
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            })
            .then(data => {
                setData(data);
            });
        // Swal Alert then reload the page
        swal({
            title: "Privacy Changed!",
            text: "Post Privacy Changed Successfully",
            icon: "success",
            button: false,
            timer: 600
        }).then(() => {
            window.location.reload();
        });
    }

    // Fuction to change the privacy of a DoB using the DoBPrivacy and the privacy
    const changeDoBPrivacy = (privacy) => {
        fetch('http://localhost:8081/changeProfilePrivacy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                whatToChange: 'DoB',
                privacy: privacy
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            })
            .then(data => {
                setData(data);
            });
        // Swal Alert then reload the page
        swal({
            title: "Privacy Changed!",
            text: "DoB Privacy Changed Successfully",
            icon: "success",
            button: false,
            timer: 600
        }).then(() => {
            window.location.reload();
        });
    }

    const acceptFriendRequest = (id) => {
        fetch('http://localhost:8081/acceptFriendRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                requestId: id
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            })
            .then(data => {
                setData(data);
            });
        // Swal Alert then reload the page
        swal({
            title: "Friend Request Accepted!",
            text: "Friend Request Accepted Successfully",
            icon: "success",
            button: false,
            timer: 600
        }).then(() => {
            window.location.reload();
        });
    }

    const rejectFriendRequest = (id) => {
        fetch('http://localhost:8081/declineFriendRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                requestId: id
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            })
            .then(data => {
                setData(data);
            });
        // Swal Alert then reload the page
        swal({
            title: "Friend Request Rejected!",
            text: "Friend Request Rejected Successfully",
            icon: "success",
            button: false,
            timer: 600
        }).then(() => {
            window.location.reload();
        });
    }

    // Fuction to change the privacy of a Email using the EmailPrivacy and the privacy
    const changeEmailPrivacy = (privacy) => {
        fetch('http://localhost:8081/changeProfilePrivacy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                whatToChange: 'email',
                privacy: privacy
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            })
            .then(data => {
                setData(data);
            });
        // Swal Alert then reload the page
        swal({
            title: "Privacy Changed!",
            text: "Email Privacy Changed Successfully",
            icon: "success",
            button: false,
            timer: 600
        }).then(() => {
            window.location.reload();
        });
    }

    // Fuction to change the privacy of a Friendship list using the friendship and the privacy
    const changeFriendshipPrivacy = (privacy) => {
        fetch('http://localhost:8081/changeProfilePrivacy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                whatToChange: 'friendship',
                privacy: privacy
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');

                }
            })
            .then(data => {
                setData(data);
            });
        // Swal Alert then reload the page
        swal({
            title: "Privacy Changed!",
            text: "Friendship Privacy Changed Successfully",
            icon: "success",
            button: false,
            timer: 600
        }).then(() => {
            window.location.reload();
        });
    }


    if (data === null) {
        return <div>Loading...</div>
    } else {
        return (
            <>
                <nav>
                    <div class="nav-left">
                        <img src="https://cdn-icons-png.flaticon.com/512/2702/2702069.png" alt="Logo" />
                        <SearchBar />
                    </div>
                    <div class="nav-middle">
                        <a href="#" class="active">
                            <i class="fa fa-home"></i>
                        </a>
                        <a href="#">
                            <i class="fa fa-user-friends"></i>
                        </a>

                        <a href="#">
                            <i class="fa fa-play-circle"></i>
                        </a>

                        <a href="#">
                            <i class="fa fa-users"></i>
                        </a>
                    </div>

                    <div class="nav-right">
                        <LogoutBtn onClick={() => {
                            localStorage.removeItem('token');
                            nav('/login');
                        }}>Logout</LogoutBtn>
                    </div>
                </nav>
                <div className="container">
                    <div class="left-panel">
                        <ul>
                            <li className="">
                                <span class="profile "></span>
                                <p>
                                    {/* Bold */}
                                    <div className="headingIcon">
                                        <FiUser />
                                    </div>
                                    <b>User Information</b>
                                </p>
                            </li>
                            <li >
                                <p>
                                    <div className="LiHeading icon">
                                        <CgNametag />
                                    </div>
                                    <b>
                                        Name
                                    </b>
                                </p>
                            </li>
                            <li>
                                <p>
                                    {data.username}
                                </p>
                            </li>
                            <li >
                                <p>
                                    <div className="LiHeading icon">
                                        <HiOutlineMail />
                                    </div>
                                    <b>
                                        Email
                                    </b>
                                    <div>
                                        <Privacy className="privacy" name="emailprivacy" id="emailprivacy" onChange={(e) => changeEmailPrivacy(e.target.value)} value={data.emailPrivacy}>
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                            <option value="friends">Friends</option>
                                            <option value="closefriends">Close Friends</option>
                                            <option value="bestfriends">Best Friends</option>
                                        </Privacy>
                                    </div>
                                </p>
                            </li>
                            <li>
                                <p>
                                    {data.email}
                                </p>
                            </li>
                            <li >
                                <p>
                                    <div className="LiHeading icon">
                                        <MdDateRange />
                                    </div>
                                    <b>
                                        Date of Birth
                                    </b>
                                    <Privacy className="privacy" name="dobprivacy" id="dobprivacy" onChange={(e) => { changeDoBPrivacy(e.target.value) }} value={data.DOBPrivacy}>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="friends">Friends</option>
                                        <option value="closefriends">Close Friends</option>
                                        <option value="bestfriends">Best Friends</option>
                                    </Privacy>
                                </p>
                            </li>
                            <li>
                                <i class="fa fa-play-circle"></i>
                                <p>
                                    {new Date(data.DOB).toDateString()}
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div class="middle-panel">

                        <div class="post create CreatePost">
                            <div class="post-top">
                                <div class="dp">
                                    <img src={avatar} alt="" />
                                </div>
                                <input type="text" placeholder='What is on your mind?' onChange={(e) => setPostContent(e.target.value)} />
                            </div>

                            <div class="post-bottom">
                                <div class="action ">
                                    <i class="fa fa-image"></i>
                                    <span>
                                        <PostPrivacySelect name="privacy" id="privacy" onChange={(e) => setPostPrivacy(e.target.value)}>
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                            <option value="friends">Friends</option>
                                            <option value="closefriends">Close Friends</option>
                                            <option value="bestfriends">Best Friends</option>
                                        </PostPrivacySelect>

                                    </span>
                                </div>
                                <div class="action">
                                    <i class="fa fa-smile"></i>
                                    <span>
                                        <Btn

                                            type="submit"
                                            value="Post"
                                            // OnClick call NewPost function
                                            onClick={newPost}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {data.posts.map((post) => {
                            return (
                                <div class="post">
                                    <div class="post-top">
                                        <div class="dp">
                                            <img src={avatar} alt="" />
                                        </div>
                                        <div class="post-info">
                                            <p class="name">{data.username}
                                                <PostPrivacy className="privacy" name="singlepostprivacy" id="singlepostprivacy" onChange={(e) => changePostPrivacy(post.postId, e.target.value)} value={post.postPrivacy}>
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                    <option value="friends">Friends</option>
                                                    <option value="closefriends">Close Friends</option>
                                                    <option value="bestfriends">Best Friends</option>
                                                </PostPrivacy></p>
                                            <span class="time">{new Date(post.postDate).toDateString()}</span>
                                        </div>
                                        <i class="fas fa-ellipsis-h"></i>
                                    </div>

                                    <div class="post-content">
                                        {post.postContent}
                                    </div>
{/* 
                                    <div class="post-bottom">
                                        <div class="action">
                                            <i class="fa fa-thumbs-up"></i>
                                            <span><b>Privacy:</b> {post.postPrivacy}</span>
                                        </div>
                                    </div> */}

                                </div>
                            )
                        })}
                    </div>
                    <div class="right-panel">
                        <div class="friends-section">
                            <h4>Friends</h4>
                            <Privacy className="privacy" name="friendsprivacy" id="friendsprivacy" onChange={(e) => changeFriendshipPrivacy(e.target.value)} value={data.friendshipPrivacy}>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                                <option value="friends">Friends</option>
                                <option value="closefriends">Close Friends</option>
                                <option value="bestfriends">Best Friends</option>
                            </Privacy>
                            {friends.map((friend) => {
                                return (
                                    <Link className='friend' to={`/YourProfile/Searched/${friend.username}`}>
                                        <div class="dp">
                                            <img src={friendPic} alt="" />
                                        </div>
                                        <p class="name">{friend.username}</p>
                                    </Link>
                                )
                            })
                            }
                        </div>
                        <div class="friends-section">
                            <h4>Friend Requests</h4>
                            {friendRequests.map((request) => {
                                return (
                                    <>
                                        <Link className='friend' to={`/YourProfile/Searched/${request.username}`}>
                                            <div class="dp">
                                                <img src={friendPic} alt="" />
                                            </div>
                                            <p class="name">{request.username}</p>
                                        </Link>
                                        <AddFriend onClick={() => acceptFriendRequest(request.requestId)}></AddFriend>
                                        <Unfriend onClick={() => rejectFriendRequest(request.requestId)}></Unfriend>
                                    </>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default YourProfile;

const Btn = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  height: 30px;
  background: #2fd09b;
  font-size:    0.8rem;
  color: #fff;
  font-family: "Poppins", sans-serif;
  /* text-transform: uppercase; */
  cursor: pointer;
  transition: ease-in-out 0.5s;
  font-weight: bold;
  border: none;
  padding: 0px 15px;

  &:hover {
    border: 3px solid #38d39f;
    color: #38d39f;
    background: transparent;
  }
`;

const AcceptBtn = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  height: 30px;
  background: #2fd09b;
  font-size:    0.8rem;
  color: #fff;
  font-family: "Poppins", sans-serif;
  /* text-transform: uppercase; */
  cursor: pointer;
  transition: ease-in-out 0.5s;
  font-weight: bold;
  border: none;
  padding: 0px 15px;

  &:hover {
    border: 3px solid #38d39f;
    color: #38d39f;
    background: transparent;
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  height: 30px;
  border: 3px solid #38d39f;
color: #38d39f;
    background: transparent;
  font-size: 0.9rem;
  font-family: "Poppins", sans-serif;
  /* text-transform: uppercase; */
  cursor: pointer;
  transition: ease-in-out 0.5s;
  font-weight: bold;
  padding: 0px 5px;

  &:hover {
    background: #38d39f;
  color: #fff;
  }
`;

const PostPrivacySelect = styled.select`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.1rem;
    height: 30px;
    background: transparent;
    font-size: 0.8rem;
    color: #2fd09b;
    font-family: "Poppins", sans-serif;
    /* text-transform: uppercase; */
    cursor: pointer;
    transition: ease-in-out 0.5s;
    font-weight: bold;
    padding: 0px 15px;
    border: none;
    border-bottom: 2px solid #2fd09b;
`;

const Privacy = styled.select`
margin-left: 10px;
width: 70px;
    background: transparent;
    font-size: 0.7rem;
    color: #2fd09b;
    font-family: "Poppins", sans-serif;
    /* text-transform: uppercase; */
    cursor: pointer;
    transition: ease-in-out 0.5s;
    border: none;
    border-bottom: 1px solid #2fd09b;
`;

const PostPrivacy = styled.select`
margin-left: 10px;
width: 70px;
    background: transparent;
    font-size: 0.7rem;
    color: #2fd09b;
    font-family: "Poppins", sans-serif;
    /* text-transform: uppercase; */
    cursor: pointer;
    transition: ease-in-out 0.5s;
    border: none;
    border-bottom: 1px solid #2fd09b;
`;

const Unfriend = styled.button`
  border-radius: 50%;
  height: 15px;
  width: 15px;
color: #d33838;
    background: #d33838;
  font-size: 0.9rem;
  font-family: "Poppins", sans-serif;
  /* text-transform: uppercase; */
  cursor: pointer;
  transition: ease-in-out 0.5s;
  font-weight: bold;
  padding: 0px 3px;
  border: none;

  &:hover {
    background: #811b1b;
  color: #fff;
  }
`;

const AddFriend = styled.button`

  margin: 0px 15px;
  border-radius: 50%;
  height: 15px;
  width: 15px;
  /* border: 2px solid #0b6447; */
color: #0db47c;
    background: #0db47c;
  font-size: 0.9rem;
  font-family: "Poppins", sans-serif;
  /* text-transform: uppercase; */
  cursor: pointer;
  transition: ease-in-out 0.5s;
  font-weight: bold;
  padding: 0px 3px;
  border: none;

  &:hover {
    background: #0b6447;
  color: #fff;
  }
`;