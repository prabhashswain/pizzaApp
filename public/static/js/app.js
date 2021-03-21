let cartCounter = document.querySelector('#cartCounter');
let addToCart = document.querySelectorAll('.add-to-cart');

const addCart = (pizza)=>{
    axios.post('/addToCart',pizza).then(res=>{
        cartCounter.innerHTML = res.data.totalQty;
        alert("Pizza Added To Cart")
    }).catch(err=>{
        console.log(err);
    })
}

addToCart.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza);
        addCart(pizza)
    })
})

//remove alert message in orders page after 2 sec
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}

//order tracker
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? JSON.parse(hiddenInput.value) : null
let statuses = document.querySelectorAll('.status_line')

const updateOrder = (order)=>{
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status;
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}
updateOrder(order);

//scoket config
const socket = io()
if (order) {
    socket.emit('join',`order_${order._id}`)
}
socket.on('orderUpdated',data=>{
    const updatedOrder = { ...order }
    updatedOrder.status = data.status
    updateOrder(updatedOrder)
})