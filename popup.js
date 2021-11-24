function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}


const getPageCov = function () {
    return new Promise((resolve, reject) => {
        sendMessageToContentScript({type: 'getCov', payload: {}}, function (response) {
            resolve(response)
        });
    })
}


if (localStorage.getItem('formData')) {


} else {
    localStorage.setItem('formData', JSON.stringify({
        projectName: 1,
        projectId: 2,
        dsn: 3,
        commitSha: 4
    }))
}
let formData = JSON.parse(localStorage.getItem('formData'))
console.log(formData, 'formData')

for (const formDataKey in formData) {
    $(`#${formDataKey}`).val(formData[formDataKey])


    //绑定商品名称联想
    $(`#${formDataKey}`).bind('input propertychange', function (val) {
        formData[formDataKey] = $(`#${formDataKey}`).val()
        localStorage.setItem('formData', JSON.stringify(formData))
    });
}


$('#submitForm').click(function (val) {
    getPageCov().then(cov => {
        console.log(cov,'cov')
        console.log(formData)
        const {dsn,commitSha,projectName,projectId} = formData
        $.ajax({
            url:dsn,
            headers : {
                'content-type': 'application/json'
            }, //请求成功的回调函数
            type:'post',
            dataType: "json",
            data:JSON.stringify({
                "projectName": projectName,
                "projectId":projectId,
                "commitSha": commitSha,
                "coverage":cov
            })
        }).then(res=>{
            $('#submitFormRes').html(JSON.stringify(res))
        }).catch(err=>{
            $('#submitFormRes').html(JSON.stringify(err))
        })
    })
})