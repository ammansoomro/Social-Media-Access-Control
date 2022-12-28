import React from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { set } from 'mongoose';
const UserProfile = (props) => {
    let param = useParams();
    const [user, setUser] = useState({});
    const nav = useNavigate();
    const [posts, setPosts] = useState([
        {
            id: 1,
            name: "John Doe",
            date: "12/12/2020",
        },
    ]);
    const [friends, setFriends] = useState(
        [
            {
                "username": "",
            }
        ]
    );
    const [LoggedUserFriends, setLoggedUserFriends] = useState(
        [
            {
                "username": "",
            }
        ]
    );

    const [friendGroup, setFriendGroup] = useState("Public");

    const FindFriendGroup = () => {
        LoggedUserFriends.map((friend) => {
            console.log(friend)
            if (friend.username == user.username) {
                setFriendGroup(friend.friendGroup);
                console.log(friendGroup);
            }
        })
    }
    useEffect(() => {
        fetch('http://localhost:8081/getProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                username: param.search
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
                setUser(data);
                setPosts(data.posts);
                setFriends(data.friends);
            });

        fetch('http://localhost:8081/getYourFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    nav('/');
                }
            }
            )
            .then(data => {
                setLoggedUserFriends(data);
            }
            );
    }, [param.search])

    useEffect(() => {
        FindFriendGroup();
    }, [LoggedUserFriends])
    const ChangeFriendsPrivacy = (friendgroup) => {
        fetch('http://localhost:8081/changeFriendship', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: props.user,
                friendToChange: user.username,
                group: friendgroup
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
                swal(
                    {
                        title: "Group Updated!",
                        text: "Friend group with " + user.username + " has been updated to " + friendgroup,
                        icon: "success",
                        button: false,
                        timer: 1200
                    }
                ).then(() => {
                    nav('/YourProfile');
                });

            });
    }

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
                                {user.username}
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
                                </div>
                            </p>
                        </li>
                        <li>
                            <p>
                                {user.email}
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
                            </p>
                        </li>
                        <li>
                            <i class="fa fa-play-circle"></i>
                            <p>
                                {new Date(user.DOB).toDateString()}
                            </p>
                        </li>
                        <li >
                            <p>
                                {/* Button to Add or Unfriend based on condition */}
                                {/* If Current user is Friend to the Logged in User Print True else False */}
                                {
                                    LoggedUserFriends.some(friend => friend.username === user.username) ?
                                        <>
                                            <Unfriend className="unfriendBtn" onClick={() => {
                                                fetch('http://localhost:8081/changeFriendship', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Access-Control-Allow-Origin': '*',
                                                    },
                                                    body: JSON.stringify({
                                                        token: props.user,
                                                        friendToChange: user.username,
                                                        group: "unfriend"
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
                                                        swal(
                                                            {
                                                                title: "Unfriended!",
                                                                text: "You have Unfriended " + user.username,
                                                                icon: "success",
                                                                button: false,
                                                                timer: 600
                                                            }
                                                        ).then(() => {
                                                            nav('/YourProfile');
                                                        });

                                                    });
                                            }
                                            }>Unfriend</Unfriend>
                                            <Privacy className="friendprivacy" name="friendprivacy" id="ChangeFriendsPrivacy" onChange={(e) => { ChangeFriendsPrivacy(e.target.value) }} value={friendGroup}>
                                                <option value="closefriends">closefriends</option>
                                                <option value="friends">friends</option>
                                                <option value="bestfriends">bestfriends</option>
                                            </Privacy>
                                        </> :
                                        <AddFriend className="addBtn" onClick={() => {
                                            fetch('http://localhost:8081/sendFriendRequest', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Access-Control-Allow-Origin': '*',
                                                },
                                                body: JSON.stringify({
                                                    token: props.user,
                                                    toUsername: user.username
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
                                                    swal(
                                                        {
                                                            title: "Friend Request Sent!",
                                                            text: "You have sent a friend request to " + user.username,
                                                            icon: "success",
                                                            button: false,
                                                            timer: 600
                                                        }
                                                    ).then(() => {
                                                        nav('/YourProfile');
                                                    });
                                                });
                                        }
                                        }>Add Friend</AddFriend>
                                }


                            </p>
                        </li>
                    </ul>

                </div>


                <div class="middle-panel">
                    {posts.map((post) => {
                        return (
                            <div class="post">
                                <div class="post-top">
                                    <div class="dp">
                                        <img src={avatar} alt="" />
                                    </div>
                                    <div class="post-info">
                                        <p class="name">{user.username}</p>
                                        <span class="time">{new Date(post.postDate).toDateString()}</span>
                                    </div>
                                    <i class="fas fa-ellipsis-h"></i>
                                </div>

                                <div class="post-content">
                                    {post.postContent}
                                </div>

                                <div class="post-bottom">
                                    <div class="action">
                                        <i class="fa fa-thumbs-up"></i>
                                        <span><b>Privacy:</b> {post.postPrivacy}</span>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>


                <div class="right-panel">
                    <div class="friends-section">
                        <h4>Friends</h4>
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
                </div>

            </div>
        </>

    )
}

export default UserProfile

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

const Unfriend = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3rem;
  height: 25px;
  border: 2px solid #d33838;
color: #d33838;
    background: transparent;
  font-size: 0.9rem;
  font-family: "Poppins", sans-serif;
  /* text-transform: uppercase; */
  cursor: pointer;
  transition: ease-in-out 0.5s;
  font-weight: bold;
  padding: 0px 3px;

  &:hover {
    background: #d33838;
  color: #fff;
  }
`;

const AddFriend = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3rem;
  height: 25px;
  border: 2px solid #0b6447;
color: #0b6447;
    background: transparent;
  font-size: 0.9rem;
  font-family: "Poppins", sans-serif;
  /* text-transform: uppercase; */
  cursor: pointer;
  transition: ease-in-out 0.5s;
  font-weight: bold;
  padding: 0px 3px;

  &:hover {
    background: #0b6447;
  color: #fff;
  }
`;