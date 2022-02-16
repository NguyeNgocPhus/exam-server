
const socket =io("http://localhost:3000");

socket.on('login',(data)=>{
  console.log(data);
})
socket.on('auth',(data)=>{
  console.log(data);
})

document.querySelector('.login').addEventListener('click',()=>{
  socket.emit('login',{
    command:1000,
    token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBjYjQ1MmE5NGMyOTMxNDA1YmM1YmMiLCJzdHVkZW50SWQiOiIwMDAwMSIsImlhdCI6MTY0NDk5OTc3NX0.hiteC9GyvNEdDhLjHWKyjts45Lx7MNYO_uV_kaIXY3k"
  })
})
document.querySelector('.disconnect').addEventListener('click',()=>{
  console.log("disconnect");
})