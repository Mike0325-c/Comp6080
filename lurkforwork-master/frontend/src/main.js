import {
    fileToDataUrl,
    onEvent,
    onEventByEl,
    getElement,
    hideAllRoles,
    show,
    msgBox,
    apiCall,
    hideOne,
    hideAll,
    getFeedCreateDate,
    validation,
    createDOM
} from './helpers.js';
import { SIZE } from './config.js';

let start = 0;
const owndefaultimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

/**
 * show feed job detail by id
 * @param {*} job
 */
const showFeedDetail = (job) => {
    if (job) {
        hideAllRoles();
        show("#page-feed-detail");
        // show job detail header
        const jobDetailHeaderD = getElement("#job-detail-header");
        jobDetailHeaderD.textContent = "";
        const rowD = document.createElement("div");
        rowD.classList.add("d-flex");
        rowD.classList.add("justify-content-between");
        rowD.classList.add("item-align-center");
        const titleD = document.createElement("div");
        titleD.textContent = job.title;

        rowD.appendChild(titleD);
        apiCall(`/user?userId=${job.creatorId}`, "GET", {})
            .then((data) => {
                let name = data.name;
                localStorage.setItem('name', name);
            });

        const nameD = document.createElement("div");
        const nameS = document.createElement("span");
        const Posted = document.createElement("span");
        Posted.textContent = 'Posted by ';
        nameS.textContent = localStorage.getItem('name');
        nameS.className = "name-post";
        nameD.appendChild(Posted);
        nameD.appendChild(nameS);
        rowD.appendChild(nameD);

        onEventByEl(nameS, "click", () => {
            hideAll();
            show("#profile-screen");
            profile(job.creatorId);
            showFollower(job.creatorId);
        });

        const likeBtnD = document.createElement("button");
        likeBtnD.classList.add("btn");
        likeBtnD.classList.add("btn-sm");
        likeBtnD.classList.add("primary-bg-color");
        likeBtnD.classList.add("text-white");
        likeBtnD.textContent = "Like";
        rowD.appendChild(likeBtnD);
        onEventByEl(likeBtnD, "click", () => {
            apiCall("/job/like", "PUT", { id: parseInt(job.id), turnon: true }).then(res => {
                if (res.error) {
                    msgBox("Error", res.error);
                    return;
                }
                msgBox("Tip", "+1 successfully");
                showFeedDetail(job);
            });
        });
        jobDetailHeaderD.appendChild(rowD);

        const commentContent = document.getElementById("commentContent");
        onEvent("#commentPost", "click", () => {
            show('#comment-group');

        });

        onEvent('#commentConfirm', "click", () => {
            if (commentContent.value == '') {
                msgBox('Error', 'content is null!');
                return;
            }
            let payload = {
                "id": job.id,
                "comment": commentContent.value
            }
            apiCall("/job/comment", "POST", payload).then(res => {
                showFeedDetail(job);
            });
            hideOne('#comment-group');
            msgBox('Tip', 'Successfully comment');

        })
        onEvent('#commentcancel', "click", () => {
            hideOne('#comment-group');
        })
        // show job detail
        const jobDetailD = getElement("#job-detail");
        jobDetailD.textContent = "";

        const firstRowD = document.createElement("div");
        firstRowD.classList.add("row");
        const div1D = document.createElement("div");
        div1D.classList.add("col-md-6");
        div1D.style.whiteSpace = 'nowrap';
        div1D.style.overflow = 'auto';

        div1D.textContent = `Title: ${job.title}`;
        firstRowD.appendChild(div1D);
        const div2D = document.createElement("div");
        div2D.classList.add("col-md-6");
        div2D.textContent = `Create at: ${getFeedCreateDate(job.createdAt)}`;
        div2D.style.whiteSpace = 'nowrap';
        div2D.style.overflow = 'auto';
        firstRowD.appendChild(div2D);
        jobDetailD.appendChild(firstRowD);

        const secondRowD = document.createElement("div");
        secondRowD.classList.add("row");
        secondRowD.classList.add("mt-3");
        const div3D = document.createElement("div");
        div3D.classList.add("col-md-6");
        div3D.style.whiteSpace = 'nowrap';
        div3D.style.overflow = 'auto';
        div3D.textContent = `Description: ${job.description}`;
        secondRowD.appendChild(div3D);
        const div4D = document.createElement("div");
        div4D.classList.add("col-md-6");
        div4D.textContent = `Start: ${job.start}`;
        secondRowD.appendChild(div4D);
        jobDetailD.appendChild(secondRowD);

        const thirdRowD = document.createElement("div");
        thirdRowD.classList.add("mt-3");
        const imgD = document.createElement("img");

        imgD.src = job.image;
        imgD.style.height = `200px`;
        imgD.style.width = `300px`;
        thirdRowD.appendChild(imgD);
        jobDetailD.appendChild(thirdRowD);

        // show likes user
        const likes = job.likes;
        if (likes && likes.length > 0) {
            const jobLikesListD = getElement("#job-likes-list");
            jobLikesListD.textContent = "";
            getElement("#total-like-num").textContent = likes.length;
            for (const like of likes) {
                const listGroupD = document.createElement("div");
                listGroupD.classList.add("list-group");
                const listItemD = document.createElement("li");
                listItemD.classList.add("list-group-item");
                listItemD.classList.add("cursor-pointer");
                listItemD.classList.add("text-warning");
                listItemD.textContent = like.userName;
                onEventByEl(listItemD, "click", () => {
                    hideAll();
                    show("#profile-screen");
                    profile(like.userId);
                    showFollower(like.userId);
                });
                listGroupD.appendChild(listItemD);
                jobLikesListD.appendChild(listGroupD);
            }
        }

        // show comments
        const comments = job.comments;
        if (comments && comments.length > 0) {
            // set total comments number
            getElement("#total-comment-num").appendChild(document.createTextNode(comments.length));
            const pageCommentListD = getElement("#page-comments-list");
            pageCommentListD.textContent = "";
            for (const comment of comments) {
                const cardD = document.createElement("div");

                const cardBodyD = document.createElement("div");
                cardBodyD.classList.add("card-body");
                const commentUserPD = document.createElement("p");
                commentUserPD.classList.add("text-warning");
                commentUserPD.classList.add("cursor-pointer");
                commentUserPD.classList.add("pb-2");
                commentUserPD.style = "border-bottom: 1px dashed #6c757d;";
                commentUserPD.appendChild(document.createTextNode(comment.userName));
                cardBodyD.appendChild(commentUserPD);
                onEventByEl(commentUserPD, "click", () => {
                    hideAll();
                    show("#profile-screen");
                    profile(comment.userId);
                    showFollower(comment.userId);
                });

                const commentDescPD = document.createElement("p");
                commentDescPD.classList.add("text-muted");
                commentDescPD.appendChild(document.createTextNode(comment.comment));
                cardBodyD.appendChild(commentDescPD);
                cardD.appendChild(cardBodyD);
                pageCommentListD.appendChild(cardD);
            }
        }
    }
}

// data fetch region
const pageFeedListD = getElement("#page-feed-list");
const getFeedList = (startIndex, pageFeedListD) => {
    if (localStorage.getItem('token')) {
        apiCall(`/job/feed?start=${startIndex}`).then(res => {
            if (res.error) {
                msgBox("Error", res.error);
                return;
            }
            pageFeedListD.textContent = "";
            const divBlank = createDOM({
                el: 'div', style: {
                    height: "500px"
                }
            });
            pageFeedListD.appendChild(divBlank);
            if (res && res.length > 0) {
                for (const feed of res) {
                    const cardD = createDOM(
                        {
                            el: 'div',
                            className: 'card',
                            style: {
                                width: "20rem"
                            }
                        });
                    const imgD = createDOM(
                        {
                            el: "img",
                            className: 'card-img-top cursor-pointer',
                            style: {
                                height: "14rem"
                            },
                            src: feed.image
                        });
                    cardD.appendChild(imgD);
                    // bind redirect event
                    onEventByEl(imgD, "click", () => {
                        showFeedDetail(feed);
                    });
                    const cardBodyD = createDOM(
                        {
                            el: 'div',
                            className: 'card-body',
                        });
                    const titleD = createDOM(
                        {
                            el: 'h5',
                            textContent: feed.title,
                            style: {
                                whiteSpace: 'nowrap',
                                overflow: 'auto'
                            }
                        });
                    cardBodyD.appendChild(titleD);

                    const descD = createDOM(
                        {
                            el: 'p',
                            className: 'card-text',
                            textContent: feed.description,
                            style: {
                                whiteSpace: "nowrap",
                                overflow: "auto"
                            }
                        });
                    cardBodyD.appendChild(descD);

                    const createdAtD = createDOM(
                        {
                            el: 'p',
                            className: 'text-muted',
                            textContent: getFeedCreateDate(feed.createdAt),
                            style: {
                                fontSize: "0.8rem"
                            },
                        });
                    cardBodyD.appendChild(createdAtD);

                    const linkD = createDOM(
                        {
                            el: 'a',
                            className: 'btn btn-sm text-white primary-bg-color',
                            textContent: "Detail",
                            style: {
                                fontSize: "0.8rem"
                            },
                        });
                    cardBodyD.appendChild(linkD);

                    // // bind redirect event
                    onEventByEl(linkD, "click", () => {
                        showFeedDetail(feed);
                    });
                    cardD.appendChild(cardBodyD);
                    pageFeedListD.appendChild(cardD);
                }
            }
        });
    }
}

const displayFeedPage = () => {
    if (localStorage.getItem("token")) {
        hideAllRoles();
        show("#page-feed");
        getFeedList(start, pageFeedListD);
    } else {
        hideAllRoles();
    }
}

/**
 * Update header showing components
 */
const refreshHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
        hideOne("#guest-module");
        show("#account-module");
    } else {
        hideOne("#account-module");
        show("#guest-module");
    }
}

onEvent("#header-bar-title", "click", () => {
    hideAllRoles();
    searchHide();
    displayFeedPage();
});


// login redirect
onEvent("#nav-login", "click", () => {
    hideAllRoles();
    hideOne('.first-background');
    show("#page-login");

});

// login submit handler
// register redirect
onEvent("#nav-register", "click", () => {
    hideAllRoles();
    hideOne('.first-background');
    show("#page-register");
});

/**
 * Login event handler
 */
onEvent("#login-button", "click", () => {
    const loginEmail = document.getElementById("login-email").value;
    const loginPwd = document.getElementById("login-password").value;

    if (!loginEmail) {
        msgBox("Error", "Email is empty!");
        return;
    }
    if (!loginPwd) {
        msgBox("Error", "Password is empty!");
        return;
    }
    const loginData = {
        email: loginEmail,
        password: loginPwd
    };
    apiCall("/auth/login", "POST", loginData).then(res => {
        if (res.error) {
            msgBox("Error", res.error);
            return;
        }
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        hideAllRoles();
        refreshHeader();
        displayFeedPage();
        show(".Container_search");
    });
});

/**
 * Logout event handler
 */
onEvent("#logout-button", "click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    hideOne("#account-module");
    searchHide();
    refreshHeader();
    displayFeedPage();

});

/**
 * Register event handler
 */
onEvent("#register-button", "click", () => {
    const registerEmail = document.getElementById("register-email").value;
    const registerName = document.getElementById("register-name").value;
    const registerPwd = document.getElementById("register-password").value;
    const registerCfmPwd = document.getElementById("register-cfm-password").value;
    if (validation(registerEmail, registerName, registerPwd) === 1) {
        msgBox("Error", "The email must contain at least one number, one letter, one special character and the length should be between 8 and 30.");
        return;
    }
    if (validation(registerEmail, registerName, registerPwd) === 2) {
        msgBox("Error", "the length of name should not be less than 4.");
        return;
    }
    if (validation(registerEmail, registerName, registerPwd) === 3) {
        msgBox("Error", "The password must contain at least one number, one letter and the length should be between 8 and 30.");
        return;
    }
    if (registerPwd != registerCfmPwd) {
        msgBox("Error", "The confirm password is not same to the password!");
        return;
    }
    const registerData = {
        email: registerEmail,
        name: registerName,
        password: registerPwd,
    };
    apiCall("/auth/register", "POST", registerData).then(res => {
        if (res.error) {
            msgBox("Error", res.error);
            return;
        }
        msgBox("Tip", "Registered successfully!");
        hideAllRoles();
        show("#page-login");
    });
});

/**
  * Add close event for the message box
*/
onEvent(".message-box .close-btn", "click", () => {
    const messageBoxD = getElement(".message-box");
    if (!messageBoxD.classList.contains("d-none")) {
        messageBoxD.classList.add("d-none");
    }
});

window.onload = () => {
    refreshHeader();
    displayFeedPage();
    searchHide();

}

function searchHide() {
    if (localStorage.getItem('token')) {
        show(".Container_search");
        hideOne('.first-background');
    } else {
        hideOne(".Container_search");
        show('.first-background');
    }
};

//profile
const profileJobList = document.querySelector('.profile-job-list');
const profileFeedList = (startIndex, profileJobList) => {
    if (localStorage.getItem('token')) {
        apiCall(`/job/feed?start=${startIndex}`).then(res => {
            if (res.error) {
                msgBox("Error", res.error);
                return;
            }
            profileJobList.textContent = "";
            if (res && res.length > 0) {
                for (const feed of res) {
                    if (feed.creatorId == localStorage.getItem('userId')) {
                        const cardD = createDOM(
                            {
                                el: 'div',
                                className: 'card',
                                style: {
                                    width: "20rem"
                                }
                            });
                        const imgD = createDOM(
                            {
                                el: "img",
                                className: 'card-img-top cursor-pointer',
                                style: {
                                    height: "14rem"
                                },
                                src: feed.image
                            });
                        cardD.appendChild(imgD);

                        const cardBodyD = createDOM(
                            {
                                el: 'div',
                                className: 'card-body',
                            });
                        const titleD = createDOM(
                            {
                                el: 'h5',
                                textContent: feed.title,
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'auto'
                                }
                            });
                        cardBodyD.appendChild(titleD);

                        const descD = createDOM(
                            {
                                el: 'p',
                                className: 'card-text',
                                textContent: feed.description,
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'auto'
                                }

                            });
                        cardBodyD.appendChild(descD);

                        const createdAtD = createDOM(
                            {
                                el: 'p',
                                className: 'text-muted',
                                textContent: getFeedCreateDate(feed.createdAt),
                                style: {
                                    fontSize: "0.8rem"
                                },
                            });
                        cardBodyD.appendChild(createdAtD);

                        const deleteJob = document.createElement('button');
                        deleteJob.classList.add("btn");
                        deleteJob.classList.add("btn-danger");
                        deleteJob.classList.add("delete-job");
                        deleteJob.textContent = "delete";
                        deleteJob.style.position = '20px'
                        cardBodyD.appendChild(deleteJob);

                        //delete a job
                        onEventByEl(deleteJob, "click", () => {
                            apiCall(`/job`, "DELETE", { 'id': `${feed.id}` })
                                .then((data) => {
                                    profileFeedList(start, profileJobList);
                                });
                        });

                        const updateJob = document.createElement('button');
                        updateJob.classList.add("btn");
                        updateJob.classList.add("btn-success");
                        updateJob.textContent = "update";
                        updateJob.style.position = '20px'
                        cardBodyD.appendChild(updateJob);
                        cardD.appendChild(cardBodyD);
                        profileJobList.appendChild(cardD);

                        onEventByEl(updateJob, "click", () => {
                            hideOne('#total_profile');
                            hideOne('#return');
                            hideOne('#Unwatch-btn');
                            hideOne('#Watch-btn');
                            show('.update-job');
                            localStorage.setItem('createid', feed.id);
                        });
                        onEvent('#update-job-Cancel', 'click', () => {
                            hideOne('.update-job');
                            show('#total_profile');
                            show('#return');
                        })
                    }
                    onEvent('#update-job-Confirm', 'click', () => {
                        const updatejobForm = document.forms.updatejobForm;
                        const updateTitle = updatejobForm.title.value;
                        const updateImg = updatejobForm.img.value;
                        const updateDescription = updatejobForm.content.value;
                        let date = new Date();
                        let date_string = `${date.getUTCFullYear()}-${date.getMonth() + 1}-${date.getDate()}${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`
                        let payload = {
                            "id": `${localStorage.getItem('createid')}`,
                            "title": updateTitle,
                            "image": updateImg,
                            "start": date_string,
                            "description": updateDescription
                        }
                        updatejobForm.reset();
                        apiCall(`/job`, "PUT", payload)
                            .then((data) => {

                                profileFeedList(start, profileJobList);
                            });
                    })
                }
            }
        });
    }
}

const followerlist = document.querySelector('.follower-list');
profileFeedList(start, profileJobList);
profileJobList.style.overflow = 'hide';
onEvent("#own-profile", "click", () => {
    hideAll();
    show("#profile-screen");
    while (followerlist.hasChildNodes()) {
        followerlist.removeChild(followerlist.firstChild);
    }
    showFollower(localStorage.getItem("userId"));
    profile(localStorage.getItem("userId"));
})

let profileForm = document.forms.profileform;
const showFollower = (id) => {
    apiCall(`/user?userId=${id}`, "GET", {})
        .then((data) => {
            for (const item of data.watcheeUserIds) {
                apiCall(`/user?userId=${item}`, "GET", {})
                    .then((data) => {
                        const follower = document.createElement('li');
                        follower.classList.add('Followers');
                        follower.textContent = data.name;
                        followerlist.appendChild(follower);
                        onEventByEl(follower, 'click', () => {

                            hideOne("#profile-screen");
                            show("#profile-screen");
                            profile(data.id);
                            while (followerlist.hasChildNodes()) {
                                followerlist.removeChild(followerlist.firstChild);
                            }
                            showFollower(data.id);

                        });
                    });
            }
        });
}

//profile information
const profile = (id) => {
    apiCall(`/user?userId=${id}`, "GET", {})
        .then((data) => {
            let bool = 0;
            for (const item of data.watcheeUserIds) {
                if (item == localStorage.getItem('userId')) {
                    bool = 1;
                }
            }
            if (bool) {
                show('#Unwatch-btn');
                hideOne('#Watch-btn');
            } else {
                show('#Watch-btn');
                hideOne('#Unwatch-btn');
            }

            if (id == localStorage.getItem('userId')) {
                show('#update');
                hideOne('#Watch-btn');
                hideOne('#Unwatch-btn');
            };
            profileForm.name.value = data.name;
            profileForm.email.value = data.email;
            profileForm.id.value = data.id;
            if (data.image) {
                let img = document.getElementById('update-i');
                img.src = data.image;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.borderRadius = '50px';
                img.style.position = 'relative';
                img.style.top = `22px`;
            } else {
                let img = document.getElementById('update-i');
                img.src = owndefaultimg;
                img.style.width = '100px';
                img.style.height = '100px';
            }
            onEvent("#Watch-btn", "click", (event) => {
                event.preventDefault();
                hideOne('#Watch-btn');
                show('#Unwatch-btn')
                const requestBody = {
                    email: profileForm.email.value,
                    turnon: true,
                };
                apiCall("/user/watch", "PUT", requestBody)
                    .then((data) => {
                        if (data.error) {
                            console.log(data.error);
                        } else {
                            console.log(data);
                        }
                    })
            })
            onEvent("#Unwatch-btn", "click", (event) => {
                event.preventDefault();
                hideOne('#Unwatch-btn');
                show('#Watch-btn')
                const requestBody = {
                    email: profileForm.email.value,
                    turnon: false,
                };
                apiCall("/user/watch", "PUT", requestBody)
                    .then((data) => {
                        if (data.error) {
                            console.log(data.error);
                        } else {
                            console.log(data);
                        }
                    })
            })
        });
};

//return btn
onEvent('#return', 'click', () => {
    hideOne("#profile-screen");
    show(".headerMain");
    displayFeedPage();
})

onEvent('#returnHome', 'click', () => {
    hideOne("#profile-screen");
    show(".headerMain");
    displayFeedPage();
})

// update the profile
const updateForm = document.forms.updateForm;
onEvent("#update", 'click', () => {
    updateForm.email.value = profileForm.email.value;
    updateForm.name.value = profileForm.name.value;
    updateForm.updateImg.value = document.getElementById('update-i').src;
    hideOne('#profile-screen');
    show('#update-profile');
});

const profile_update = (form, img) => {
    const newEmail = updateForm.email.value;
    const newPassword = updateForm.password.value;
    const newName = updateForm.name.value;

    const updateInformation = {
        email: newEmail,
        password: newPassword,
        name: newName,
        image: img,
    };
    apiCall("/user", "PUT", updateInformation)
        .then((data) => {
            if (data.error) {
                alert(data.error);
            }
        })
}

onEvent('#cancel-btn', 'click', (event) => {
    event.preventDefault();
    updateForm.reset();
    hideOne('#update-profile');
    show('#profile-screen');
});

onEvent('#confirm-btn', 'click', (event) => {
    event.preventDefault();
    const img = updateForm.updateImg.value;
    if (updateForm.email.value === profileForm.email.value) {
        alert("the same email");
    } else {
        profile_update(updateForm, img);
        profile(localStorage.getItem('userId'));
        hideOne('#update-profile');
        show('#profile-screen');
    }
})

//watch a user
const searchForm = document.forms.searchForm;
onEvent('#searchUser', 'click', (event) => {
    event.preventDefault();
    const requestBody = {
        email: searchForm.email.value,
        turnon: true,
    };
    if (searchForm.email.value === '') {
        alert("the null email");
    } else {
        searchForm.reset();

        apiCall("/user/watch", "PUT", requestBody)
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    msgBox('Error', data.error);
                } else {
                    console.log(data);
                    msgBox('Tip', 'Successfully watch');
                }
            })
    }
})

const jobForm = document.forms.jobForm;
onEvent('#create-job-fake', 'click', () => {
    hideAll();
    show('.job-screen');

})

onEvent('#job-Cancel', 'click', () => {
    jobForm.reset();
    hideOne('.job-screen');
    show(".headerMain");
    show(".container");
    show("#page-feed");

})

onEvent('#job-Confirm', 'click', () => {
    let date = new Date();
    let date_string = `${date.getUTCFullYear()}-${date.getMonth() + 1}-${date.getDate()}${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const payload = {
        "title": jobForm.title.value,
        "image": jobForm.img.value,
        "start": date_string,
        "description": jobForm.content.value
    };
    apiCall('/job', 'POST', payload);
    msgBox('Tips', 'Successfully post');
    hideOne('.job-screen');
    show(".headerMain");
    show(".container");
    show("#page-feed");
})





pageFeedListD.addEventListener("scroll", () => {
    if (parseInt(pageFeedListD.scrollHeight) - (parseInt(pageFeedListD.clientHeight) + parseInt(pageFeedListD.scrollTop)) <= 2) {
        if(start < 5) {
            setTimeout(() => {
                start += 5;
                getFeedList(start, pageFeedListD);
                getFeedList(start, pageFeedListD);
            }, 100);
        
        }
            
    }
    if (parseInt(pageFeedListD.scrollTop) == 0) {
        if(start >= 5) {
            setTimeout(() => {
                start -= 5;
                getFeedList(start, pageFeedListD);
            }, 100);
        }
       
    }
});
