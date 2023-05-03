let username = "";
const socket = io();

var snd = new Audio("message.mp3");
let colors = ['red','magenta','violet','indigo','blue','aqua','green','lime','orange','orangered'];
let random_color;


document.getElementById('joinBtn').addEventListener('click', (event)=>{
    event.preventDefault();
    username = document.getElementById('username').value;
    if(username.trim() != ""){
        document.querySelector('.form').style.display = "none";
        document.querySelector('.chatRoomCont').style.display = "block";
        document.querySelector('.chatRoomHead').innerHTML =`
        <span id="icon"><img src="chat.png" alt="icon"></span>
        InstaChat - ${username}
         `;
        socket.emit("username enter", username);
        random_color = colors[Math.floor(Math.random() * colors.length)];
    }
    else{
        alert('Username cannopt be Empty!!')
    }
});

document.getElementById("send-btn").addEventListener("click", (event)=>{
    event.preventDefault();
    var msg  = document.getElementById("sendInput"); 
    if(msg.value.trim() !=""){
        const data = {
            username: username,
            message: msg.value,
            color: random_color,
          };
    
        socket.emit("chat message", data);
        addMessage(data, true);
    
        document.getElementById("sendInput").value = "";
    }
    else{
        document.getElementById("sendInput").value = "";
    }
});

socket.on("username enter", (data) => {
    if (data.username !== username) {
        var newDiv = document.createElement("div");
        newDiv.innerHTML = `<p>${data} has joined the chat<p>`
        document.querySelector(".messages").appendChild(newDiv);
    }
});


socket.on("chat message", (data) => {
    if (data.username !== username) {
        addMessage(data, false);
    }
});


function addMessage(data, flag){
    var msgDiv = document.createElement("div");

    msgDiv.innerHTML = `<strong id="rColor" style="color:${data.color};">${data.username}:</strong> ${data.message}`;
    if(flag){
        msgDiv.setAttribute("class","message sent");
    }
    else{
        msgDiv.setAttribute("class","message recieved");
    }
    
    document.querySelector(".messages").appendChild(msgDiv);
    snd.play();
}

document.getElementById("exit-btn").addEventListener("click", () => {
    document.querySelector('.form').style.display = "block";
    document.querySelector('.chatRoomCont').style.display = "none";
    document.querySelector('.chatRoomHead').innerText =`ChatRoom`;
    socket.emit("username exit", username);
  });


socket.on("username exit", (data) => {
    if (data !== username) {
        var newDiv = document.createElement("div");
        newDiv.innerHTML = `<p>${data} has left the chat<p>`
        document.querySelector(".messages").appendChild(newDiv);
    }
});

