$('#checkout').click(async function (event) {
  console.log("hello");
  event.preventDefault();
  let addId = $("#addresses input[type=radio]").val();
  let uri = "http://localhost:8081/cart-service/checkout?addressId=" + addId;
  let data = await fetch(uri).then(response => response.json())
  //console.log(data);

  var obj = {
    totalBill: data.totalBill,
    emailId: data.emailId,
    receiptId: data.receiptId,
    userId: data.userId,
    mobileNo: data.mobileNo
  }

  console.log(obj);
  $(this).prop("disabled", true);

  getData(obj).then(response => {

    var information = {
      action: "https://securegw-stage.paytm.in/order/process",
      params: response
    }
    //console.log(response);
    post(information)

  })

})

const getData = (data) => {

  return fetch(`http://localhost:5000/payment`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => response.json()).catch(err => console.log(err))
}

function buildForm({ action, params }) {
  const form = document.createElement('form')
  form.setAttribute('method', 'post')
  form.setAttribute('action', action)

  Object.keys(params).forEach(key => {
    const input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', key)
    input.setAttribute('value', stringifyValue(params[key]))
    form.appendChild(input)
  })

  return form
}

function post(details) {
  const form = buildForm(details)
  document.body.appendChild(form)
  form.submit()
  form.remove()
}

function isDate(val) {
  // Cross realm comptatible
  return Object.prototype.toString.call(val) === '[object Date]'
}

function isObj(val) {
  return typeof val === 'object'
}

function stringifyValue(val) {
  if (isObj(val) && !isDate(val)) {
    return JSON.stringify(val)
  } else {
    return val
  }
}