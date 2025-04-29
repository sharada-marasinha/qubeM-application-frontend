import axios from 'axios'

export default class UserService {
    getById(id, token) {
        return axios.get(process.env.REACT_APP_API + "users/getbyid/" + id, {
            headers: {
                'Authorization': "Bearer " + token
            }
        });
    }

    isFollowing(userId, followingId, token) {
        return axios.get(process.env.REACT_APP_API + `users/isfollowing?userId=${userId}&followingId=${followingId}`, {
            headers: {
                'Authorization': "Bearer " + token
            }
        });
    }

    // Get all users (for discover page)
    getAll(token) {
        return axios.get(process.env.REACT_APP_API + "users/getall", {
            headers: {
                'Authorization': "Bearer " + token
            }
        });
    }

    // Follow a user
    followUser(userId, followingId, token) {
        return axios.post(process.env.REACT_APP_API + "follows/add",
            { userId, followingId },
            {
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    // Unfollow a user
    unfollowUser(userId, followingId, token) {
        return axios.post(process.env.REACT_APP_API + "follows/delete",
            { userId, followingId },
            {
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    // Get user's followers
    getFollowers(userId, token) {
        return axios.get(process.env.REACT_APP_API + `users/getfollowers/${userId}`, {
            headers: {
                'Authorization': "Bearer " + token
            }
        });
    }

    // Get users that the specified user is following
    getFollowing(userId, token) {
        return axios.get(process.env.REACT_APP_API + `users/getfollowing/${userId}`, {
            headers: {
                'Authorization': "Bearer " + token
            }
        });
    }
}