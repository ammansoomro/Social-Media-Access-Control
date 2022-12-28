import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function YourProfile(props) {
    const [data, setData] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        // Sleep for 2 seconds
        setTimeout(() => {
            if (props.user === null) {
                nav('/login');
            }
        }, 2000);
        console.log(props.user);
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
    }, [props.user]);

    if (data === null) {
        return <div>Loading...</div>
    } else {
        return (
            <div className="profile">
                <h1>Profile</h1>
                <p>{data.username}</p>
                <p>Your Email: {data.email}</p>
                <p>Your DoB: {new Date(data.DOB).toDateString()}</p>
                <button onClick={() => {
                    localStorage.removeItem('token');
                    nav('/login');
                }}>Logout</button>
                <h3>Your Posts</h3>
                <div className="posts">
                    {data.posts.map(post => (
                        <div className="post">
                            <h4>{data.poster}</h4>
                            <p>{post.postContent}
                                {new Date(post.postDate).toDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default YourProfile;